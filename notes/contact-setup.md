# お問い合わせフォームのメール配送設定

フォームはホームの #contact、送信先は /api/contact（Vercel Function）。
受信先アドレスは公開HTMLに埋め込まず、環境変数で管理します。
ローカルの受信先はGit対象外の .env.local に保存済み。

## 本番への接続

Resendで送信用APIキーを発行し、送信元ドメインを認証します。
Vercelプロジェクトの環境変数に以下を設定して再デプロイします。

- RESEND_API_KEY：Resendの送信専用キー
- CONTACT_TO_EMAIL：指定された受信先メールアドレス
- CONTACT_FROM_EMAIL：Resendで認証した送信元アドレス

秘密のキーをブラウザ用コードやGitに入れないでください。
返信操作は問い合わせ者の返信先メールアドレス宛になります。

ローカル確認：node --env-file-if-exists=.env.local serve.mjs
未接続では503と「メール受付を準備中」を返し、送信成功を表示しません。
配送テストは接続後に別途実施（今回の検証はメール送信をモック化）。

公式仕様：https://resend.com/docs/api-reference/emails/send-email
