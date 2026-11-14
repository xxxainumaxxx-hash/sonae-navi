import sys, os, subprocess
from playwright.sync_api import sync_playwright

here = os.path.dirname(os.path.abspath(__file__))
fps = 30
stills = sys.argv[1:]  # 秒を渡すと静止画だけ出す
os.makedirs(f"{here}/frames", exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto(f"file://{here}/scene.html")
    if stills:
        for s in stills:
            pg.evaluate(f"render({s})")
            pg.screenshot(path=f"{here}/still_{s}.png")
    else:
        total = pg.evaluate("TOTAL")
        n = int(total * fps)
        for i in range(n):
            pg.evaluate(f"render({i / fps})")
            pg.screenshot(path=f"{here}/frames/{i:04d}.png")
    b.close()
if not stills:
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-framerate", str(fps), "-i", f"{here}/frames/%04d.png",
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", f"{here}/yamaha_3d_sample.mp4"], check=True)
