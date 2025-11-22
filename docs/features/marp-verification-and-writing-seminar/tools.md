# ブログコンテンツ作成ツール群

## 概要

技術ブログ記事の品質向上とコンテンツ作成を支援する、Claude Code の Skills と Agents のまとめです。

以下の3つのカテゴリに特化：
1. **図解生成・変換ツール**（SVG/HTML → PNG）
2. **ブログ記事レビューツール**（品質評価・改善提案）
3. **ブログ記事取得ツール**（スクレイピング・下書き削除）

---

## 1. 図解生成・変換ツール

### 1.1 diagram-generator-svg (Skill)

**目的**: 技術ブログ記事用のSVG図解を生成

**実装**: `.claude/skills/diagram-generator-svg.md`

**主な機能**:
- ✅ 6つのデザインパターン（アーキテクチャ、フロー、関係、比較、コンポーネント、概念）
- ✅ アクセシビリティ準拠（WCAG Level AA、4.5:1以上のコントラスト比）
- ✅ Material Icons統合
- ✅ 推奨サイズ: 1280 x 720 px (16:9)

**デザイン仕様**:
- `<title>` と `<desc>` 要素によるアクセシビリティ対応
- 色 + 形状 + パターンの組み合わせ（色依存回避）
- 最小フォントサイズ: 14px以上
- 3-5色の推奨カラーパレット

**推奨カラーパレット**:
```
Primary:   #2196F3 (青)
Secondary: #4CAF50 (緑)
Accent:    #FF9800 (オレンジ)
Text:      #212121 (濃いグレー)
BG:        #FFFFFF (白)
Border:    #BDBDBD (グレー)
```

**保存先**: `docs/article/[feature-name]/images/`

**使用例**:
- ユーザー: 「アーキテクチャ図を作って」
- ユーザー: 「フロー図を生成して」

---

### 1.2 diagram-generator-html (Skill)

**目的**: 技術ブログ記事用のHTML図解を生成し、PNG画像に変換

**実装**: `.claude/skills/diagram-generator-html.md`

**主な機能**:
- ✅ Tailwind CSS使用（CSS機能による柔軟なレイアウト）
- ✅ Material Icons統合
- ✅ 6つのデザインパターン（SVG版と同じ）
- ✅ HTML生成 → PNG変換（自動）

**HTML作成の必須ルール**:

⚠️ **重要**: 以下のルールを必ず守る

1. ✅ **1ファイル = 1図解**
2. ✅ **固定サイズ・背景色必須**: `<body class="w-[1280px] h-[720px] m-0 p-0 overflow-hidden bg-[背景色]">`
3. ✅ **外側padding**: `p-8` (32px) または `p-10` (40px)
4. ✅ **要素間隔**: `gap-4` (16px)
5. ✅ **Tailwind CDN**: `<script src="https://cdn.tailwindcss.com"></script>`
6. ✅ **JavaScriptによる動的要素禁止**
7. ✅ **アニメーション禁止**: `animate-*`, `transition-*`, `hover:*`
8. ✅ **カスタムCSS禁止**: Tailwind Utilityのみ使用
9. ✅ **最小フォントサイズ**: 14px (`text-sm`) 以上
10. ✅ **高さ制限厳守**: コンテンツが720pxに収まるよう調整

**Tailwind カラーパレット**:

| 用途 | Tailwind Class | 説明 |
|------|---------------|------|
| **Primary** | `bg-blue-500`, `text-blue-900` | 主要要素 |
| **Secondary** | `bg-green-500`, `text-green-900` | 補助要素 |
| **Accent** | `bg-orange-500`, `text-orange-900` | 強調要素 |
| **Text** | `text-gray-900` | テキスト |
| **Background** | `bg-white`, `bg-gray-50` | 背景 |
| **Border** | `border-gray-300` | ボーダー |

