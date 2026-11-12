#!/usr/bin/env python3
"""声をユーザーに渡す前の、こちら側の総点検：python3 selfcheck.py <話ID> [--fix]

1行ずつ、本編・チェックページと同じ区間（前後の無音のまん中）で切り出して文字起こしし、次を調べる。
  ・台本との一致率（数字・漢数字・かな・記号のちがいはそろえてから比べる）
  ・語尾や頭が欠けていないか（聞き取れた文字数が台本より大きく少ない）
  ・頭のダブり（「そ、その」のように、最初の音がくり返されている）
  ・名前などの大事な言葉（NAMES）がちゃんと聞き取れているか
  ・年号から始まる行（イントネーションが崩れやすいので、台本を書き直す）
--fix を付けると、引っかかった行だけを声を4本作り直して、条件を満たす1本を差し込む（ほかの行には触れない）。
"""
import json, os, re, subprocess, sys, difflib, tempfile, base64
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)
import voice, voicecheck

NAMES = {'09-asics': ['喜八郎'], '12-sanrio': ['辻'], '13-honda': ['藤沢']}
TH = 0.85


def stt(path):
    r = subprocess.run(['curl', '-sS', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-F', 'model_id=scribe_v1',
                        '-F', 'language_code=jpn', '-F', f'file=@{path}'], capture_output=True, text=True)
    try: return json.loads(r.stdout).get('text', '')
    except Exception: return ''


try:
    import pykakasi
    _kks = pykakasi.kakasi()
    def kana(s): return ''.join(x['hira'] for x in _kks.convert(s))
except Exception:
    def kana(s): return s


def judge(ep, line, heard):
    # 漢字とかなの書き方のちがい（かわいい／可愛い）で引っかからないよう、両方ともひらがなの読みにしてから比べる
    a, b = kana(voicecheck.norm(line)), kana(voicecheck.norm(heard))
    sim = difflib.SequenceMatcher(None, a, b).ratio() if b else 0.0
    why = []
    if sim < TH: why.append(f'一致率{sim:.2f}')
    if len(b) < len(a) * 0.85: why.append('欠けている？')
    if a and b and a[:2] not in b[:5]: why.append('頭が欠けている？')
    if a and b and a[-2:] not in b[-5:]: why.append('語尾が欠けている？')
    if re.match(r'^(.{1,2})[、,]?\s?\1', heard) and not re.match(r'^(.{1,2})[、,]?\s?\1', line): why.append('頭のダブり？')
    for w in NAMES.get(ep, []):
        if w in line and w not in heard: why.append(f'「{w}」が聞き取れない')
    if re.match(r'^[0-9０-９]+年', line): why.append('年号で始まる（台本を書き直す）')
    return sim, why


def scan(ep, only=None):
    vd = os.path.join(ROOT, 'voice', ep)
    jobs = []
    with tempfile.TemporaryDirectory() as tmp:
        for f in sorted(os.listdir(vd)):
            if not re.fullmatch(r'\d\d\.json', f): continue
            sn = f[:-5]
            d = voice.realign(vd, sn); L = d['lines']; env = voice._env(os.path.join(vd, sn + '.mp3'))
            for k, l in enumerate(L):
                rid = f'{sn}-{k + 1}'
                if only and rid not in only: continue
                a, b = voice.line_bounds(env, L, k, d['duration'])
                c = os.path.join(tmp, rid + '.mp3')
                subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(vd, sn + '.mp3'), '-ss', f'{a:.3f}', '-to', f'{b:.3f}', c])
                jobs.append((rid, l['line'], c))
        with ThreadPoolExecutor(2) as ex:
            heard = list(ex.map(lambda j: stt(j[2]), jobs))
    out = []
    for (rid, line, _), h in zip(jobs, heard):
        sim, why = judge(ep, line, h)
        out.append({'id': rid, 'line': line, 'heard': h, 'sim': round(sim, 2), 'why': why})
    return out


def fix(ep, bad):
    """引っかかった行だけ、声を4本作り直して条件を満たすものを差し込む"""
    vd = os.path.join(ROOT, 'voice', ep)
    sc = voice.narration(ep); ov = voice.load_overrides(vd)
    orig = voice.tts
    for r in bad:
        sn, k = r['id'].split('-'); k = int(k) - 1
        text = ov.get(r['id']) or voice.speakable(sc[int(sn) - 1][k], voice.readings())
        line = sc[int(sn) - 1][k]
        best = {}
        def gen(i):
            d = tempfile.mkdtemp(); resp = orig(text, d)
            mp3 = os.path.join(d, 'a.mp3'); open(mp3, 'wb').write(base64.b64decode(resp['audio_base64']))
            h = stt(mp3); sim, why = judge(ep, line, h)
            return resp, sim, why, h
        with ThreadPoolExecutor(2) as ex: res = list(ex.map(gen, range(4)))
        ok = [x for x in res if not x[2]] or sorted(res, key=lambda x: -x[1])
        pick = max(ok, key=lambda x: x[1])
        voice.tts = lambda t, tmp, p=pick[0]: p
        with tempfile.TemporaryDirectory() as tmp:
            voice.patch_lines(ep, [r['id']], sc, vd, tmp)
        voice.tts = orig
        print(f"  {r['id']} 作り直し → {pick[3]}  {'OK' if not pick[2] else pick[2]}", flush=True)


if __name__ == '__main__':
    ep = sys.argv[1]
    res = scan(ep)
    bad = [r for r in res if r['why']]
    print(f'{ep}: {len(res)}行のうち、引っかかった行 {len(bad)}行')
    for r in bad: print(f"  {r['id']} {r['why']} | {r['line'][:30]} | {r['heard'][:40]}")
    if '--fix' in sys.argv and bad:
        fixable = [r for r in bad if not any('台本を書き直す' in w for w in r['why'])]
        fix(ep, fixable)
        res2 = scan(ep, only={r['id'] for r in fixable})
        print('作り直したあと:')
        for r in res2: print(f"  {r['id']} {r['why'] or 'OK'} | {r['heard'][:40]}")
