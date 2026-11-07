#!/usr/bin/env python3
"""音声チェックの準備：python3 voicecheck.py <話ID>

1. voice/<話ID>/NN.mp3 を、NN.json の時刻で1行ずつの音声に切る
2. 1行ずつ ElevenLabs で文字起こしして、台本と比べる（食い違いが大きい行に印を付ける＝AIの事前チェック）
3. 1行ずつ再生できるチェック用ページ（out/<話ID>/voicecheck.html）を作る
"""
import base64, difflib, html, json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.abspath(__file__))
FLAG_BELOW = 0.85  # 台本との一致率がこれより低い行に印


KD = {'〇': 0, '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9}
KU = {'十': 10, '百': 100, '千': 1000}
KB = {'万': 10 ** 4, '億': 10 ** 8}


def to_num(run):
    # 「一万四千八百」「1億5000万」「二十二」「一九八〇」「14,800」をすべて数字にそろえる
    total = section = cur = 0
    for ch in run:
        if ch == ',':
            continue
        if ch.isdigit() or ch in KD:
            cur = cur * 10 + (int(ch) if ch.isdigit() else KD[ch])
        elif ch in KU:
            section += (cur or 1) * KU[ch]; cur = 0
        elif ch in KB:
            total += (section + cur or 1) * KB[ch]; section = cur = 0
    return str(total + section + cur)


def norm(s):
    s = re.sub(r'[0-9〇零一二三四五六七八九][0-9〇零一二三四五六七八九十百千万億,]*', lambda m: to_num(m.group(0)), s)
    return re.sub(r'[\s、。，．,.！？!?「」『』（）()・…ー〜~\-]', '', s)


def stt(path):
    out = subprocess.check_output(['curl', '-sS', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text',
                                   '-F', 'model_id=scribe_v1', '-F', 'language_code=jpn', '-F', f'file=@{path}'])
    try:
        return json.loads(out).get('text', '').strip()
    except Exception:
        return ''


def main():
    ep = sys.argv[1]
    vd = os.path.join(ROOT, 'voice', ep)
    od = os.path.join(ROOT, 'out', ep)
    os.makedirs(od, exist_ok=True)
    rows = []
    # 前回のチェック（check.json）と、前回「直す」が付いた行（review.json：Claude がチェックページから書き出す）
    prev_p = os.path.join(vd, 'check.json')
    prev = {r['id']: r for r in json.load(open(prev_p))} if os.path.exists(prev_p) else {}
    rv_p = os.path.join(vd, 'review.json')
    review = json.load(open(rv_p)) if os.path.exists(rv_p) else {}
    fixed = {k for k, v in review.get('statuses', {}).items() if v == 'fix'}
    round_no = review.get('round', 1) + 1 if prev else 1
    rp = os.path.join(ROOT, 'voice', 'readings.json')
    words = [k for k in (json.load(open(rp)) if os.path.exists(rp) else {}) if not k.startswith('_')]
    scenes = sorted(f[:-5] for f in os.listdir(vd) if re.fullmatch(r'\d\d\.json', f))
    with tempfile.TemporaryDirectory() as tmp:
        for n in scenes:
            d = json.load(open(os.path.join(vd, f'{n}.json')))
            mp3 = os.path.join(vd, f'{n}.mp3')
            lines = d['lines']
            for i, l in enumerate(lines):
                # 読み終わった直後で切る（行と行の間の無音を残さない）
                a = max(0.0, l['start'] - 0.03)
                b = min(l['end'] + 0.08, lines[i + 1]['start'] if i + 1 < len(lines) else d['duration'])
                clip = os.path.join(tmp, f'{n}-{i + 1}.mp3')
                subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', mp3,
                                       '-ac', '1', '-b:a', '48k', clip])
                heard = stt(clip)
                score = difflib.SequenceMatcher(None, norm(l['line']), norm(heard)).ratio() if heard else 0.0
                # 読み方の辞書にある言葉（人名など）が、文字に戻したときに出てこなければ要チェック
                missing = [w for w in words if w in l['line'] and w not in heard]
                rid = f'{n}-{i + 1}'
                # 修正した行：前回から読ませ方が変わった行、または前回「直す」が付いた行
                recheck = bool(prev) and (rid in fixed or prev.get(rid, {}).get('spoken') != l.get('spoken', l['line']))
                rows.append({
                    'recheck': recheck,
                    'id': f'{n}-{i + 1}', 'scene': n, 'text': l['line'], 'spoken': l.get('spoken', l['line']),
                    'heard': heard, 'score': round(score, 2), 'flag': score < FLAG_BELOW or bool(missing), 'missing': missing,
                    'audio': 'data:audio/mpeg;base64,' + base64.b64encode(open(clip, 'rb').read()).decode(),
                })
                print(f"{rows[-1]['id']}  {score:.2f}  {'⚠' if rows[-1]['flag'] else ' '}  {l['line'][:24]} / {heard[:24]}")
    meta = {k: v for k, v in [('ep', ep)]}
    json.dump([{k: v for k, v in r.items() if k != 'audio'} for r in rows], open(os.path.join(vd, 'check.json'), 'w'), ensure_ascii=False, indent=1)
    tpl = open(os.path.join(ROOT, 'voicecheck.template.html'), encoding='utf-8').read()
    page = tpl.replace('__ROUND__', str(round_no)).replace('__EP__', html.escape(ep)).replace('__DATA__', json.dumps(rows, ensure_ascii=False).replace('</', '<\\/'))
    open(os.path.join(od, 'voicecheck.html'), 'w', encoding='utf-8').write(page)
    json.dump({'round': round_no, 'statuses': {}}, open(rv_p, 'w'), ensure_ascii=False, indent=1)
    flagged = sum(r['flag'] for r in rows)
    print(f'第{round_no}回のチェック。修正した行：{sum(r["recheck"] for r in rows)}行')
    print(f'\n{len(rows)}行のうち、AIが気になった行：{flagged}行 → {os.path.join(od, "voicecheck.html")}')


if __name__ == '__main__':
    main()