**Material Icons 使用方法**:

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>アイコン使用例</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Material Symbols Outlined フォント読み込み -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
</head>
<body class="w-[1280px] h-[720px] m-0 p-0 overflow-hidden">
    <div class="w-full h-full bg-white flex items-center justify-center gap-8">
        <!-- データベースアイコン -->
        <div class="flex flex-col items-center">
            <span class="material-symbols-outlined text-6xl text-blue-600">database</span>
            <p class="text-sm mt-2">データベース</p>
        </div>
    </div>
</body>
</html>
```

**保存先**:
- HTML: `docs/article/[feature-name]/images/diagram.html`
- PNG: `docs/article/[feature-name]/images/diagram.png` (自動生成)

**ワークフロー**:
1. diagram-generator-html が図解用HTMLファイルを作成
2. HTMLファイルを `docs/article/[feature-name]/images/` に保存
3. html-to-png Skill が自動的にPNG変換を実行

**使用例**:
- ユーザー: 「HTMLでアーキテクチャ図を作って」
- ユーザー: 「Tailwindでフロー図を生成して」

---

### 1.3 svg-to-png (Skill)

**目的**: SVGファイルを高品質なPNG形式に変換

**実装**: `.claude/skills/svg-to-png.md`

**CLI Tool**: `svg2png` (CairoSVG使用)

**主な機能**:
- ✅ 単一ファイル変換
- ✅ バッチ変換（ディレクトリ内全SVG）
- ✅ カスタムサイズ指定
- ✅ 高品質変換（アンチエイリアシング有効）

**変換仕様**:
- 推奨サイズ: 1280 x 720 px (16:9)
- DPI: 72 (Web標準)
- ファイルサイズ上限: 200KB推奨
- フォーマット: PNG (24-bit RGB + Alpha)

**使い方**:

```bash
# 単一ファイル変換
uv run --package sios-tech-lab-analytics-ga4-tools svg2png \
  docs/article/tmp-driven-development/images/architecture-diagram.svg

# カスタムサイズ指定
uv run --package sios-tech-lab-analytics-ga4-tools svg2png \
  --width 1920 --height 1080 \
  docs/article/[feature-name]/images/diagram.svg

# バッチ変換（ディレクトリ内全SVG）
uv run --package sios-tech-lab-analytics-ga4-tools svg2png \
  --batch \
  docs/article/tmp-driven-development/images/
```

**出力例（バッチモード）**:
```
🚀 SVG to PNG Converter (バッチモード) 起動
📁 処理対象: 3 件のSVGファイル

🔄 処理中: diagram1.svg
  ✅ 23.55 KB
🔄 処理中: diagram2.svg
  ✅ 45.32 KB
🔄 処理中: diagram3.svg
  ✅ 18.76 KB

==================================================
📊 処理結果サマリー
  成功: 3
  失敗: 0
  合計: 3
  平均サイズ: 29.21 KB
  最大サイズ: 45.32 KB
  200KB超過: 0
==================================================
✅ すべての処理が完了しました
```

**使用例**:
- ユーザー: 「SVGをPNGに変換して」
- diagram-generator-svg で生成したSVGを自動変換

---

### 1.4 html-to-png (Skill)

**目的**: HTMLファイルまたはHTML文字列をPNG画像に変換

**実装**: `.claude/skills/html-to-png.md`

**CLI Tool**: `html-screenshot` (Python Playwright使用)

**主な機能**:
- ✅ HTMLファイルから変換（推奨）
- ✅ HTML文字列から変換
- ✅ Tailwind CDNなど外部リソース対応
- ✅ 透明背景サポート

**変換仕様**:
- 推奨サイズ: 1280 x 720 px (16:9)
- フォーマット: PNG (24-bit RGB + Alpha)
- ファイルサイズ上限: 200KB推奨

**使い方**:

```bash
# HTMLファイルから変換（推奨）
uv run --package sios-tech-lab-analytics-ga4-tools html-screenshot \
  --file docs/article/tmp-driven-development/images/architecture.html \
  --output docs/article/tmp-driven-development/images/architecture.png

