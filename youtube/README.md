# クレヨン解説チャンネル（試作）

「5さいでもわかる」お金・くらしの話を、クレヨン風の絵で解説する動画を作る仕組み。
**絵は全部コードで描いている（画像生成AIは使っていない）。**

## 流れ

1. 台本と絵：`episodes/<話ID>.mjs`（場面ごとに `narration` と `draw()`）
2. 声：`voice/<話ID>/script.txt` を ElevenLabs で読ませ、`01.mp3`, `02.mp3`… として同じフォルダに保存
3. 動画化：

```bash
cd youtube
npm install
node render.mjs 01-neage --stills   # 絵だけ確認（out/01-neage/frames/）
node render.mjs 01-neage            # 動画（out/01-neage/01-neage.mp4）
```

声ファイルが無い場面は、文字数から長さを推定して無音で作る（仮動画）。
声を置いてから再実行すると、声の長さに合わせて字幕と場面が伸び縮みする。

## 中身

```
lib/crayon.mjs   クレヨンの線・塗り・紙の質感・手書き文字（揺れるフィルター）
lib/props.mjs    キャラ「ソナエ」（黄色い防災ヘルメット）と小物（おにぎり、コイン、トラック…）
episodes/        1話＝1ファイル
render.mjs       PNG化（Playwright）→ 線の揺れ＋ゆっくりズーム＋字幕＋声（ffmpeg）
```

- 線の揺れ：同じ絵をノイズだけ変えて3枚描き、1秒に4回切り替える（手描きアニメ風）
- フォント：Yomogi（手書き）、Zen Maru Gothic（見出し・字幕）。どちらも SIL OFL
