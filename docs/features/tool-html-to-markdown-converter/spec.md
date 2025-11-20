# ツール仕様書：HTML→Markdown変換機能（scraper.ts統合）

## 概要
既存のブログスクレイパー（`application/tools/scraper.ts`）にHTML→Markdown変換機能を統合し、記事保存形式をHTMLからMarkdownに移行します。これにより、トークン数の削減（さらに約20%）と可読性の向上を実現します。

## 背景・課題

### 現在の実装（scraper.ts）の状況
**実装済みの機能**:
- ✅ ブログ記事のHTML取得（`fetchAndParseHtml`）
- ✅ OGP情報の抽出（`extractOgpInfo`）
- ✅ メインコンテンツの抽出（`extractAndCompressContent`）
  - CSSセレクタ: `section.entry-content`
  - script/style/noscriptタグの削除
  - 不要な属性（class/id/style）の削除
  - 画像のalt/src情報の保持
- ✅ トークン数の推定（`estimateClaudeTokens`）
- ✅ HTMLファイルの保存（`docs/data/*.html`）
- ✅ キャッシュ機能（既存ファイルはスキップ）

**現在の削減率**:
- 生HTML → 抽出HTML: 約50-60%削減
- 総合圧縮率: 約73%（記事50245の実測値）

### 課題
**記事50175で指摘された問題点**:
1. **トークン消費が多い**: HTMLタグ（`<div>`, `<p>`, `<section>`など）がまだ残っている
2. **可読性が低い**: AIも人間もHTMLタグが邪魔で読みにくい
3. **改善の余地**: さらに20%程度のトークン削減が可能

### 解決策
HTML→Markdown変換を追加実装することで：
- ✅ さらに約20%のトークン削減（抽出HTML → Markdown）
- ✅ 累積で約65%の削減（生HTML → Markdown全体）
- ✅ 可読性の大幅向上（60点 → 90点）
- ✅ 構造情報の保持（見出し、リスト、コードブロックなど）

## 目的
既存のscraper.tsに最小限の変更でHTML→Markdown変換機能を追加し、記事保存形式をMarkdownに移行する。

## 機能要件

### 1. Markdown変換処理の追加
**入力**: 抽出・圧縮されたHTML文字列（既存の`extractAndCompressContent`の出力）
**出力**: Markdown形式の文字列（YAML frontmatter付き）

**処理内容**:
- HTMLタグ → Markdown記法への変換
- YAML frontmatterの追加（メタデータ）
- 長いalt属性の簡略化（100文字以上 → `![image](src)`）
- div/spanタグの除去（テキストのみ抽出）

### 2. ファイル保存形式の変更
**現在**: `docs/data/*.html`
**変更後**: `docs/data/*.md`

**ファイル名の規則**（変更なし）:
- パターン: `{domain-path}.md`
- 例: `tech-lab-sios-jp-archives-50245.md`

### 3. YAML frontmatterの構造
```yaml
---
title: "記事タイトル"
url: https://tech-lab.sios.jp/archives/50245
image: https://tech-lab.sios.jp/wp-content/uploads/...
extracted_at: 2025-11-19T12:00:00.000Z
---
```

**フィールド説明**:
- `title`: OGPタイトルまたはページタイトル
- `url`: 元記事のURL
- `image`: OGP画像URL
- `extracted_at`: 抽出日時（ISO 8601形式）

### 4. Markdown変換のカスタマイズ

#### 4.1 基本設定
- **見出しスタイル**: atx形式（`##`）
- **リストマーカー**: `-`
- **コードブロック**: fenced形式（```）
- **強調記法**: `**` (strong), `*` (em)
- **リンクスタイル**: inlined

#### 4.2 カスタムルール

**画像の処理**（SIOS Tech Lab特有）:
- alt属性が100文字以上の場合 → `![image](src)`に簡略化
- 理由: WordPressのMermaidプラグインがalt属性に図のコード全体を格納するため
- 100文字未満の場合 → `![alt](src)`として保持

**div/spanタグの処理**:
- テキストのみ抽出（タグを完全除去）
- 構造情報は失われるが、トークン削減を優先

**目次（ToC）の処理**:
- 目次要素（`.toc`など）は除外
- 本文のみを保持

### 5. トークン数の計測と報告

**計測ポイント**（既存に追加）:
1. 生HTML（ページ全体）
2. 抽出HTML（記事本文のみ）
3. **Markdown（最終形態）← NEW**

**報告内容**（拡張）:
```
元ページ全体のトークン数: 35,420
抽出後のトークン数: 15,680
Markdown変換後のトークン数: 12,440 ← NEW