# HTML文字列から変換
uv run --package sios-tech-lab-analytics-ga4-tools html-screenshot \
  --html '<!DOCTYPE html><html>...</html>' \
  --output diagram.png

# カスタムサイズ指定
uv run --package sios-tech-lab-analytics-ga4-tools html-screenshot \
  --file diagram.html \
  --width 1920 --height 1080 \
  --output custom-size.png
```

**ワークフロー（diagram-generator-htmlとの連携）**:
1. diagram-generator-html が図解用HTMLファイルを作成
2. HTMLファイルを `docs/article/[feature-name]/images/` に保存
3. **本Skillが自動的にPNG変換を実行**
4. Python PlaywrightがHTMLをレンダリング → スクリーンショット

**利点**:
- HTMLファイルを保持するため編集・再利用が可能
- Tailwind CDNなどの外部リソースを正しく読み込む
- diagram-generator-html との連携がスムーズ

**使用例**:
- diagram-generator-html から自動呼び出し
- ユーザー: 「HTMLをPNGに変換して」

---

### 図解ツールの使い分け

| ツール | 形式 | 推奨用途 | 利点 |
|--------|------|---------|------|
| **diagram-generator-svg** | SVG | シンプルな図解、アイコン活用 | ベクター形式、軽量、編集容易 |
| **diagram-generator-html** | HTML → PNG | 複雑なレイアウト、Tailwind活用 | CSS機能、柔軟なレイアウト |
| **svg-to-png** | SVG → PNG | SVGのPNG変換、バッチ処理 | 高品質変換、一括処理 |
| **html-to-png** | HTML → PNG | HTMLのPNG変換 | Playwright、外部リソース対応 |

**ワークフロー例**:

1. **SVGで図解作成 → PNG変換**
   ```
   diagram-generator-svg → SVG生成
   ↓
   svg-to-png → PNG変換
   ```

2. **HTMLで図解作成 → PNG変換（自動）**
   ```
   diagram-generator-html → HTML生成 + PNG変換（自動）
   ↓
   html-to-png（内部呼び出し）
   ```

---

## 2. ブログ記事レビューツール

### 2.1 technical-accuracy-reviewer (Agent)

**目的**: 技術的正確性とセキュリティを専門的に評価

**実装**: `.claude/agents/technical-accuracy-reviewer.md`

**主な責務**:
- ✅ 公式ドキュメントとの照合
- ✅ セキュリティリスク評価（OWASP Top 10基準）
- ✅ バージョン情報の妥当性確認
- ✅ 非推奨機能の検出
- ✅ 数値的主張の根拠確認

**評価項目（100点満点）**:
1. 事実の正確性（30点）★最優先★
2. バージョン情報の明示性（20点）
3. セキュリティ（25点）★重要★
4. 非推奨機能の検出（15点）
5. 検証可能性（10点）

**評価ランク**:
- 🟢 **A (85-100点)**: 技術的に正確で信頼性が高い
- 🟡 **B (70-84点)**: 概ね正確だが改善の余地あり
- 🟠 **C (50-69点)**: 重要な修正が必要
- 🔴 **D (0-49点)**: 公開前に大幅な修正が必須

**Web Research**:
- 公式ドキュメント照合
- バージョン情報の検証
- セキュリティベストプラクティス確認

**セキュリティリスク評価**:
- 🔴 **Critical**: 即座に修正が必要な重大なセキュリティリスク
- 🟡 **Warning**: 注意喚起が必要、または条件付きで安全
- 🟢 **Safe**: セキュリティリスクなし

**出力**:
- 技術的正確性スコア（A/B/C/Dランク）
- 優先度別修正リスト（Critical/High/Medium）
- セキュリティリスク評価
- 公式ソース検証結果

**使用タイミング**:
- 初稿完成直後
- 技術的な内容が多い記事
- セキュリティやバージョン情報を扱う記事

---

### 2.2 content-reviewer (Agent)

**目的**: コンテンツ品質を評価し、反復的な改善を支援

**実装**: `.claude/agents/content-reviewer.md`

**主な責務**:
- ✅ コンテンツの深さ評価
- ✅ 技術的正確性（基本レベル）
- ✅ 実用性の評価
- ✅ 構成と可読性の評価
- ✅ 独自性と差別化の評価

**評価項目（100点満点）**:
1. コンテンツの深さ（20点）
2. 技術的正確性（20点）
3. 実用性（20点）
4. 構成と可読性（20点）
5. 独自性と差別化（20点）

**Web Research**:
- 競合記事分析（3-5件）
- トピックの最新動向調査

**特徴**:
- 高頻度実行を想定（何度でも実行可能）
- SEO評価は含まない（blog-reviewerを推奨）
- 反復的な品質改善に最適

**出力**:
- コンテンツ品質スコア
- 優先度別改善提案（高/中/低）
- 競合との差別化ポイント
- 具体的なアクションリスト

**使用タイミング**:
- 執筆中で何度も改善したい時
- 可読性を向上させたい時
- 構成を改善したい時

---

### 2.3 blog-reviewer (Agent)

**目的**: 公開前の最終確認（コンテンツ + SEO の包括的評価）

**実装**: `.claude/agents/blog-reviewer.md`

**主な責務**:
- ✅ 技術ブログ価値の評価（100点満点）
- ✅ SEO価値の評価（100点満点）
- ✅ タイトル・メタディスクリプション生成（3パターン）
- ✅ 内部リンク戦略の提案
- ✅ 2025年版SEO基準準拠

**評価項目**:

**技術ブログ価値（100点）**:
- コンテンツの深さ（20点）
- 技術的正確性（20点）
- 実用性（20点）
- 構成と可読性（20点）
- 独自性と差別化（20点）

**SEO価値（100点）**:
- タイトル最適化（20点）
- 見出し構造（20点）
- メタ情報（20点）
- 内部リンク戦略（20点）
- 検索意図への適合（20点）

**Web Research（最低3回）**:
1. 競合記事の調査
2. SEOベストプラクティスの調査
3. トピックの最新動向調査

**タイトル・メタディスク生成（3パターン）**:
- **パターンA**: 効果重視・数値訴求型
- **パターンB**: 課題共感・解決提案型
- **パターンC**: 技術トレンド・学習促進型

**2025年版SEO基準**:
- SPARKフレームワーク適合度評価
  - S (Specific): 具体的な数値や成果
  - P (Powerful): パワーワード
  - A (Action-oriented): 行動喚起動詞
  - R (Relevant): 検索意図との一致
  - K (Keyword-focused): キーワードを自然に統合
- 文字数・ピクセル幅最適化
  - タイトル: 全角30文字前後
  - メタディスク: 60-80文字、最初の70文字重視
- AI検索（Google SGE）対応
- CTR向上テクニック

**出力**:
- 2つのスコア（技術ブログ価値 + SEO価値）
- 3パターンのタイトル・メタディスク案
- 優先度別改善提案
- 期待されるCTR向上効果

**使用タイミング**:
- 公開前の最終確認
- コンテンツとSEOの両方を評価したい時
- タイトルも含めて総合的にチェックしたい時

---

### 2.4 seo-title-generator (Agent)

**目的**: SEOタイトルとメタディスクリプションの専門的生成

**実装**: `.claude/agents/seo-title-generator.md`

**主な責務**:
- ✅ 2025年版SEO基準に基づくタイトル生成
- ✅ メタディスクリプション生成
- ✅ SPARKフレームワーク適合度評価
- ✅ CTR向上効果の予測

**生成パターン（3種類）**:
- **パターンA**: 効果重視・数値訴求型
- **パターンB**: 課題共感・解決提案型
- **パターンC**: 技術トレンド・学習促進型

**2025年版SEO基準**:
- タイトル: 全角30文字前後、ピクセル幅最適化
- メタディスク: 60-80文字、最初の70文字重視
- SPARKフレームワーク（S/P/A/R/K）
- AI検索対応（セマンティック検索、ボイスサーチ）

**Web Research**:
- 競合分析（2-4回）
- SEOトレンド調査

**出力**:
- 3パターンのタイトル案（文字数・SPARK評価付き）
- 3パターンのメタディスク案（文字数・SPARK評価付き）
- 想定CTR効果
- 推奨パターン

**使用タイミング**:
- タイトルだけ改善したい時
- メタディスクリプションが欲しい時
- CTRを向上させたい時

---

### レビューツールの使い分け

| 状況 | 使用エージェント | 理由 |
|------|----------------|------|
| 初稿完成直後 | technical-accuracy-reviewer | 技術的正確性とセキュリティを最初に確認 |
| 執筆中で何度も改善 | content-reviewer | 反復的な品質改善に最適 |
| 公開前の最終確認 | blog-reviewer | コンテンツ + SEO の包括的評価 |
| タイトルだけ改善 | seo-title-generator | タイトル・メタディスク生成 |

**推奨フロー**:
1. technical-accuracy-reviewer（技術的正確性）
2. content-reviewer（コンテンツ品質）※何度でもOK
3. blog-reviewer（最終確認 + SEO）
4. seo-title-generator（必要に応じて）

---

## 3. ブログ記事取得ツール

### 3.1 blog-scraper (CLI Tool & Skill)

**目的**: SIOS Tech Lab のブログ記事をスクレイピングし、トークン数を削減したMarkdown形式で保存

**実装**:
- CLI Tool: `application/tools/src/blog_scraper/`
- Skill: `.claude/skills/blog-scraper.md`

**主な機能**:
- ✅ robots.txt 自動確認
- ✅ HTML → Markdown変換
- ✅ トークン数削減（平均87%削減）
- ✅ YAML frontmatter付きで保存
- ✅ 複数URL一括処理対応
- ✅ 既存ファイルのスキップ機能

**出力先**: `docs/data/blog/tech-lab-sios-jp-archives-[記事ID].md`

**使い方**:

```bash
# 単一記事
uv run --package sios-tech-lab-analytics-ga4-tools blog-scraper [URL]

