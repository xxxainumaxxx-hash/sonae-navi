#!/usr/bin/env python3
"""チャンネルの声を作る：python3 voice.py <話ID>

- 台本は episodes/<話ID>.mjs のナレーション（node で読み出す）
- ElevenLabs（Otani・eleven_v3）で場面ごとに声を作り、「どの文字を何秒に読んだか」も受け取る
- 0.3秒以上の間を0.25秒に詰めて、1.35倍速にする（音の高さは変えない）
- 出力：voice/<話ID>/NN.mp3 と NN.json（各行の開始・終了秒。animate.mjs が絵のタイミング合わせに使う）
- APIキーは環境のネットワーク設定で自動的に付く（コードには書かない）
"""
import base64, json, os, re, subprocess, sys, tempfile

VOICE_ID = '3JDquces8E8bkmvbh6Bc'  # Otani
MODEL = 'eleven_v3'
GAP_MAX = 0.30   # これより長い間は
GAP_KEEP = 0.25  # この長さに詰める
TEMPO = 1.35
HEAD, TAIL = 0.12, 0.3  # 語尾が切れないよう、うしろは少し長めに残す

ROOT = os.path.dirname(os.path.abspath(__file__))


def narration(ep):
    js = ("import(process.argv[1]).then(m=>console.log(JSON.stringify(m.scenes.map(s=>s.narration||[]))))")
    out = subprocess.check_output(['node', '-e', js, os.path.join(ROOT, 'episodes', f'{ep}.mjs')], cwd=ROOT)
    return json.loads(out)


def tts(text, tmp):
    body = os.path.join(tmp, 'body.json')
    with open(body, 'w') as f:
        json.dump({'text': text, 'model_id': MODEL}, f, ensure_ascii=False)
    out = os.path.join(tmp, 'resp.json')
    for attempt in range(4):
        code = subprocess.check_output(['curl', '-sS', '-o', out, '-w', '%{http_code}', '-X', 'POST',
            f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps?output_format=mp3_44100_128',
            '-H', 'Content-Type: application/json', '--data', '@' + body]).decode()
        if code == '200':
            return json.load(open(out))
        print(f'  retry ({code})', file=sys.stderr)
        subprocess.run(['sleep', str(2 ** (attempt + 1))])
    raise SystemExit('ElevenLabs request failed')


def readings():
    p = os.path.join(ROOT, 'voice', 'readings.json')
    d = json.load(open(p)) if os.path.exists(p) else {}
    # 長い言葉から先に置きかえる（「山内房治郎」を「房治郎」より先に）
    return sorted(((k, v) for k, v in d.items() if not k.startswith('_')), key=lambda kv: -len(kv[0]))


ONES = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう']
HUND = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく']
THOU = ['', 'せん', 'にせん']


def year_kana(y):
    """1980 → せんきゅうひゃくはちじゅう（年号は数字のままだと読み間違えるので、ひらがなにする）"""
    th, rest = divmod(y, 1000)
    h, rest = divmod(rest, 100)
    t, o = divmod(rest, 10)
    tens = (ONES[t] if t > 1 else '') + ('じゅう' if t else '')
    ones = {4: 'よ'}.get(o, ONES[o]) if o else ''  # 「〜4年」は「よねん」
    return THOU[th] + HUND[h] + tens + ones


KDIG = '〇一二三四五六七八九'


def kanji_num(n):
    """1980 → 千九百八十、19800 → 一万九千八百（年号と値段は漢数字で読ませると自然。聞き比べで決定）"""
    def under(n):
        out = ''
        for v, u in ((1000, '千'), (100, '百'), (10, '十')):
            d, n = divmod(n, v)
            if d:
                out += ('' if d == 1 else KDIG[d]) + u
        return out + (KDIG[n] if n else '')
    man, rest = divmod(n, 10000)
    return (under(man) + '万' if man else '') + under(rest)


