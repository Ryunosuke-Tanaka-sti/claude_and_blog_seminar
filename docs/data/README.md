# ブログ記事データアーカイブ

このディレクトリには、SIOS Tech Labブログから取得した記事データが**Markdown形式**で格納されています。

## 🎉 最新情報（2025-11-19）

**全25記事をHTML形式からMarkdown形式に移行完了！**

- ✅ トークン削減率: 平均**77%**（生HTML → Markdown）
- ✅ 可読性: 大幅向上（Markdown形式）
- ✅ YAML frontmatter付き（メタデータ管理）
- ✅ 4カテゴリに分類整理

## 📁 ディレクトリ構造

```
docs/data/
├── README.md                           # このファイル
├── ai-tech-writing/                    # AI技術ブログ執筆術（8記事）
├── ai-development-methodology/         # AI開発手法（7記事）
├── visualization-tools/                # 図解・可視化ツール（3記事）
└── technical-infrastructure/           # 技術インフラ・自動化（7記事）
```

## 📊 カテゴリ別記事一覧

### 1. AI技術ブログ執筆術 (ai-tech-writing/) - 8記事

Claude AIを活用した技術ブログの執筆ワークフロー、品質管理、効率化手法。

**主なトピック**:
- ✅ ブログ執筆ワークフロー設計
- ✅ アウトライン作成の自動化
- ✅ 品質チェック・レビュー手法
- ✅ RAGもどきシステム
- ✅ Markdown保存・データ管理

**詳細**: [ai-tech-writing/README.md](ai-tech-writing/README.md)

---

### 2. AI開発手法 (ai-development-methodology/) - 7記事

Claude Codeを活用した開発手法、ベストプラクティス、アンチパターン。

**主なトピック**:
- ✅ 3フェーズ開発（計画→実装→検証）
- ✅ 仕様書ベース開発
- ✅ CLAUDE.md活用法
- ✅ Vibe Codingからの脱却
- ✅ Claude Code Skills統合

**詳細**: [ai-development-methodology/README.md](ai-development-methodology/README.md)

---

### 3. 図解・可視化ツール (visualization-tools/) - 3記事

Claude Codeを活用した図解作成、ダイアグラム自動生成。

**主なトピック**:
- ✅ Mermaid図の自動生成
- ✅ SVG図の自動生成
- ✅ HTML図解の自動生成
- ✅ 時短テクニック（2時間 → 5分）

**詳細**: [visualization-tools/README.md](visualization-tools/README.md)

---

### 4. 技術インフラ・自動化 (technical-infrastructure/) - 7記事

Claude AIを活用した技術インフラ構築、自動化、統合。

**主なトピック**:
- ✅ MCP（Model Context Protocol）統合
- ✅ プロンプトエンジニアリング
- ✅ CI/CD自動化（GitHub Actions）
- ✅ 型定義同期パイプライン
- ✅ API統合（Slack Bot、Notion）

**詳細**: [technical-infrastructure/README.md](technical-infrastructure/README.md)

---

## 🎯 記事の活用方法

### 1. RAGもどきシステムでの参照

既存記事を参照して新規記事を執筆する際に活用：

```bash
# 関連記事を探す
ls ai-development-methodology/
ls ai-tech-writing/

# Claude Codeに読み込ませる
@docs/data/ai-development-methodology/tech-lab-sios-jp-archives-49140.md
@docs/data/ai-tech-writing/tech-lab-sios-jp-archives-50103.md
```

### 2. トークン数削減効果

**Markdown形式への移行により実現**:
- 生HTML → Markdown: 平均**77%削減**
- 最高削減率: **89.20%**（記事48479）
- 可読性: 60点 → 90点（主観）

### 3. 文体・構成の一貫性確保

既存記事を参照することで：
- ✅ 記事品質の一貫性維持
- ✅ 重複チェックの効率化
- ✅ 執筆時間の大幅短縮（約50%）
- ✅ Claude Codeによる記事理解の向上

## 📄 データ形式

各Markdownファイルは以下の形式で保存されています：

```markdown
---
title: "記事タイトル"
url: https://tech-lab.sios.jp/archives/50245
image: https://tech-lab.sios.jp/wp-content/uploads/...
extracted_at: 2025-11-19T12:00:00.000Z
---

# 記事タイトル

## セクション1

本文...

- リスト項目
- リスト項目

**強調テキスト**

[リンク](https://example.com)

![image](https://example.com/image.png)
```

### YAML Frontmatter

- `title`: OGPタイトルまたはページタイトル
- `url`: 元記事のURL
- `image`: OGP画像URL
- `extracted_at`: 抽出日時（ISO 8601形式）

## 🔍 カテゴリ分類基準

### AI技術ブログ執筆術 (ai-tech-writing)
ブログ執筆プロセス、文体・品質向上、AIレビュー、コンテンツ制作効率化

**該当テーマ**:
- ブログ品質チェック、ファクト検証
- 文体統一、校閲・修正
- SEO最適化、タイトル生成
- 音声認識、アウトライン作成
- ブログ→登壇資料の変換
- RAGもどきシステム

### AI開発手法 (ai-development-methodology)
Claude Codeの使い方、プロンプトテクニック、AI協業開発ワークフロー

**該当テーマ**:
- 3フェーズ開発（計画→実装→検証）
- 仕様書ベース開発
- プロンプトエンジニアリング
- Vibe Coding脱却
- セッション管理、スコープ制御
- Claude Code Skills

### 図解・可視化ツール (visualization-tools)
図解作成、ダイアグラム自動生成、可視化ツール

**該当テーマ**:
- Mermaid図の自動生成
- SVG図の自動生成
- HTML図解の自動生成
- 時短テクニック

### 技術インフラ・自動化 (technical-infrastructure)
技術インフラ構築、自動化、API統合、システム構成

**該当テーマ**:
- MCP統合（Notion、Slack）
- CI/CD自動化（GitHub Actions）
- 型定義同期パイプライン
- プロンプト制御
- API統合

## 📚 推奨読書ルート

### 初心者向け
1. **AI開発手法** → 開発プロセスの基礎を理解
2. **AI技術ブログ執筆術** → ブログ執筆に応用
3. **図解・可視化ツール** → 図解作成を効率化

### 中級者向け
1. **技術インフラ・自動化** → 自動化パイプライン構築
2. **AI開発手法**（応用編） → 失敗パターンを学ぶ
3. **AI技術ブログ執筆術**（RAGもどき） → 執筆を更に効率化

### カテゴリ横断学習
- 開発手法 + ブログ執筆 = 開発しながらブログも書く
- 図解ツール + ブログ執筆 = 図解付きブログを効率的に作成
- インフラ自動化 + ブログ執筆 = ブログ投稿を完全自動化

## 🔗 関連ドキュメント

- [プロジェクト全体ガイド](/CLAUDE.md)
- [計画フェーズルール](/docs/CLAUDE.md)
- [Marp実装ルール](/application/marp/CLAUDE.md)
- [Tools実装ルール](/application/tools/CLAUDE.md)

## 📝 更新履歴

- **2025-11-19**: 全記事をMarkdown形式に移行
  - HTML → Markdown変換完了（25記事）
  - トークン削減率: 平均77%達成
  - 4カテゴリに分類整理
  - 各カテゴリにREADME追加

- **2025-11-10**: ディレクトリ分割とREADME作成
  - 全22記事を3カテゴリに分類完了
  - AI開発手法シリーズ (9記事)
  - AI技術ブログ執筆 (8記事)
  - 技術基盤・パイプライン (5記事)