# 複数記事
uv run --package sios-tech-lab-analytics-ga4-tools blog-scraper [URL1] [URL2]

# URLファイルから一括取得
uv run --package sios-tech-lab-analytics-ga4-tools blog-scraper --url-file urls.txt

# 既存ファイルを上書き
uv run --package sios-tech-lab-analytics-ga4-tools blog-scraper --force [URL]
```

**出力例**:

```
🚀 Blog Scraper 起動
📁 出力先: docs/data/blog
📝 処理対象: 1 件のURL

🤖 robots.txt確認中...
✅ robots.txt: 許可

📄 処理中: https://tech-lab.sios.jp/archives/48173
  🔄 HTML取得中...
  📋 メタデータ抽出中...
      タイトル: PCの環境構築を迅速かつ簡単に！dotfilesで設定管理を始めよう
  🔧 コンテンツ抽出中...
  📝 Markdown変換中...
  📊 トークン削減: 26,811 → 3,390 (87.4%削減)
  ✅ 保存完了: 14078 bytes

==================================================
📊 処理結果サマリー
  成功: 1
  スキップ: 0
  エラー: 0
  合計: 1
==================================================
🎉 すべての処理が完了しました
```

**Skill自動発火条件**:
- ユーザーがSIOS Tech LabのURLを提供
- ユーザーが「ブログをスクレイピングして」「記事を取得して」と依頼

**使用例**:
- ユーザー: 「https://tech-lab.sios.jp/archives/48173 を取得して」
- ユーザー: 「このブログ記事をスクレイピングして」

---

### 3.2 cleanup-articles (CLI Tool)

**目的**: 公開済みブログに対応する下書き（`article.md`）を自動削除し、リポジトリをクリーンに保つ

**実装**: `application/tools/src/cleanup_articles/`

**主な機能**:
- ✅ タイトルベースのマッチング（URL不要）
- ✅ `*article*.md`パターンのみ削除（`research-doc.md`は保持）
- ✅ Dry-runモード対応
- ✅ 公開済みブログとの照合

**動作**:
1. `docs/data/blog/` 配下の公開済みブログファイルからタイトルとURLを抽出
2. `docs/article/` 配下の `*article*.md` ファイルをスキャン
3. 各 article ファイルからタイトルを抽出（YAMLフロントマターまたは最初の見出し）
4. タイトルが一致する場合、該当する article ファイルを削除

**使い方**:

```bash
# Dry-run（削除対象を確認）
uv run --package sios-tech-lab-analytics-ga4-tools cleanup-articles --dry-run