def speakable(line, table):
    # 長い言葉を優先して、1回で置きかえる（「横井軍平」を残したまま「横井」だけ置きかえられるように）
    if table:
        d = dict(table)
        pat = re.compile('|'.join(re.escape(k) for k, _ in table))
        line = pat.sub(lambda m: d[m.group(0)], line)
    # 「14,800円」のような3桁区切りのカンマは読み間違えるので、声では外す（字幕はそのまま）
    # 年号は漢数字で。ただし「四十」は「よんじゅう」、最後の「九年」は「きゅうねん」と読ませる（「しじゅう」「くねん」と読むので）
    def year(m):
        k = kanji_num(int(m.group(1))).replace('四十', 'よんじゅう')
        return (k[:-1] + 'きゅう' if k.endswith('九') else k) + '年'
    line = re.sub(r'(?<![\d])(1\d{3}|20\d{2})年', year, line)
    # 短い言葉の「」は、声では外す（前後で変に区切れるので）。長いセリフの「」は残す
    # ただし「ボタン「十字キー」」のように名詞のすぐ後ろなら、読点で区切る
    line = re.sub(r'(?<=[ァ-ヶー一-龥])「([^」]{1,6})」', r'、\1', line)
    line = re.sub(r'「([^」]{1,6})」', r'\1', line)
    line = re.sub(r'(?<=\d),(?=\d{3})', '', line)
    # 5桁以上の数は「万」で区切ると正しく読む（14800 → 1万4800）
    line = re.sub(r'(?<![\d.])\d{5,8}(?![\d.])', lambda m: kanji_num(int(m.group(0))), line)
    return line


def build(lines, dst_mp3, dst_json, tmp, overrides=None):
    table = readings()
    shown = lines                                   # 字幕に出す文（漢字のまま）
    # 声に読ませる文（読み方の辞書で置きかえ。行ごとの指定 overrides があればそちらを使う）
    lines = [(overrides or {}).get(i) or speakable(l, table) for i, l in enumerate(lines)]
    text = ''.join(lines)
    r = tts(text, tmp)
    raw = os.path.join(tmp, 'raw.mp3')
    open(raw, 'wb').write(base64.b64decode(r['audio_base64']))
    a = r['alignment']
    st, en = a['character_start_times_seconds'], a['character_end_times_seconds']
    n = len(st)
    # 残す区間（元の音声の時刻）を作る：長い間を GAP_KEEP に詰める
    segs = []
    # 1行だけ作り直すときは、出だしの子音が切れないように前を長めに残す
    cur = max(0.0, st[0] - (0.3 if len(lines) == 1 else HEAD))
    for i in range(n - 1):
        gap = st[i + 1] - en[i]
        if gap > GAP_MAX:
            segs.append((cur, en[i] + GAP_KEEP / 2))
            cur = st[i + 1] - GAP_KEEP / 2
    segs.append((cur, en[-1] + TAIL))

    def remap(t):  # 元の時刻 → 詰めて速くした後の時刻
        acc = 0.0
        for s0, s1 in segs:
            if t <= s1:
                return (acc + max(0.0, t - s0)) / TEMPO
            acc += s1 - s0
        return acc / TEMPO

    parts = ''.join(f'[0:a]atrim={s0:.3f}:{s1:.3f},asetpts=PTS-STARTPTS[s{k}];' for k, (s0, s1) in enumerate(segs))
    fc = parts + ''.join(f'[s{k}]' for k in range(len(segs))) + f'concat=n={len(segs)}:v=0:a=1,atempo={TEMPO}[a]'
    subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-filter_complex', fc, '-map', '[a]', '-b:a', '160k', dst_mp3])
    # 各行の開始・終了（文字の位置から）
    out, pos = [], 0
    if len(a['characters']) != len(text):
        print('  ! alignment length differs from text; using proportional fallback', file=sys.stderr)
    for line in lines:
        i0, i1 = pos, min(pos + len(line), n) - 1
        out.append({'line': shown[len(out)], 'spoken': line, 'start': round(remap(st[min(i0, n - 1)]), 3), 'end': round(remap(en[max(i1, 0)]), 3)})
        pos += len(line)
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst_mp3]))
    json.dump({'duration': dur, 'lines': out}, open(dst_json, 'w'), ensure_ascii=False, indent=1)
    return dur


def load_overrides(vd):
    p = os.path.join(vd, 'overrides.json')
    return json.load(open(p)) if os.path.exists(p) else {}


