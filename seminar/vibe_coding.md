---
marp: true
theme: github-dark
paginate: true
size: 16:9
style: |

---

<!--_class: title-->

# Vibe Coding検証

## AI支援開発の実践と学び
### 失敗から学んだシステム構築手法

---

<!-- _class: subTitle-->

# Part 1: 前提・問題意識

---

# AIに対する幻想を捨てる

<div class="highlight">

AIも人間も嘘や勘違いがある
意図したものを作るには厳密な準備が必要
100～300文字のプロンプトでは限界

</div>

---

<!-- _class: subTitle-->

# Part 2: 実験対象システム

---

# X Composer システム構成

- **フロントエンド**: Azure Static Web Apps (Next.js)
- **バックエンド**: Azure Web Apps (Nest.js)
- **スケジュール実行**: Azure Functions
- **環境変数管理**: Azure Key Vaults

すべてTypeScriptで構築

---

<!-- _class: subTitle-->

# Part 3: 失敗から学ぶ

---

# 失敗その1：コード書きたがり問題

<div class="box red">

## 問題
- 質問しても必ずコードを出力してくる
- 調査だけ依頼しても実装まで進む

</div>

<div class="box green">

## 対策
- 「質問だけです」と明確に指示
- 「調査のみで実装は不要」と伝える
- ドキュメントベースでのやり取りで仕様を明確に伝える

</div>

---

# 失敗その2：Vibe Debug問題

<div class="box red">

## 問題
- エラー→Vibe Debugの無限ループ
- 解消しない場合は「大胆な手法」を採用

</div>

<div class="box red">

## 大胆な手法の例
- リソースグループごと削除して作り直し
- 新規エンドポイント作成で回避
- 該当箇所を一時的に回避

</div>

---

# 失敗その3：ドメイン知識不足

<div class="box red">

## 実際の問題例
- `/api`プロキシ設定を無視してハードコード
- 既存の型定義を無視して重複作成
- 既存APIルートを無視して新規作成

</div>

<div class="box green">

## 解決策
**project-core.md**でドメイン知識を文書化

</div>

---

<!-- _class: subTitle-->

# Part 4: 手法（模索中）

---
<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 24px; }
</style>

# 手法1：ドキュメントベース

| Before | After |
|---------|-------|
| 100-300文字のプロンプト | 事前にドキュメント作成 |
| 意図が伝わらない | 論点整理後にレビュー |
| 手戻り多発 | 齟齬を事前解消 |


<div class="highlight">
雑なプロンプト ❌ → ドキュメントベース ✅
</div>

---
# 手法1：ドキュメントベース


## 実践：プロジェクト構造

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 24px; }
</style>

| 計画フェーズ | 実装フェーズ |
|------------|------------|
| `/docs` | `/application` |
| 設計・仕様策定 | コード実装 |
| 実装コード禁止 | 仕様に基づく実装 |


```bash
/
├── docs/                  # 計画・設計フェーズ
│   ├── features/          # 新機能計画
│   └── bugs/              # バグ調査計画
└── application/           # 実装フェーズ
```

---
# 手法1：ドキュメントベース


## 実践：CLAUDE.mdの役割分担

### 階層ごとの責任範囲

- **ルート**: 全体アーキテクチャ・共通ルール
- **計画層**: 実装コード禁止・仕様記述ルール  
- **実装層**: フレームワーク固有パターン・テストルール

各層で必要な情報のみ提供し認知負荷を軽減

---

# 手法2：タスク粒度

<div class="highlight">
2-3時間で完了する粒度に分割
</div>

### 適切な粒度の効果
- ドキュメントが膨大にならない
- AIが迷子にならない
- レビューが容易
- アジャイル開発との相性◎

---

# 手法3：型定義自動化

<div class="highlight">
人間もAIも触らないファイルを作成
</div>

```
バックエンド → OpenAPI Spec → フロントエンド型定義
           (自動生成)      (自動生成)
```

**効果**: フロント・バック間の型整合性を機械的に保証

---

<!-- _class: subTitle-->

# Part 5: 解決策：Vibe Coding手法

---

# 新機能開発フロー

<!--_class: twoColumns-->

<div>

## 📋 Phase 1: 計画
### `/docs/features/`

<div class="box blue">

**📝 ドキュメント作成**
- 機能概要
- API仕様設計
- 型定義
- アーキテクチャ設計

**🚫 実装コード禁止**

</div>

</div>

<div>

## 💻 Phase 2: 実装
### `/application/`

<div class="box green">

**⚙️ コード実装**
- 仕様に基づく実装
- テスト作成
- コードレビュー
- ブラッシュアップ

**📋 仕様書を参照**

</div>

</div>


---

# バグ修正フロー

### バグドキュメント構造
```
docs/bugs/YYYY-MM-DD-{feature}-{issue}.md
```

### 必須項目
- バグ概要（優先度・影響範囲）
- 問題詳細（期待 vs 実際）
- 技術調査（根本原因）
- 修正計画（変更対象・リスク）

---


<!-- _class: subTitle-->

# まとめ

---

# 検証中の内容


<div class="box blue">

### 実装のベストプラクティス
- **小さく始める**: 単一機能から導入
- **継続改善**: 定期的な振り返り
- **チーム実践**: 全員でルール共有

</div>

<div class="highlight">
適切なタイミングで適切な思考モードに集中
</div>

---

# 今後の検証

<div class="box blue">

**セキュリティ統合**
- GitHub ActionsでのFossID/Scan OSS活用
- 自動脆弱性スキャン
- ライセンスコンプライアンスチェック

</div>

<div class="box green">

**開発効率化**
- 自動化推進
- メトリクス収集
- フレームワーク化

</div>