抽出による削減: 19,740 (55.7%)
圧縮による削減: 3,240 (20.7%) ← 名称変更
総削減トークン数: 22,980 (64.9%)
```

### 6. 既存機能の保持

**変更しない機能**:
- ✅ URL検証（`https://tech-lab.sios.jp/archives`で始まる）
- ✅ キャッシュ機能（既存ファイルはスキップ）
- ✅ OGP情報の抽出
- ✅ エラーハンドリング
- ✅ 環境変数からのURL取得（`process.env.URL`）

**変更する機能**:
- ファイル拡張子: `.html` → `.md`
- 保存内容: HTML → Markdown
- トークン計測: 2段階 → 3段階

## データ仕様

### 入力データ

#### 1. URL（環境変数）
```typescript
const url = process.env.URL || '';
```

**制約**:
- `https://tech-lab.sios.jp/archives`で始まること
- 指定がない場合はデフォルトURL使用

#### 2. 抽出HTML（関数内部）
```typescript
// extractAndCompressContent の出力
const compressedHtml: string = `
<!--
ブログ記事情報:
タイトル: ...
URL: ...
-->
<h1>記事タイトル</h1>
<h2>セクション1</h2>
<p>本文...</p>
`;
```

### 出力データ

#### 1. Markdownファイル
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

- リスト項目1
- リスト項目2

**強調テキスト**