def _onset_before(mp3, t, floor):
    """t より前で、声が始まる直前の無音の位置を返す（floor より前には戻らない）"""
    import numpy as np
    sr = 16000
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-ss', f'{max(0, t - 0.6):.3f}', '-to', f'{t + 0.05:.3f}', '-i', mp3, '-f', 's16le', '-ac', '1', '-ar', str(sr), '-'])
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    base = max(0, t - 0.6); fr = sr // 100
    env = [float(np.sqrt(np.mean(x[i:i + fr] ** 2))) for i in range(0, max(0, len(x) - fr), fr)]
    i = len(env) - 1; quiet = 0
    while i > 0:
        quiet = quiet + 1 if env[i] < 0.03 else 0
        if quiet >= 6: break
        i -= 1
    cut = base + (i + quiet // 2) / 100
    return max(floor, min(t, cut))


def patch_lines(ep, ids, scenes, vd, tmp):
    """指定した行（例 04-1）だけ声を作り直して、場面の音声に差し込む。ほかの行の音声はそのまま残す"""
    ov = load_overrides(vd)
    by_scene = {}
    for rid in ids:
        sn, ln = rid.split('-'); by_scene.setdefault(sn, []).append(int(ln) - 1)
    for sn, idxs in by_scene.items():
        mp3, js = os.path.join(vd, f'{sn}.mp3'), os.path.join(vd, f'{sn}.json')
        d = json.load(open(js))
        for k in sorted(idxs, reverse=True):          # 後ろの行から差し込む（前の行の時刻がずれないように）
            lines = d['lines']
            line_text = scenes[int(sn) - 1][k]
            one_mp3, one_js = os.path.join(tmp, 'one.mp3'), os.path.join(tmp, 'one.json')
            build([line_text], one_mp3, one_js, tmp, {0: ov.get(f'{sn}-{k + 1}')})
            one = json.load(open(one_js))
            a = lines[k]['start']
            # 古い行の本当の出だしは、記録された start より少し前にあることがある。
            # start で切ると古い出だしが残って「ダブり」になるので、出だしの前の無音まで戻って切る
            a = _onset_before(mp3, a, lines[k - 1]['end'] if k > 0 else 0.0)
            b = lines[k + 1]['start'] if k + 1 < len(lines) else d['duration']
            new_len = one['duration'] + (GAP_KEEP if k + 1 < len(lines) else 0)
            seg = os.path.join(tmp, 'spliced.mp3')
            fc = (f"[0:a]atrim=0:{a:.3f},asetpts=PTS-STARTPTS[x];[1:a]apad=pad_dur={GAP_KEEP if k + 1 < len(lines) else 0},asetpts=PTS-STARTPTS[y];"
                  f"[0:a]atrim=start={b:.3f},asetpts=PTS-STARTPTS[z];[x][y][z]concat=n=3:v=0:a=1[a]")
            subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', mp3, '-i', one_mp3, '-filter_complex', fc, '-map', '[a]', '-b:a', '160k', seg])
            subprocess.check_call(['cp', seg, mp3])
            shift = a + new_len - b
            lines[k] = dict(one['lines'][0], line=line_text, start=round(a + one['lines'][0]['start'], 3), end=round(a + one['lines'][0]['end'], 3))
            for j in range(k + 1, len(lines)):
                lines[j]['start'] = round(lines[j]['start'] + shift, 3); lines[j]['end'] = round(lines[j]['end'] + shift, 3)
            d['duration'] = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]))
            json.dump(d, open(js, 'w'), ensure_ascii=False, indent=1)
            print(f'{sn}-{k + 1}: 作り直して差し込み（{one["lines"][0]["spoken"]}）')


def main():
    ep = sys.argv[1]
    # --lines 04-1,04-5：その行だけ作り直して差し込む（ほかの行の音声は変えない）
    if '--lines' in sys.argv:
        ids = sys.argv[sys.argv.index('--lines') + 1].split(',')
        vd = os.path.join(ROOT, 'voice', ep)
        with tempfile.TemporaryDirectory() as tmp:
            patch_lines(ep, ids, narration(ep), vd, tmp)
        return
    only = set(int(x) for x in sys.argv[2:])  # 場面番号を指定すると、その場面だけ作り直す
    vd = os.path.join(ROOT, 'voice', ep)
    os.makedirs(vd, exist_ok=True)
    total = 0
    with tempfile.TemporaryDirectory() as tmp:
        for i, lines in enumerate(narration(ep), 1):
            if not lines or (only and i not in only):
                continue
            n = f'{i:02d}'
            ov = {int(k.split('-')[1]) - 1: v for k, v in load_overrides(vd).items() if k.split('-')[0] == n}
            d = build(lines, os.path.join(vd, f'{n}.mp3'), os.path.join(vd, f'{n}.json'), tmp, ov)
            total += d
            print(f'{n}: {d:.1f}秒  ({sum(len(l) for l in lines)}字)')
    print(f'合計 {total:.1f}秒')


if __name__ == '__main__':
    main()
