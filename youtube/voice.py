#!/usr/bin/env python3
"""チャンネルの声を作る：python3 voice.py <話ID>

- 台本は episodes/<話ID>.mjs のナレーション（node で読み出す）
- ElevenLabs（Otani・eleven_v3）で場面ごとに声を作り、「どの文字を何秒に読んだか」も受け取る
- 0.3秒以上の間を0.25秒に詰めて、1.35倍速にする（音の高さは変えない）
- 出力：voice/<話ID>/NN.mp3 と NN.json（各行の開始・終了秒。animate.mjs が絵のタイミング合わせに使う）
- APIキーは環境のネットワーク設定で自動的に付く（コードには書かない）
"""
import base64, json, os, subprocess, sys, tempfile

VOICE_ID = '3JDquces8E8bkmvbh6Bc'  # Otani
MODEL = 'eleven_v3'
GAP_MAX = 0.30   # これより長い間は
GAP_KEEP = 0.25  # この長さに詰める
TEMPO = 1.35
HEAD, TAIL = 0.05, 0.15

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


def speakable(line, table):
    for k, v in table:
        line = line.replace(k, v)
    return line


def build(lines, dst_mp3, dst_json, tmp):
    table = readings()
    shown = lines                                   # 字幕に出す文（漢字のまま）
    lines = [speakable(l, table) for l in lines]    # 声に読ませる文（読み方の辞書で置きかえ）
    text = ''.join(lines)
    r = tts(text, tmp)
    raw = os.path.join(tmp, 'raw.mp3')
    open(raw, 'wb').write(base64.b64decode(r['audio_base64']))
    a = r['alignment']
    st, en = a['character_start_times_seconds'], a['character_end_times_seconds']
    n = len(st)
    # 残す区間（元の音声の時刻）を作る：長い間を GAP_KEEP に詰める
    segs = []
    cur = max(0.0, st[0] - HEAD)
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


def main():
    ep = sys.argv[1]
    only = set(int(x) for x in sys.argv[2:])  # 場面番号を指定すると、その場面だけ作り直す
    vd = os.path.join(ROOT, 'voice', ep)
    os.makedirs(vd, exist_ok=True)
    total = 0
    with tempfile.TemporaryDirectory() as tmp:
        for i, lines in enumerate(narration(ep), 1):
            if not lines or (only and i not in only):
                continue
            n = f'{i:02d}'
            d = build(lines, os.path.join(vd, f'{n}.mp3'), os.path.join(vd, f'{n}.json'), tmp)
            total += d
            print(f'{n}: {d:.1f}秒  ({sum(len(l) for l in lines)}字)')
    print(f'合計 {total:.1f}秒')


if __name__ == '__main__':
    main()