[リンクテキスト](https://example.com)

![image](https://example.com/image.png)
```

#### 2. コンソール出力
```
📁 Markdownファイル保存先: /home/node/workspace/docs/data/tech-lab-sios-jp-archives-50245.md
🔄 HTML取得・パース開始...
📄 ページタイトル: 記事タイトル
🔧 コンテンツ抽出・圧縮開始...
元ページ全体のトークン数: 35,420
抽出後のトークン数: 15,680
Markdown変換後のトークン数: 12,440
抽出による削減: 19,740
Markdown変換による削減: 3,240
総削減トークン数: 22,980
抽出による削減率: 55.70%
Markdown変換による削減率: 20.70%
総合圧縮率: 64.90%
💾 Markdownファイル保存中: ...
✅ Markdownファイルを保存しました: ...
📊 ファイルサイズ: 28934 bytes
```

## 非機能要件

### パフォーマンス
- **変換速度**: 1記事あたり3秒以内（ネットワーク時間を除く）
- **メモリ使用量**: 既存実装と同程度（増加は最小限）

### 互換性
- **Node.js**: 既存のバージョン要件を維持
- **依存関係**: 新規追加は`turndown`と`@types/turndown`のみ
- **既存コード**: 既存の関数シグネチャは変更しない（内部実装のみ変更）

### エラーハンドリング
- **ネットワークエラー**: 既存と同様のエラーメッセージ
- **パースエラー**: Markdown変換失敗時は元のHTMLを保存（フォールバック）
- **ファイル書き込みエラー**: 既存と同様のエラーハンドリング

### ロギング
- **進捗表示**: 絵文字付きで分かりやすく
- **統計情報**: トークン削減率を3段階で表示
- **デバッグ情報**: 必要に応じて詳細ログを出力可能

## 技術的制約

### 使用ライブラリ
**新規追加**:
- `turndown`: HTML→Markdown変換（v7.x推奨）
- `@types/turndown`: TypeScript型定義

**既存の依存関係**（変更なし）:
- `cheerio`: HTML/XMLパース
- `node-fetch`: HTTPリクエスト

### TypeScript設定（変更なし）
- target: ES2020
- module: commonjs
- strict: true

### ファイル構造
```typescript
// 既存の関数（変更なし）
async function fetchAndParseHtml(url: string): Promise<CheerioAPI | null>
function estimateClaudeTokens(text: string): number
function extractOgpInfo($: CheerioAPI): { title: string; image: string; url: string }

// 既存の関数（内部実装を拡張）
function extractAndCompressContent(...): string

// 新規追加の関数
function convertHtmlToMarkdown(html: string, metadata: OgpInfo): string
function createYamlFrontmatter(metadata: OgpInfo, extractedAt: Date): string

// メイン関数（内部処理を拡張）
async function main()
```

## テスト観点

### 機能テスト

#### 1. Markdown変換の正確性
**テスト内容**:
- 見出し（H1-H6）が正しく変換される
- リスト（ul/ol）が正しく変換される
- リンク（a）が正しく変換される
- 画像（img）が正しく変換される
- 強調（strong/em）が正しく変換される
- コードブロック（pre/code）が正しく変換される

**期待結果**: すべてのHTML要素がMarkdown記法に正しく変換される

#### 2. YAML frontmatterの生成
**テスト内容**:
- titleフィールドが正しく設定される
- urlフィールドが正しく設定される
- imageフィールドが正しく設定される
- extracted_atフィールドがISO 8601形式で設定される

**期待結果**: YAML形式が正しく、パース可能

#### 3. 長いalt属性の簡略化
**テスト内容**:
- alt属性が100文字以上の画像 → `![image](src)`に変換
- alt属性が100文字未満の画像 → `![alt](src)`に変換

**期待結果**: Mermaid図など、長いalt属性が簡略化される

#### 4. トークン削減効果
**テスト内容**:
- 既存の3記事（50103, 50109, 50142）で検証
- 抽出HTML → Markdownの削減率を計測

**期待結果**: 平均20%以上の削減率

### 互換性テスト

#### 1. 既存機能の保持
**テスト内容**:
- URL検証が正しく動作する
- キャッシュ機能が正しく動作する
- OGP情報の抽出が正しく動作する
- エラーハンドリングが正しく動作する

**期待結果**: 既存機能に影響がない

#### 2. ファイル保存形式の変更
**テスト内容**:
- 新規実行時は`.md`ファイルが生成される
- 既存の`.html`ファイルがある場合の動作確認

**期待結果**: `.md`ファイルが正しく保存される

### エラーテスト

#### 1. ネットワークエラー
**テスト内容**:
- 無効なURLを指定
- タイムアウトが発生する状況

**期待結果**: 適切なエラーメッセージが表示される

#### 2. パースエラー
**テスト内容**:
- セレクタに該当する要素がない
- 不正なHTML構造

**期待結果**: エラーメッセージが表示され、処理が中断される

#### 3. ファイル書き込みエラー
**テスト内容**:
- 書き込み権限がない
- ディスク容量不足

**期待結果**: エラーメッセージが表示される

## 実装の優先順位

### Phase 1: 基本実装（必須）
1. Turndownライブラリのインストール
2. `convertHtmlToMarkdown`関数の実装
3. `createYamlFrontmatter`関数の実装
4. メイン処理への統合（`.md`ファイル保存）
5. トークン計測の拡張（3段階）

### Phase 2: カスタマイズ（必須）
1. 長いalt属性の簡略化（カスタムルール）
2. div/spanタグの除去（カスタムルール）
3. Markdown変換設定の最適化

### Phase 3: 検証（必須）
1. 既存の3記事での動作確認
2. トークン削減率の測定
3. 可読性の確認（目視）

### Phase 4: ドキュメント整備（推奨）
1. README.mdの更新（使用方法の変更）
2. 変換例のドキュメント作成
3. トラブルシューティングガイド

## 成功基準

### 定量的基準
- ✅ トークン削減率: 抽出HTML → Markdown で平均20%以上
- ✅ 総合削減率: 生HTML → Markdown で平均65%以上
- ✅ 変換速度: 1記事あたり3秒以内（ネットワーク時間を除く）
- ✅ テスト合格率: 機能テスト100%、互換性テスト100%

### 定性的基準
- ✅ Markdown形式が正しく、人間が読みやすい
- ✅ 構造情報（見出し、リスト）が保持されている
- ✅ Claude Codeによる記事理解が向上している
- ✅ 既存機能に影響がない

## 制約事項と注意点

### SIOS Tech Lab特有の実装
- CSSセレクタ: `section.entry-content`（他サイトでは変更が必要）
- 長いalt属性の簡略化: Mermaidプラグインに対応（他サイトでは不要な場合あり）

### 他サイトへの適用時の注意
- 必ず利用規約とrobots.txtを確認
- サイト運営者の許可を取得
- CSSセレクタのカスタマイズが必要

### 既存HTMLファイルとの共存
- 既存の`.html`ファイルは残す（削除しない）
- 新規実行時は`.md`ファイルを生成
- 必要に応じて手動で`.html`ファイルを削除可能

## 参考資料

### 関連記事
- 記事50175: 「HTMLでブログ記事を保存してる奴、全員Markdownにしろ。AIが読みにくいでしょうが！」
  - Python実装の参考例（markdownifyライブラリ使用）
  - トークン削減率の実測データ
  - カスタマイズ例（長いalt属性の処理）

### 調査結果
- `docs/research/html-to-markdown-libraries-review.md`
  - Turndown、node-html-markdown、rehype-remarkの比較
  - 推奨ライブラリの選定理由

### 既存実装
- `application/tools/scraper.ts`
  - 現在のHTML抽出・圧縮処理
  - トークン計測ロジック
  - エラーハンドリングパターン

### 技術ドキュメント
- Turndown GitHub: https://github.com/mixmark-io/turndown
- Turndown npm: https://www.npmjs.com/package/turndown
- @types/turndown: https://www.npmjs.com/package/@types/turndown

## 更新履歴
- 2025-11-19: 初版作成（既存scraper.tsへのMarkdown変換機能統合仕様）
