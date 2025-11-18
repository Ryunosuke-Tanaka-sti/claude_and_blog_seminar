# ブログ記事データアーカイブ

このディレクトリには、SIOS Tech Labブログから取得した記事データが格納されています。

## ディレクトリ構造

```
docs/data/
├── README.md                           # このファイル
├── ai-development-methodology/         # AI開発手法シリーズ
├── ai-tech-write/                      # AI技術ブログ執筆
└── technical-infrastructure/           # 技術基盤・パイプライン
```

## カテゴリ別記事一覧

### 1. AI開発手法シリーズ (ai-development-methodology/)

Claude CodeとAIを活用した開発手法・ワークフロー、プロンプトエンジニアリングに関する記事群（9記事）

- **tech-lab-sios-jp-archives-48160.html**
  `Claude調教術｜暴走パターンを制御する3つのプロンプトテクニック`
  Claudeの暴走制御、成果物制御、会話継続、ペース調整の3つのプロンプトテクニック

- **tech-lab-sios-jp-archives-49136.html**
  `「適当にプロンプト投げるだけ」を卒業！Vibe Coding脱却術：【Claude Code】`
  Vibe Codingの落とし穴、ドキュメント化の重要性、セッション管理のベストプラクティス

- **tech-lab-sios-jp-archives-49140.html**
  `Claude Code革命！3フェーズ開発で効率的な開発：計画→実装→検証術`
  計画・実装・検証の3フェーズに分けたAI協業開発手法の基礎

- **tech-lab-sios-jp-archives-49148.html**
  `AI協働で仕様書アレルギー克服！開発時間を1週間→2日に短縮する実践法`
  AIと協力した仕様書作成フロー、開発時間の大幅短縮事例

- **tech-lab-sios-jp-archives-49154.html**
  `Claude Code仕様書ベースでハマる6つの落とし穴！失敗回避の備忘録`
  仕様書ベース開発の実践、失敗パターンと対策

- **tech-lab-sios-jp-archives-49594.html**
  `AI協働開発の落とし穴回避！3ヶ月で実証した計画ドキュメントの価値`
  計画ドキュメントの重要性、意思決定と実行の分離、パーツ化による標準化

- **tech-lab-sios-jp-archives-50103.html**
  `【2025年版】検証→記事化で知見を資産化！Claude Code×RAGもどきでAI技術ブログ執筆を効率化`
  4フェーズワークフロー（計画→実装→研究記録→記事化）、RAGもどきによるトークン削減50-60%、文体補正システム、記事執筆時間50%削減

- **tech-lab-sios-jp-archives-50109.html**
  `AI協業開発環境の構築術｜モノレポでビルド時間を大幅短縮するCLAUDE.md活用法`
  モノレポ構成でのCLAUDE.md階層構造、4フェーズワークフロー、paths フィルタによるCI/CD最適化

- **tech-lab-sios-jp-archives-50154.html**
  `Claude Code Skills 実装ガイド：ローカルツールをスムーズに統合する方法`
  プロジェクト固有のツールをClaude Code Skillsとして登録する手法、Progressive Loading

### 2. AI技術ブログ執筆 (ai-tech-write/)

ブログ執筆プロセス、文体・品質向上、AIによるレビュー・効率化に関する記事群（8記事）

- **tech-lab-sios-jp-archives-48196.html**
  `【実践解説】技術ブログ品質チェック術｜Gemini Deep Researchで5分検証`
  ブログ品質チェック、ファクト検証、AIを第一読者にする手法

- **tech-lab-sios-jp-archives-48259.html**
  `Claude×技術ブログで執筆環境が激変！次世代AI協働ワークフロー解説`
  技術ブログ執筆ワークフロー全体、文体統一、AI協働による品質向上プロセス

- **tech-lab-sios-jp-archives-48406.html**
  `Claude技術ブログ品質向上の試行錯誤｜3段階チェックで安定【プロンプト実践】`
  ブログ品質チェックの3段階プロセス（文体統一、技術検証、アウトライン評価）

- **tech-lab-sios-jp-archives-48411.html**
  `ClaudeでMermaid図作成を自動化！2時間→5分の劇的時短術【Live Editor活用】`
  ブログ用図表作成の効率化、視覚的コンテンツ制作の自動化

- **tech-lab-sios-jp-archives-48417.html**
  `SEOなんもわからんけんClaudeに丸投げしたらストレスフリーになった話`
  タイトル・メタディスクリプション生成、SEO最適化など、ブログ公開準備の自動化

- **tech-lab-sios-jp-archives-48431.html**
  `Notion×MCP×音声認識でブログを3倍速執筆！技術者向け効率化ワークフロー解説`
  音声認識による執筆効率化、AIによる校閲・修正、ブログ執筆ワークフローの革新