# 実際に削除を実行
uv run --package sios-tech-lab-analytics-ga4-tools cleanup-articles
```

**統合ワークフロー例**:

```bash
# ブログ記事をスクレイピング
uv run --package sios-tech-lab-analytics-ga4-tools blog-scraper [URL]

# 公開済み記事の下書きを削除
uv run --package sios-tech-lab-analytics-ga4-tools cleanup-articles
```

**出力例**:

```
🧹 Starting article cleanup...
Article directory: /workspaces/sios-tech-lab-analytics-ga4/docs/article
Blog directory: /workspaces/sios-tech-lab-analytics-ga4/docs/data/blog

Found 24 published blog articles in /workspaces/sios-tech-lab-analytics-ga4/docs/data/blog
✅ Removed: article/uv-workspace/article.md (blog published: https://tech-lab.sios.jp/archives/50142)
✅ Removed: article/html-diagram-generator/article.md (blog published: https://tech-lab.sios.jp/archives/50235)

✅ Removed 2 article.md file(s)
```

---

## まとめ

### ツール一覧

| カテゴリ | ツール名 | 種別 | 主な機能 |
|---------|---------|------|---------|
| **図解生成** | diagram-generator-svg | Skill | SVG図解生成 |
| **図解生成** | diagram-generator-html | Skill | HTML図解生成 + PNG変換 |
| **図解変換** | svg-to-png | Skill | SVG → PNG変換 |
| **図解変換** | html-to-png | Skill | HTML → PNG変換 |
| **レビュー** | technical-accuracy-reviewer | Agent | 技術的正確性・セキュリティ |
| **レビュー** | content-reviewer | Agent | コンテンツ品質（反復改善） |
| **レビュー** | blog-reviewer | Agent | 包括的評価（最終確認） |
| **レビュー** | seo-title-generator | Agent | SEOタイトル・メタディスク |
| **記事取得** | blog-scraper | CLI + Skill | ブログ記事のスクレイピング |
| **記事取得** | cleanup-articles | CLI | 公開済み記事の下書き削除 |

### ワークフロー例

#### 1. 図解作成ワークフロー

**SVGで作成する場合**:
```
1. ユーザー: 「アーキテクチャ図を作って」
   → diagram-generator-svg が発火
   → SVGファイル生成

2. ユーザー: 「SVGをPNGに変換して」
   → svg-to-png が発火
   → PNGファイル生成
```

**HTMLで作成する場合（自動変換）**:
```
1. ユーザー: 「HTMLでアーキテクチャ図を作って」
   → diagram-generator-html が発火
   → HTMLファイル生成
   → html-to-png が自動実行
   → PNGファイル生成
```

#### 2. 記事レビューワークフロー

```
【推奨フロー】
1. technical-accuracy-reviewer（初稿完成時）
   → 技術的正確性とセキュリティを確認
   → Critical/High項目を修正

2. content-reviewer（執筆中、何度でも）
   → コンテンツ品質を向上
   → 改善提案を実装

3. blog-reviewer（公開前）
   → 包括的評価 + SEO
   → タイトル・メタディスク案を選択

4. seo-title-generator（必要に応じて）
   → タイトルのみ再検討
```

---