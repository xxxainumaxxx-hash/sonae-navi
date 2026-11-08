"""YouTube の画面（ボタン・チャンネル名・説明文・再生バー）を動画のコマに重ねて、隠れる所がないか確認する。

使い方：python3 uicheck.py <ep> [秒の間隔=2]
  ショート（縦）：右の縦並びボタン、左下のチャンネル名と説明文、下のメニュー、上の検索ボタンを重ねる
  横の動画：スマホを横にして全画面で見たときの、上のタイトルと下の再生バー・ボタンを重ねる
  出力：out/<ep>/uicheck.png（一覧）。隠れる場所は赤い半透明、そこに重要なものが入っていたら要注意
"""
import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
FONT = '/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf'


def font(n):
    return ImageFont.truetype(FONT, n)


def short_overlay(w=1080, h=1920):
    o = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(o)
    # 下側の暗いグラデーション（YouTube は文字を読ませるため下を暗くする）
    for y in range(1350, h):
        a = int(150 * (y - 1350) / (h - 1350))
        d.line([(0, y), (w, y)], fill=(0, 0, 0, a))
    # 隠れる範囲（赤）
    d.rectangle([900, 980, w, 1880], fill=(255, 0, 0, 55))      # 右のボタン列
    d.rectangle([0, 1520, 900, h], fill=(255, 0, 0, 55))        # 左下のチャンネル名・説明文・メニュー
    d.rectangle([0, 0, w, 130], fill=(255, 0, 0, 40))           # 上の検索・メニュー
    # 右のボタン
    for i, lab in enumerate(['いいね', '低評価', 'コメント', '共有', 'リミックス']):
        y = 1050 + i * 150
        d.ellipse([950, y - 45, 1040, y + 45], fill=(255, 255, 255, 230))
        d.text((995, y + 55), lab, font=font(24), fill='white', anchor='mt')
    d.rounded_rectangle([950, 1790, 1040, 1870], 14, fill=(80, 80, 80, 255))
    # 左下：チャンネル名と説明文
    d.ellipse([40, 1545, 110, 1615], fill=(240, 240, 240, 255))
    d.text((130, 1580), '@チャンネル名', font=font(36), fill='white', anchor='lm')
    d.rounded_rectangle([420, 1550, 600, 1610], 30, fill='white')
    d.text((510, 1580), '登録', font=font(32), fill='black', anchor='mm')
    d.text((40, 1650), '動画のタイトルがここに入る #shorts', font=font(36), fill='white')
    d.text((40, 1710), '♪ オリジナル音源', font=font(30), fill='white')
    # 下のメニュー
    d.rectangle([0, h - 110, w, h], fill=(15, 15, 15, 255))
    for i, lab in enumerate(['ホーム', 'ショート', '＋', '登録', 'マイページ']):
        d.text((w * (i + 0.5) / 5, h - 55), lab, font=font(28), fill='white', anchor='mm')
    # 上の検索ボタンなど
    d.text((w - 200, 70), '検索', font=font(36), fill='white', anchor='mm')
    d.text((w - 70, 70), '⋮', font=font(48), fill='white', anchor='mm')
    return o


def long_overlay(w=1920, h=1080):
    o = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(o)
    for y in range(0, 150):
        d.line([(0, y), (w, y)], fill=(0, 0, 0, int(140 * (1 - y / 150))))
    for y in range(h - 200, h):
        d.line([(0, y), (w, y)], fill=(0, 0, 0, int(160 * (y - (h - 200)) / 200)))
    d.rectangle([0, 0, w, 110], fill=(255, 0, 0, 40))
    d.rectangle([0, h - 150, w, h], fill=(255, 0, 0, 45))
    d.text((60, 55), '任天堂は、なぜ生き残れたのか（タイトル）', font=font(40), fill='white', anchor='lm')
    d.ellipse([w // 2 - 70, h // 2 - 70, w // 2 + 70, h // 2 + 70], fill=(0, 0, 0, 120))
    d.polygon([(w // 2 - 22, h // 2 - 38), (w // 2 - 22, h // 2 + 38), (w // 2 + 40, h // 2)], fill='white')
    d.rectangle([60, h - 120, w - 60, h - 112], fill=(200, 200, 200, 200))
    d.rectangle([60, h - 120, 760, h - 112], fill=(255, 0, 0, 255))
    d.ellipse([748, h - 128, 772, h - 104], fill=(255, 0, 0, 255))
    d.text((60, h - 70), '4:12 / 11:54', font=font(34), fill='white', anchor='lm')
    d.text((w - 60, h - 70), '字幕  設定  全画面', font=font(34), fill='white', anchor='rm')
    return o


def main():
    ep = sys.argv[1]
    step = float(sys.argv[2]) if len(sys.argv) > 2 else 2
    out = os.path.join(ROOT, 'out', ep)
    video = os.path.join(out, f'{ep}-final.mp4')
    if not os.path.exists(video):
        video = os.path.join(out, f'{ep}.mp4')
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.check_call(['ffmpeg', '-v', 'error', '-i', video, '-vf', f'fps=1/{step}', os.path.join(tmp, 'f%04d.png')])
        frames = sorted(os.listdir(tmp))
        first = Image.open(os.path.join(tmp, frames[0]))
        w, h = first.size
        short = h > w
        ov = short_overlay(w, h) if short else long_overlay(w, h)
        tw = 270 if short else 480
        th = int(h * tw / w)
        cols = 8 if short else 5
        rows = (len(frames) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * tw, rows * th), 'black')
        for i, f in enumerate(frames):
            im = Image.open(os.path.join(tmp, f)).convert('RGBA')
            im.alpha_composite(ov)
            dd = ImageDraw.Draw(im)
            t = int(i * step)
            dd.text((10, 10 if short else h - 40), f'{t // 60}:{t % 60:02d}', font=font(40), fill='yellow', stroke_width=4, stroke_fill='black')
            sheet.paste(im.convert('RGB').resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
        path = os.path.join(out, 'uicheck.png')
        sheet.save(path)
        print(path, len(frames))


if __name__ == '__main__':
    main()
