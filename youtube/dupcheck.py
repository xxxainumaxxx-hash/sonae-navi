"""行の頭の「音のダブり」を見つけて直す：python3 dupcheck.py <話ID>... [--fix]
差し替えた行の直前に、古い音声の出だしが少し残ってしまうことがある。
各行の始まる直前（前の行の終わりより後）に声の大きさがあるかを調べ、あればその部分を無音にする。"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.abspath(__file__))
SR = 16000

def pcm(path):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'])
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768

def scan(ep, fix=False):
    vd = os.path.join(ROOT, 'voice', ep)
    found = []
    for f in sorted(os.listdir(vd)):
        if not (f.endswith('.json') and f[:-5].isdigit()): continue
        n = f[:-5]; d = json.load(open(os.path.join(vd, f))); L = d['lines']
        mp3 = os.path.join(vd, n + '.mp3')
        if not os.path.exists(mp3): continue
        x = pcm(mp3)
        fr = int(SR * 0.01)
        env = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)])
        speech = np.percentile(env[env > 0.01], 50) if (env > 0.01).any() else 0.05
        thr = max(0.02, speech * 0.25)
        cuts = []
        for k in range(1, len(L)):
            a = L[k - 1]['end'] + 0.04
            b = L[k]['start'] - 0.06
            if b - a < 0.05: continue
            seg = env[int(a * 100):int(b * 100)]
            loud = np.where(seg > thr)[0]
            if len(loud) >= 5:  # 50ms 以上の声
                s0 = a + loud[0] / 100; s1 = a + (loud[-1] + 1) / 100
                found.append((ep, f'{n}-{k + 1}', round(s0, 2), round(s1, 2), L[k]['line'][:20]))
                cuts.append((max(a - 0.02, s0 - 0.03), min(L[k]['start'] - 0.02, s1 + 0.05)))
        if fix and cuts:
            expr = '+'.join(f'between(t,{c0:.3f},{c1:.3f})' for c0, c1 in cuts)
            tmp = mp3 + '.tmp.mp3'
            subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', mp3, '-af', f"volume=enable='{expr}':volume=0", '-b:a', '160k', tmp])
            os.replace(tmp, mp3)
    return found

if __name__ == '__main__':
    fix = '--fix' in sys.argv
    for ep in [a for a in sys.argv[1:] if not a.startswith('--')]:
        for r in scan(ep, fix): print(*r)

# ---- 文字起こしで調べる（行の頭の1〜2秒に、行の出だしの言葉が2回出てきたらダブり）
import re, tempfile
def _norm(s):
    return re.sub(r'[、。！？「」『』（）・…\s,.!?]', '', s)
def stt_scan(ep, only=None):
    vd = os.path.join(ROOT, 'voice', ep); out = []
    with tempfile.TemporaryDirectory() as tmp:
        for f in sorted(os.listdir(vd)):
            if not (f.endswith('.json') and f[:-5].isdigit()): continue
            n = f[:-5]; d = json.load(open(os.path.join(vd, f))); L = d['lines']
            for k, l in enumerate(L):
                rid = f'{n}-{k + 1}'
                if only and rid not in only: continue
                a = max(0, l['start'] - 0.7); b = min(d['duration'], l['start'] + 1.8)
                clip = os.path.join(tmp, 'c.mp3')
                subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', os.path.join(vd, n + '.mp3'), clip])
                r = subprocess.run(['curl', '-sS', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-F', 'model_id=scribe_v1', '-F', 'language_code=jpn', '-F', f'file=@{clip}'], capture_output=True, text=True)
                try: heard = _norm(json.loads(r.stdout).get('text', ''))
                except Exception: heard = ''
                head = _norm(l['line'])[:2]
                if head and heard.count(head) >= 2:
                    out.append((ep, rid, l['line'][:24], heard[:30])); print(*out[-1], flush=True)
    return out

# ---- 行の頭より前に、声が「早く始まりすぎている」行を探す（差し替えで残った古い出だし）
def lead_scan(ep):
    vd = os.path.join(ROOT, 'voice', ep); out = []
    for f in sorted(os.listdir(vd)):
        if not (f.endswith('.json') and f[:-5].isdigit()): continue
        n = f[:-5]; d = json.load(open(os.path.join(vd, f))); L = d['lines']
        x = pcm(os.path.join(vd, n + '.mp3')); fr = int(SR * 0.01)
        env = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)])
        thr = 0.02
        for k, l in enumerate(L):
            i = int(l['start'] * 100)
            # start から後ろへ：声が続いている間さかのぼる（60ms 以上の無音で止まる）
            j = i; quiet = 0
            while j > 0:
                if env[j] < thr: quiet += 1
                else: quiet = 0
                if quiet >= 6: break
                j -= 1
            onset = (j + quiet) / 100
            out.append((ep, f'{n}-{k + 1}', round(l['start'] - onset, 2), l['line'][:20]))
    return out

# ---- 本命：行の頭の直前に「短い声のかたまり → ほぼ無音 → 本当の出だし」があればダブり
def burst_scan(ep, fix=False):
    vd = os.path.join(ROOT, 'voice', ep); out = []
    for f in sorted(os.listdir(vd)):
        if not (f.endswith('.json') and f[:-5].isdigit()): continue
        n = f[:-5]; d = json.load(open(os.path.join(vd, f))); L = d['lines']
        mp3 = os.path.join(vd, n + '.mp3'); x = pcm(mp3); fr = 160
        env = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)])
        cuts = []
        for k, l in enumerate(L):
            i0 = max(0, int((l['start'] - 0.4) * 100)); i1 = min(len(env) - 1, int((l['start'] + 0.25) * 100))
            w = env[i0:i1]
            # 本当の出だし：w の中で、0.15を超えてから50ms以上続く最後の立ち上がり
            hit = None
            j = 0
            while j < len(w):
                if w[j] >= 0.15:
                    b0 = j
                    while j < len(w) and w[j] >= 0.03: j += 1
                    b1 = j  # かたまりの終わり
                    q = b1
                    while q < len(w) and w[q] < 0.10: q += 1
                    if b1 - b0 >= 3 and q - b1 >= 3 and q < len(w) and w[q:q + 5].max() >= 0.15 and b1 - b0 <= 40:
                        # 前にも無音がある（かたまりが孤立している）
                        pre = w[max(0, b0 - 6):b0]
                        if len(pre) == 0 or pre.max() < 0.05:
                            hit = (i0 + b0, i0 + q); break
                else:
                    j += 1
            if hit:
                s0, s1 = hit[0] / 100, hit[1] / 100
                out.append((ep, f'{n}-{k + 1}', round(s0, 2), round(s1, 2), l['line'][:22]))
                cuts.append((s0 - 0.02, s1 - 0.01))
        if fix and cuts:
            expr = '+'.join(f'between(t,{c0:.3f},{c1:.3f})' for c0, c1 in cuts)
            tmp = mp3 + '.tmp.mp3'
            subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', mp3, '-af', f"volume=enable='{expr}':volume=0", '-b:a', '160k', tmp])
            os.replace(tmp, mp3)
    return out

# ---- 差し替えた行（最初に作ったときと読ませ方が変わった行）だけを調べて直す
def patched_lines(ep):
    vd = os.path.join('youtube', 'voice', ep); res = set()
    for f in sorted(os.listdir(os.path.join(ROOT, 'voice', ep))):
        if not (f.endswith('.json') and f[:-5].isdigit()): continue
        p = os.path.join(vd, f)
        revs = subprocess.run(['git', '-C', os.path.dirname(ROOT), 'log', '--format=%H', '--', p], capture_output=True, text=True).stdout.split()
        cur = json.load(open(os.path.join(ROOT, 'voice', ep, f)))['lines']
        seen = [l.get('spoken') for l in cur]
        for r in revs:
            try: old = json.loads(subprocess.run(['git', '-C', os.path.dirname(ROOT), 'show', f'{r}:{p}'], capture_output=True, text=True).stdout)['lines']
            except Exception: continue
            for k, l in enumerate(old):
                if k < len(cur) and l.get('spoken') != cur[k].get('spoken'): res.add(f'{f[:-5]}-{k + 1}')
    return res

def fix_patched(ep, fix=False):
    pl = patched_lines(ep); vd = os.path.join(ROOT, 'voice', ep); out = []
    for f in sorted(os.listdir(vd)):
        if not (f.endswith('.json') and f[:-5].isdigit()): continue
        n = f[:-5]; d = json.load(open(os.path.join(vd, f))); L = d['lines']
        mp3 = os.path.join(vd, n + '.mp3'); x = pcm(mp3); fr = 160
        env = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)])
        cuts = []
        for k, l in enumerate(L):
            if f'{n}-{k + 1}' not in pl: continue
            s = int(l['start'] * 100)
            # 本当の出だし：start 付近で、40ms 以上続けて 0.05 を超える最初の位置（start-0.15〜start+0.25）
            on = None
            for i in range(max(0, s - 15), min(len(env) - 4, s + 25)):
                if (env[i:i + 4] > 0.05).all(): on = i; break
            if on is None: continue
            # その直前の静かな区間（< 0.03）をさかのぼる
            q = on - 1
            while q > 0 and env[q] < 0.03: q -= 1
            gap = on - 1 - q
            if gap < 2: continue
            # さらに前の声のかたまり（≥0.08 が 30ms 以上、全体で 0.5秒以内）
            b1 = q; b0 = q
            while b0 > 0 and env[b0] >= 0.02 and b1 - b0 < 60: b0 -= 1
            if b1 - b0 < 3 or env[b0 + 1:b1 + 1].max() < 0.08 or b1 - b0 >= 50: continue
            # かたまりの前は無音であること（前の行の声とつながっていない）
            if env[max(0, b0 - 8):b0 + 1].max() > 0.03: continue
            out.append((ep, f'{n}-{k + 1}', round(b0 / 100, 2), round(on / 100, 2), l['line'][:22]))
            cuts.append((b0 / 100, (on - 1) / 100))
        if fix and cuts:
            expr = '+'.join(f'between(t,{c0:.3f},{c1:.3f})' for c0, c1 in cuts)
            tmp = mp3 + '.tmp.mp3'
            subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', mp3, '-af', f"volume=enable='{expr}':volume=0", '-b:a', '160k', tmp])
            os.replace(tmp, mp3)
    return pl, out

def fix_patched2(ep, fix=False, lines=None):
    pl = lines or patched_lines(ep); vd = os.path.join(ROOT, 'voice', ep); out = []
    for f in sorted(os.listdir(vd)):
        if not (f.endswith('.json') and f[:-5].isdigit()): continue
        n = f[:-5]; d = json.load(open(os.path.join(vd, f))); L = d['lines']
        mp3 = os.path.join(vd, n + '.mp3'); x = pcm(mp3); fr = 160
        env = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)])
        cuts = []
        for k, l in enumerate(L):
            if f'{n}-{k + 1}' not in pl: continue
            s = int(l['start'] * 100)
            # start の直前〜直後にある「くぼみ」（< 0.10 が 30ms 以上）で、いちばん start に近いもの
            best = None; i = max(0, s - 40)
            while i <= min(len(env) - 1, s + 8):
                if env[i] < 0.10:
                    j = i
                    while j < len(env) and env[j] < 0.10: j += 1
                    if j - i >= 3 and j <= s + 10: best = (i, j)
                    i = j
                else: i += 1
            if not best: continue
            d0, d1 = best
            # くぼみの前の声のかたまり：さらに前の無音（< 0.03 が 60ms）まで
            b = d0 - 1; quiet = 0
            while b > 0 and quiet < 6:
                quiet = quiet + 1 if env[b] < 0.03 else 0
                b -= 1
            b0 = b + quiet + 1
            seg = env[b0:d0]
            if len(seg) < 3 or len(seg) > 40 or seg.max() < 0.08: continue
            if env[d1:d1 + 30].max() < 0.15: continue
            out.append((ep, f'{n}-{k + 1}', round(b0 / 100, 2), round(d1 / 100, 2), l['line'][:22]))
            cuts.append((b0 / 100 - 0.01, d0 / 100 + 0.01))
        if fix and cuts:
            expr = '+'.join(f'between(t,{c0:.3f},{c1:.3f})' for c0, c1 in cuts)
            tmp = mp3 + '.tmp.mp3'
            subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', mp3, '-af', f"volume=enable='{expr}':volume=0", '-b:a', '160k', tmp])
            os.replace(tmp, mp3)
    return pl, out

# ---- 差し替えのつなぎ目に残った「古い出だしの切れ端」を探して消す
# 切れ端の形：前の行が終わったあと、短い声のかたまりがあり、それが1コマ（10ms）でいきなり無音に落ちる（＝ハサミで切った跡）。
# その後ろに本当の出だしが来る。かたまりの始まりから、切った跡までを無音にする。
def cut_scan(ep, fix=False, only=None):
    vd = os.path.join(ROOT, 'voice', ep); out = []
    for f in sorted(os.listdir(vd)):
        if not (f.endswith('.json') and f[:-5].isdigit()): continue
        n = f[:-5]; d = json.load(open(os.path.join(vd, f))); L = d['lines']
        mp3 = os.path.join(vd, n + '.mp3'); x = pcm(mp3); fr = 160
        env = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, fr)])
        cuts = []
        for k in range(1, len(L)):
            rid = f'{n}-{k + 1}'
            if only and rid not in only: continue
            s0 = L[k]['start']; lo = max(1, int((s0 - 0.35) * 100)); hi = min(len(env) - 30, int((s0 + 0.12) * 100))
            for c in range(lo, hi):
                # ハサミの跡：1コマで急に（1割以下に）静かになり、0.25秒以内にまた声が始まる
                if env[c - 1] > 0.012 and env[c] < 0.008 and env[c] < env[c - 1] * 0.15 and env[c + 1:c + 25].max() > 0.02:
                    b = c - 1
                    while b > lo - 30 and env[max(0, b - 4):b].max() > 0.004: b -= 1
                    if (c - b) <= 30:
                        cuts.append((b / 100, c / 100)); out.append((ep, rid, round(b / 100, 2), round(c / 100, 2), L[k]['line'][:20]))
                    break
        if fix and cuts:
            expr = '+'.join(f'between(t,{a:.3f},{b + 0.005:.3f})' for a, b in cuts)
            tmp = mp3 + '.tmp.mp3'
            subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', mp3, '-af', f"volume=enable='{expr}':volume=0", '-b:a', '160k', tmp])
            os.replace(tmp, mp3)
    return out

# ---- つなぎ目の傷を探す：完全な無音（差し込んだ無音）と大きな声が、10ms で切り替わるところ＝声の途中で切った跡
# 声の頭が削れている（無音→いきなり大きい）、語尾が切れている（大きい→いきなり無音）、古い出だしが残っている（短い声→いきなり無音）
def seam_scan(ep, only=None):
    import voice
    vd = os.path.join(ROOT, 'voice', ep); out = []
    for f in sorted(os.listdir(vd)):
        if not (f.endswith('.json') and f[:-5].isdigit()): continue
        n = f[:-5]; d = json.load(open(os.path.join(vd, f))); L = d['lines']
        env = voice._env(os.path.join(vd, n + '.mp3'))
        for i in range(1, len(env)):
            kind = None
            if env[i - 1] < 0.0015 and env[i] > 0.03: kind = '頭が削れている'
            elif env[i - 1] > 0.03 and env[i] < 0.0015: kind = '途中で切れている'
            if not kind: continue
            t = i / 100
            k = min(range(len(L)), key=lambda j: min(abs(L[j]['start'] - t), abs(L[j]['end'] - t)))
            rid = f'{n}-{k + 1}'
            if only and rid not in only: continue
            out.append((rid, round(t, 2), kind, L[k]['line'][:18]))
    return out
