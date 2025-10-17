---
marp: true
theme: github-dark
paginate: true
size: 16:9

---

<!--_class: title-->

# Slack Bot × Notebook LM

## データ収集を効率化する自動化システム
### Google Docs連携による開発事例

---

# 課題と背景

<div class="box red">

## よくある課題
- **AIサービスの乱立**: 特色が異なるサービスが多数存在
- **データ連携の困難さ**: Google Docs未使用による取り込みの手間
- **情報整理の負担**: Slackの会話をまとめる作業が煩雑

</div>

<div class="box blue">

## 開発現場の実態
- **仕様変更の決定**: 仕様書に反映する前にSlack上で議論・決定
- **頻出情報の散在**: ナレッジがSlack上に点在
- **情報の流失**: 重要な意思決定の経緯が埋もれる

</div>

---

# ソリューション概要

```
Slackメッセージにリアクション
    ↓
Slack Events APIで検知
    ↓
スレッド全体を取得
    ↓
Google Docsに自動追記
    ↓
Notebook LMで活用
```

<div class="highlight">
リアクション1つで完了。Google Docsを開く必要なし！
</div>

---

# 技術スタック

<!--_class: twoColumns-->

<div>

## バックエンド
- **NestJS** + TypeScript
- **@slack/web-api**
- **googleapis**

## Slack API
- Events API (reaction_added)
- conversations.history
- conversations.replies

</div>

<div>

## Google Docs API
- Service Account認証
- documents.batchUpdate

## セキュリティ
- Slack署名検証
- リプレイアタック防止

</div>

---

# 処理フロー

<div class="box blue">

**1. 初期設定とメッセージ送信**
ユーザーがSlackにメッセージを送信

**2. Slack Events APIによる監視**
`reaction_added` イベントをキャッチ

**3. メッセージ情報の取得**
親メッセージとスレッド全体を取得

**4. Google Docs連携処理**
Service Accountで認証し、ドキュメントに追記

**5. 完了通知**
Slackスレッドに結果を返信

</div>

---

# 実装ポイント: Slack連携

<div class="box green">

## Events Subscriptions設定
```typescript
if (event.type === 'reaction_added') {
  if (event.reaction == 'notebooklm') {
    this.slackService.updateDataSource(event);
  }
}
```

## スレッド全体の取得
- `conversations.history`: 親メッセージ取得（limit:1）
- `conversations.replies`: スレッド内返信を取得
- BOTメッセージは除外して処理

</div>

---

# 実装ポイント: Google Docs連携

<div class="box green">

## Service Account認証
```typescript
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.DOCS_CLIENT_EMAIL,
    private_key: process.env.DOCS_PRIVATE_KEY,
  },
  scopes: [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive'
  ],
});
```

## ドキュメントへの追記
`documents.batchUpdate` でトップに追記

</div>

---

# セキュリティ: 署名検証

<div class="box red">

## Slack署名検証の実装
- **Signing Secret**: Slack Developerから取得
- **HMAC-SHA256**: 署名の計算
- **timingSafeEqual**: タイミング攻撃対策

## リプレイアタック防止
- タイムスタンプの検証（5分以内）
- 古いリクエストは拒否

</div>

**実装方法**: NestJSのGuards機能で事前検証を実装

---

# 今後の展望

<div class="box green">

## 機能拡張の方向性
- **ファイル対応拡大**: 画像（OCR）、PDF、スプレッドシート
- **リアクション分類**: `:important:` / `:todo:` / `:knowledge:`

</div>

<div class="box blue">

## システム改善とAI統合
- **パフォーマンス向上**: Redis Queue導入、非同期処理
- **AI要約機能**: 長いスレッドの自動要約
- **ドキュメント分割**: 容量制限への対応

</div>

---

# まとめ

<div class="box blue">

## このシステムの価値
- **工数削減**: Google Docsを開かずにデータ収集
- **自然な統合**: Slackの日常業務に溶け込む
- **柔軟性**: リアクション1つで情報整理が完了
- **拡張性**: 今後の機能追加が容易

</div>

<div class="highlight">
日常のワークフローに自然に溶け込むAI活用の実践例
</div>

**参考記事**: [Notebook LMへのデータ収集をSlack Botで効率化する開発](https://tech-lab.sios.jp/archives/47891)
