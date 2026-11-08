"""声・BGM・効果音を混ぜて、動画の音を作る。

使い方：python3 mix.py 07-nintendo
  入力：out/<ep>/_audio.m4a（声）、out/<ep>/timeline.json（node animate.mjs <ep> --timeline で作る）、
        audio/<ep>.json（BGMの区間と効果音の設定）、audio/*.mp3
  出力：out/<ep>/_mix.m4a、out/<ep>/<ep>-final.mp4（動画があれば音を差しかえる）

・BGM は区間ごとに曲を変え、つなぎ目は1秒重ねてフェード。声が出ている間は自動で下げる（ダッキング）。
・効果音はカットの切りかえ方に合わせて鳴らす（横に流れる＝シュッ、飛びこむ＝ポン、寄る＝紙の音）。
・最後に全体の音量を YouTube 向け（-14 LUFS）にそろえる。
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


def sh(args):
    subprocess.check_call(args)


def main():
    ep = sys.argv[1]
    out = os.path.join(ROOT, 'out', ep)
    cfg = json.load(open(os.path.join(ROOT, 'audio', f'{ep}.json')))
    tl = json.load(open(os.path.join(out, 'timeline.json')))
    total = tl['total']
    A = lambda f: os.path.join(ROOT, 'audio', f)

    inputs, parts, labels = [], [], []

    # ---- BGM（区間ごと）
    sections = cfg['bgm']
    for sec in sections:  # 区間は場面の番号（1から）でも書ける：声の長さが変わっても自動でずれる
        if 'scene' in sec: sec['start'] = tl['scenes'][sec['scene'] - 1]['start']
    for i, s in enumerate(sections):
        a = s['start']
        b = sections[i + 1]['start'] if i + 1 < len(sections) else total
        length = b - a + (1.0 if i + 1 < len(sections) else 0)  # 次の曲と1秒重ねる
        k = len(inputs) // 2
        inputs += ['-i', A(s['file'])]
        vol = s.get('vol', 1.0)
        parts.append(
            f'[{k}:a]aresample=44100,aformat=channel_layouts=stereo,loudnorm=I=-16:TP=-2:LRA=11,'
            f'atrim={s.get("offset", 0)}:{s.get("offset", 0) + length:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.8,afade=t=out:st={max(0, length - 1.5):.3f}:d=1.5,'
            f'volume={vol},adelay={int(a * 1000)}:all=1[b{i}]')
        labels.append(f'[b{i}]')
    parts.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=longest,apad,atrim=0:{total:.3f}[bgm]')

    # ---- 声（ダッキングのきっかけにも使う）
    kv = len(inputs) // 2
    inputs += ['-i', os.path.join(out, '_audio.m4a')]
    parts.append(f'[{kv}:a]aresample=44100,aformat=channel_layouts=stereo,asplit=2[voice][key]')
    parts.append(f"[bgm][key]sidechaincompress=threshold=0.03:ratio=6:attack=40:release=450:makeup=1,volume={cfg.get('bgm_vol', 0.22)}[bgmd]")

    # ---- 効果音
    sfx = cfg['sfx']
    events = []
    for c in tl['cuts']:
        e = sfx.get(c['kind'])
        if e:
            events.append((c['t'], e))
    for s in tl['scenes']:
        if s['chapter'] and 'chapter' in sfx:
            events.append((s['start'] + 0.05, sfx['chapter']))
    if 'cat' in sfx:  # ショートのネコが「本編はこちら」と指さす時
        e = sfx['cat']
        events.append((tl['scenes'][0]['lines'][e['line']] + e.get('offset', 0.3), e))
    if 'end' in sfx:
        e = sfx['end']
        events.append((tl['scenes'][e['scene'] - 1]['start'] + 0.1 if 'scene' in e else total - e.get('before_end', 3.5), e))
    # 効果音は numpy で1本の音にまとめる（ffmpeg で何百本も重ねると遅いので）
    import numpy as np
    SR = 44100
    def pcm(f):
        raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', A(f), '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'])
        return np.frombuffer(raw, dtype=np.int16).reshape(-1, 2).astype(np.float32) / 32768
    cache, track = {}, np.zeros((int((total + 2) * SR), 2), dtype=np.float32)
    for t, e in events:
        w = cache.setdefault(e['file'], pcm(e['file'])) * e.get('vol', 0.3)
        i = max(0, int(t * SR)); j = min(len(track), i + len(w))
        track[i:j] += w[:j - i]
    fxwav = os.path.join(out, '_fx.wav')
    import wave
    with wave.open(fxwav, 'wb') as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
        wf.writeframes((np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes())
    kf = len(inputs) // 2
    inputs += ['-i', fxwav]
    parts.append(f'[{kf}:a]anull[fx]')
    fx_labels = events

    # ---- 全部まぜて、音量をそろえる
    parts.append('[voice][bgmd][fx]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[out]')
    mix = os.path.join(out, '_mix.m4a')
    fc = os.path.join(out, '_mix_filter.txt')
    open(fc, 'w').write(';\n'.join(parts))
    sh(['ffmpeg', '-y', '-v', 'error', *inputs, '-filter_complex_script', fc, '-map', '[out]', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', mix])
    print(f'音: {mix}（効果音 {len(fx_labels)} 個）')

    video = os.path.join(out, f'{ep}.mp4')
    if os.path.exists(video):
        final = os.path.join(out, f'{ep}-final.mp4')
        sh(['ffmpeg', '-y', '-v', 'error', '-i', video, '-i', mix, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy', '-shortest', final])
        print(f'動画: {final}')


if __name__ == '__main__':
    main()
