# Claude AI 技術ブログ執筆ガイド

Claudeを活用した技術ブログ執筆のテクニックやワークフローを体系的にまとめたドキュメントリポジトリです。

## 📝 概要

このリポジトリでは、AI（特にClaude）を活用して技術ブログの執筆効率を劇的に向上させる手法を解説しています。従来の12時間かかっていた執筆プロセスを4時間に短縮し、品質も向上させる実践的なテクニックを提供します。

## 🎯 対象読者

- 技術ブログを執筆しているエンジニア
- AIを活用した効率的な執筆環境を構築したい方
- Claude等のAIツールの実践的な活用方法を学びたい方
- 日本語での技術文書作成にAIを活用したい方

## 🚀 セットアップ

### 必要環境
- Node.js 18以上
- npm または yarn
- Git

### インストール手順

```bash
# リポジトリのクローン
git clone https://github.com/Ryunosuke-Tanaka-sti/claude_and_blog_seminar.git
cd claude_and_blog_seminar

# 依存関係のインストール
npm install
```

### 基本的な使い方

#### プレゼンテーションのビルド
```bash
# Claudeセミナースライドをビルド
npm run build:claude

# Notion連携ガイドをビルド
npm run build:notion
```

#### 記事取得ツール（Webスクレイパー）
```bash
# デフォルトURLの記事を取得
npm run scraper

# 特定の記事を取得
URL=https://tech-lab.sios.jp/archives/48173 npm run scraper

# TypeScriptをコンパイルして実行
npm run scraper:build
npm run scraper:run
```

スクレイパーは記事を取得し、Claudeのトークン使用量を最適化するために圧縮して`doc/`ディレクトリに保存します。

## 📁 ディレクトリ構成

### `/doc/` - ドキュメント・記事キャッシュ

技術ブログ記事のキャッシュストレージ。以下の記事が利用可能：

- **NotionMCP連携** ([48397](https://tech-lab.sios.jp/archives/48397)) - Notion連携によるAI協働環境の構築
- **SEOタイトル生成** ([48417](https://tech-lab.sios.jp/archives/48417)) - SEO最適化されたタイトル自動生成
- **執筆ワークフロー** ([48259](https://tech-lab.sios.jp/archives/48259)) - Claude活用による執筆ワークフロー全体像
- **プロンプト制御** ([48160](https://tech-lab.sios.jp/archives/48160)) - Claude制御のための効果的なプロンプト技術
- **Mermaid図表** ([48411](https://tech-lab.sios.jp/archives/48411)) - Mermaidを使った自動図表生成
- **執筆後評価** ([48196](https://tech-lab.sios.jp/archives/48196)) - AIによる品質チェック・評価手法
- **校閲・文体統一** ([48406](https://tech-lab.sios.jp/archives/48406)) - 文体統一と校正の自動化
- **音声認識執筆** ([48431](https://tech-lab.sios.jp/archives/48431)) - 音声入力を活用した執筆手法

### `/seminar/` - セミナー資料

Claude活用セミナー用の完整な教材セット：

- `claude_seminar_slides.md` - メインセミナー用スライド（Marp対応）
- `notion_and_claude_blog_write.md` - Notion×Claude連携の実践ガイド
- `assets/` - SVG図表・画像などの関連リソース
- `html/` - インタラクティブHTMLコンポーネント
- `commpass/` - 追加セミナーコンテンツ

### `/src/` - ユーティリティツール

- `scraper.ts` - 技術ブログ記事を取得・圧縮するTypeScriptツール

### `/theme/` - Marpテーマ

- `canyon-custom.css` - 明るいテーマ（黄色・シアンアクセント）
- `github-dark.css` - GitHub風ダークテーマ

### `/docs/` - 生成されたプレゼンテーション

ビルド済みのHTMLプレゼンテーションファイル

## 🚀 主要な効果

### 時間短縮効果
- **執筆時間**: 12時間 → 4時間（67%削減）
- **タイトル生成**: 1時間 → 5分（92%削減）
- **品質チェック**: 手動レビュー → 5分のAI自動チェック

### 品質向上効果
- 技術的正確性の向上
- SEO観点での最適化
- 読者体験の改善
- 文体の統一性確保

## 💡 核心テクニック

### 1. ブログ全文からのSEOタイトル生成
記事概要ではなく完成した記事全文をAIに入力し、内容に基づいた精度の高いタイトルを生成

### 2. Mermaidによる図表自動化
テキストベースで指示するだけで、美しいフローチャートや図表を自動生成

### 3. AIを第一読者にした品質管理
Gemini Deep ResearchやClaudeを活用した網羅的なファクトチェックと品質評価

### 4. プロンプト制御術
Claude暴走パターンの制御と効果的なAI協働のためのテクニック

## 🛠 推奨ツール

- **Claude** (Pro推奨) - メイン執筆支援AI
- **Notion** - 執筆環境・ドキュメント管理
- **Gemini** - Deep Researchによる品質チェック
- **Mermaid Live Editor** - 図表作成・確認
- **GitHub Copilot** - コード関連の支援

### 内蔵ツール

#### Webスクレイパー
技術ブログ記事を効率的に取得・圧縮するツール：

- **自動キャッシング**: 一度取得した記事は`doc/`に保存
- **トークン最適化**: Claude用に日本語テキストのトークン数を推定・圧縮
- **HTML圧縮**: 不要な属性を削除し、80%以上の圧縮率を実現
- **詳細な統計**: 圧縮前後のトークン数と削減率を表示

```bash
# 使用例
URL=https://tech-lab.sios.jp/archives/48173 npm run scraper
```

## 🎓 セミナー情報

45分間のClaude活用セミナーの完整な資料を提供：

- **初心者向け導入**: ChatGPT経験者なら誰でも実践可能
- **実演デモ**: 実際の執筆プロセスをライブ実演
- **プロンプトテンプレート**: すぐに使える実用的なテンプレート集
- **フォローアップ**: 練習用チェックリストと改善サイクル

## 📊 活用実績

- **159本**の技術ブログ執筆実績（2022年10月〜）
- **月間PV**: 10〜100倍改善事例あり
- **継続率向上**: AI協働により安定した執筆リズムを実現

## 🔄 改善サイクル

1. **実践**: 提供テンプレートで実際に執筆
2. **測定**: 時間・品質の効果測定
3. **改善**: プロンプトやワークフローの最適化
4. **共有**: 成功パターンのテンプレート化

## 📚 参考情報

- [SIOS Tech Lab - 技術ブログ実例](https://tech-lab.sios.jp/)
- [Claude公式ドキュメント](https://docs.anthropic.com/)
- [Notion MCP公式](https://developers.notion.com/docs/mcp)
- [Mermaid Live Editor](https://mermaid.live/)

## 🤝 コントリビューション

実際にテクニックを試してみた結果や改善提案は大歓迎です。効果的だった方法や課題があれば、イシューやプルリクエストでお知らせください。

## 📄 ライセンス

本リポジトリの内容は実践的な活用を目的としています。技術ブログやセミナーでの活用は自由ですが、出典明記をお願いします。

---

**Claudeとの協働で、あなたの技術ブログ執筆が3倍速くなることを願っています！** 🚀