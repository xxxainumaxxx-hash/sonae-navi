# 備えナビ v2

備えニキの防災まとめサイト。`sonae-navi.vercel.app`

旧版は457行のHTML1ファイルSPA（ハッシュルーティング）だったため、
コンテンツがJavaScript生成で検索エンジンに拾われなかった。
v2ではビルド時に**個別HTMLを生成**する方式に変更し、各ページが実URLとtitle/meta/OGPを持つ。

## 使い方

```bash
node build.mjs          # public/ に全ページ生成
node serve.mjs          # http://localhost:4321 で確認
```

## 構成

```
src/config.mjs          サイト設定・アフィリタグ・SNS・動画DB（34本）
src/theme.mjs           CSS（デザイントークン）と線画アイコン
src/layout.mjs          HTMLシェル（title/meta/OGP/JSON-LD/ヘッダー/フッター）
src/blocks.mjs          本文パーツ（見出し・数字・注意箱・手順・チェック・商品・動画）
src/render.mjs          ページ組み立て（カテゴリ／トップ／診断）
src/content/            ページの中身（ここだけ触れば内容を更新できる）
  ├ bichiku.mjs         備蓄する      ★注力
  ├ kaji.mjs            火事に備える  ★注力
  ├ suigai.mjs          水害に備える  ★注力
  ├ others.mjs          地震・停電・防犯・値上げ・お金
  └ index.mjs           カテゴリの一覧と表示順
build.mjs               ビルド（HTML + sitemap.xml + robots.txt + favicon.svg）
```

## よくある更新

**新しい動画を追加する**
`src/config.mjs` の `V` に1行足して、該当カテゴリの `videos:` 配列に `V.キー名` を入れる。

**商品を追加・差し替える**
`src/content/*.mjs` の `items:` に
`{ name, qty, why, kw }` を足す。`kw` はAmazonの検索キーワード。
URLは `kw` から自動生成され、アフィリタグが必ず付く。

**アフィリタグを変える**
`src/config.mjs` の `AFF_TAG` の1箇所だけ。全ページと診断結果に反映される。

**カテゴリを増やす**
`src/content/` にファイルを作り、`src/content/index.mjs` の `CATS` に追加。
ページ・sitemap・フッターリンクは自動で増える。

## 出力

| URL | 内容 |
|---|---|
| `/` | トップ |
| `/shindan/` | 6問の生存準備度診断（人数×日数で必要量を計算） |
| `/bichiku/` `/kaji/` `/suigai/` | 注力3テーマ |
| `/jishin/` `/teiden/` `/bouhan/` `/neage/` `/okane/` | 旧版から移植 |
| `/sitemap.xml` `/robots.txt` `/favicon.svg` | 自動生成 |

## デプロイ

`vercel.json` で `buildCommand: node build.mjs` / `outputDirectory: public` を指定済み。
GitHubに繋いでいれば push で自動デプロイされる。`public/` は `.gitignore` 済み（ビルド生成物のため）。

## 数値の根拠

本文中の目安値は公的機関の一般的な指標に基づく。
水3L/人日・トイレ5回/人日・備蓄7日・警戒レベル4で全員避難・浸水30cmで歩行困難
・火災警報器は本体10年で交換・初期消火は炎が天井に達するまで、など。
更新時は出典を確認すること。