- **tech-lab-sios-jp-archives-48479.html**
  `【ブログ→登壇資料】Claude×Marpで80時間を11時間に短縮した方法`
  ブログコンテンツの再利用、登壇資料への変換、コンテンツ制作の効率化

- **tech-lab-sios-jp-archives-48538.html**
  `Claude活用アウトライン作成術：対話型vs抽出型の実践比較【2025最新】`
  ブログ執筆のアウトライン作成手法、構成設計のAI活用

### 3. 技術基盤・パイプライン (technical-infrastructure/)

フロントエンド・バックエンド間の型安全性、自動生成パイプライン、API統合に関する記事群（5記事）

- **tech-lab-sios-jp-archives-47891.html**
  `Notebook LMへのデータ収集をSlack Botで効率化する開発 with Google Docs`
  Slack Bot開発、Slack Events API、Google Docs連携による自動化

- **tech-lab-sios-jp-archives-48397.html**
  `Claude×Notion MCP実装術｜コネクタ版とIntegration版の選び方解説`
  MCPの技術実装、API統合、システム構成の技術的詳細

- **tech-lab-sios-jp-archives-49116.html**
  `Claude API×GitHub Actions完全自動化でコスト60%削減！ブログ投稿システム構築術`
  API統合、自動化パイプライン、GitHub Actions実装、技術基盤構築

- **tech-lab-sios-jp-archives-49157.html**
  `AIと爆速開発！Next.js×Nest.js型定義同期の自動生成パイプライン構築術`
  Backend DTOs → OpenAPI → Frontend Types の自動生成パイプライン、型定義の齟齬解消

- **tech-lab-sios-jp-archives-49591.html**
  `Orval SWRの自動生成をやめた理由 – SWRの本質を見失っていた話`
  SWRの適材適所な使用、Read処理にはSWR、CUD処理にはAxios直接呼び出し

## 記事の活用方法

### 1. RAGもどきシステムでの参照

既存記事を参照して新規記事を執筆する際に活用：

```bash
# 関連記事を探す
ls ai-development-methodology/
ls ai-tech-write/
ls technical-infrastructure/

# Claude Codeに読み込ませる
@docs/data/ai-development-methodology/tech-lab-sios-jp-archives-49140.html
```

### 2. トークン数削減効果

- 元ページ全体と比較して**50-60%のトークン削減**を実現
- 不要なヘッダー・フッター・サイドバーを除去
- 記事本文のみを抽出し、構造を保持

### 3. 文体・構成の一貫性確保

既存記事を参照することで：
- 記事品質の一貫性維持
- 重複チェックの効率化
- 執筆時間の大幅短縮（約50%）

## データ形式

各HTMLファイルは以下の形式で保存されています：

```html
<!--
ブログ記事情報:
タイトル: [記事タイトル]
URL: https://tech-lab.sios.jp/archives/[記事ID]
OGP画像: [画像URL]
抽出日時: [ISO8601形式のタイムスタンプ]
-->

<h1>[記事タイトル]</h1>
<!-- 記事本文 -->
```

## カテゴリ分類基準

### AI開発手法シリーズ (ai-development-methodology)
Claude Codeの使い方、プロンプトテクニック、AI協業開発のワークフロー、開発効率化手法

**該当テーマ**:
- 3フェーズ開発（計画→実装→検証）
- 仕様書ベース開発
- プロンプトエンジニアリング
- Claude Codeのベストプラクティス
- セッション管理、スコープ制御

### AI技術ブログ執筆 (ai-tech-write)
ブログ執筆プロセス、文体・品質向上、AIによるレビュー、コンテンツ制作の効率化

**該当テーマ**:
- ブログ品質チェック、ファクト検証
- 文体統一、校閲・修正
- SEO最適化、タイトル生成
- 図表作成の自動化
- 音声認識、アウトライン作成
- ブログ→登壇資料の変換

### 技術基盤・パイプライン (technical-infrastructure)
フロントエンド・バックエンド間の型安全性、自動生成パイプライン、API統合、システム構成

**該当テーマ**:
- 型定義の自動同期（OpenAPI、Orval）
- API統合（Slack Bot、Notion MCP）
- 自動化パイプライン（GitHub Actions）
- データフェッチング戦略（SWR vs Axios）

## 関連ドキュメント

- [プロジェクト全体ガイド](/CLAUDE.md)
- [計画フェーズルール](/docs/CLAUDE.md)
- [記事執筆ガイド](/docs/article/CLAUDE.md)
- [文体スタイルガイド](/docs/article/writing-style-prompt.md)

## 更新履歴

- 2025-11-10: ディレクトリ分割とREADME作成
  - 全22記事を3カテゴリに分類完了
  - AI開発手法シリーズ (9記事)
  - AI技術ブログ執筆 (8記事)
  - 技術基盤・パイプライン (5記事)
