# ブログ記事紹介HTMLページ実装計画

## プロジェクト概要

### 目的
`doc/` 配下のブログ記事（SIOS Tech Labのアーカイブ）を紹介するHTMLページを作成し、ブログへの誘導を促進する。

### ターゲット
- A4横向き（297mm × 210mm、1123px × 794px @96dpi）
- 1ページ = 1記事
- 印刷または画面表示の両方に対応

---

## 要件定義

### 機能要件

#### 1. ページ構成
- **トップページ（インデックス）**: 全記事の一覧をカード形式で表示
- **個別記事ページ**: 1記事につき1ページ（A4横向き）

#### 2. 表示情報（各記事カード/ページに含める情報）
- 記事タイトル（h1から抽出）
- 記事ID（ファイル名から抽出: `tech-lab-sios-jp-archives-XXXXX.html`）
- 記事カテゴリ（README.mdの分類に基づく）
- 記事概要（目次または最初の段落から抽出、200-300文字程度）
- キーポイント（箇条書き、3-5項目）
- 元記事へのリンクボタン
- QRコード（スマホからのアクセス用）

#### 3. ナビゲーション
- トップページ: カテゴリ別のフィルタリング機能
- 個別ページ: 前後の記事へのナビゲーション
- すべてのページ: トップページへの戻るボタン

### 非機能要件

#### 1. デザイン
- **デザインシステム**: Tailwind CSS（既存index.htmlと統一）
- **配色**: 既存のグラデーション（紫系: #667eea → #764ba2）を継承
- **フォント**: 日本語対応の読みやすいフォント
- **レスポンシブ**: A4横向き固定だが、画面サイズに応じた調整

#### 2. パフォーマンス
- 静的HTML生成（ビルド時に全ページ生成）
- 画像の遅延読み込み
- 最小限のJavaScript

#### 3. アクセシビリティ
- セマンティックHTML
- 適切なコントラスト比
- キーボードナビゲーション対応

---

## 技術スタック

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS**: Tailwind CSS（CDN版を使用、既存との一貫性）
- **JavaScript**: バニラJS（最小限、フィルタリングとナビゲーションのみ）

### データソース
- **ブログ記事**: `doc/*.html`（19記事）
- **メタデータ**: `doc/README.md`（カテゴリ分類、関係性）

### ビルドツール
- **スクリプト**: Node.js / TypeScript（既存scraperと同様）
- **出力先**: `docs/blog_archive_index.html`（トップページ）、`docs/blog_archive/[id].html`（個別ページ）

---

## ディレクトリ構成

```
/home/node/workspace/
├── doc/                              # ソースデータ
│   ├── README.md                     # メタデータ（カテゴリ分類）
│   ├── tech-lab-sios-jp-archives-*.html  # ブログ記事HTML
│   └── TEMP_IMPLEMENTATION_PLAN.md   # 本ドキュメント
├── src/
│   └── blog-page-generator.ts        # ページ生成スクリプト（新規作成）
├── docs/
│   ├── blog_archive_index.html       # トップページ（新規作成）
│   └── blog_archive/                 # 個別記事ページ（新規作成）
│       ├── 48397.html
│       ├── 48406.html
│       └── ...
└── package.json                      # ビルドスクリプト追加
```

---

## データモデル

### BlogArticle型定義

```typescript
interface BlogArticle {
  // 基本情報
  id: string;                    // 例: "48397"
  title: string;                 // 記事タイトル
  url: string;                   // 元記事URL: https://tech-lab.sios.jp/archives/{id}

  // 分類
  category: string;              // "Claude × 技術ブログシリーズ" | "Claude Code開発シリーズ" | ...
  subcategory?: string;          // "基盤記事" | "実践・手法記事" | ...
  tags: string[];                // ["Notion MCP", "音声認識", ...]

  // 内容
  summary: string;               // 記事概要（200-300文字）
  keyPoints: string[];           // キーポイント（3-5項目）
  tableOfContents: string[];     // 目次（オプション）

  // メタデータ
  publishDate?: string;          // 公開日（HTMLから抽出できれば）
  readingTime?: number;          // 推定読了時間（分）

  // ナビゲーション
  prevArticleId?: string;        // 前の記事ID
  nextArticleId?: string;        // 次の記事ID
}
```

### CategoryMetadata型定義

```typescript
interface CategoryMetadata {
  name: string;                  // カテゴリ名
  description: string;           // カテゴリ説明
  icon: string;                  // 絵文字アイコン
  articles: string[];            // 記事IDリスト
}
```

---

## 実装フェーズ

### フェーズ1: データ抽出・パース（優先度: 高）
**目的**: HTMLファイルとREADME.mdからメタデータを抽出

#### タスク
1. **README.mdパーサー作成**
   - カテゴリ構造の解析
   - 記事IDとカテゴリのマッピング作成
   - 記事間の関係性（前後リンク）の解析

2. **HTMLパーサー作成**
   - タイトル抽出（h1タグ）
   - 目次抽出（data-smooth-scroll配下）
   - 概要抽出（最初の段落、またはメタ要素）
   - キーポイント抽出（見出し構造から）

3. **データ検証**
   - 全19記事のメタデータが正しく抽出されるかテスト
   - 欠損データのハンドリング

#### 成果物
- `src/blog-page-generator.ts`: データ抽出ロジック
- `blog-articles.json`: 抽出されたメタデータ（中間ファイル、オプション）

---

### フェーズ2: HTMLテンプレート設計（優先度: 高）

#### 2.1 トップページテンプレート

**レイアウト**:
```
┌─────────────────────────────────────────────┐
│ Header: タイトル、説明、フィルタボタン       │
├─────────────────────────────────────────────┤
│ カードグリッド（2列 × n行）                │
│ ┌──────────┐  ┌──────────┐                │
│ │ カード1   │  │ カード2   │                │
│ │ [カテゴリ]│  │ [カテゴリ]│                │
│ │ タイトル  │  │ タイトル  │                │
│ │ 概要...   │  │ 概要...   │                │
│ │ [詳細]    │  │ [詳細]    │                │
│ └──────────┘  └──────────┘                │
│ ┌──────────┐  ┌──────────┐                │
│ │ カード3   │  │ カード4   │                │
│ └──────────┘  └──────────┘                │
└─────────────────────────────────────────────┘
```

**カード要素**:
- カテゴリバッジ（色分け）
- タイトル（太字、1-2行）
- 概要（100文字程度）
- タグ（最大5個）
- 「詳細を見る」ボタン

#### 2.2 個別記事ページテンプレート（A4横向き）

**レイアウト**:
```
┌────────────────────────────────────────────────────────┐
│ Header: タイトル、カテゴリバッジ                        │
├────────────────────────────┬───────────────────────────┤
│ 左カラム（60%）            │ 右カラム（40%）            │
│                            │                            │
│ 記事概要（大きめのフォント）│ キーポイント               │
│ 300文字程度                │ • ポイント1                │
│                            │ • ポイント2                │
│ 目次                       │ • ポイント3                │
│ 1. セクション1             │ • ポイント4                │
│ 2. セクション2             │ • ポイント5                │
│ 3. セクション3             │                            │
│                            │ 元記事へのリンク            │
│                            │ ┌──────────┐             │
│                            │ │ QRコード  │             │
│                            │ └──────────┘             │
│                            │ [記事を読む]ボタン         │
├────────────────────────────┴───────────────────────────┤
│ Footer: ナビゲーション（前へ | 一覧へ | 次へ）          │
└────────────────────────────────────────────────────────┘
```

**A4横向きCSS設定**:
```css
@media print, screen {
  .a4-landscape {
    width: 297mm;
    height: 210mm;
    padding: 20mm;
    margin: 0 auto;
  }
}

@page {
  size: A4 landscape;
  margin: 0;
}
```

---

### フェーズ3: ページ生成スクリプト（優先度: 高）

#### タスク
1. **テンプレートエンジン選定**
   - オプション1: テンプレートリテラル（シンプル、依存なし）
   - オプション2: Handlebars（柔軟性高い、依存追加）
   - **推奨**: テンプレートリテラル（既存プロジェクトとの一貫性）

2. **生成ロジック実装**
   - トップページHTML生成
   - 個別ページHTML生成（19ページ）
   - QRコード生成（APIまたはライブラリ）

3. **ビルドスクリプト統合**
   - `package.json`に追加: `npm run build:blog-archive`
   - 既存ビルドスクリプトとの統合: `npm run build`

#### 成果物
- `src/blog-page-generator.ts`: 完全なページ生成ロジック
- `docs/blog_archive_index.html`: トップページ
- `docs/blog_archive/*.html`: 個別記事ページ（19ファイル）

---

### フェーズ4: スタイリング・インタラクション（優先度: 中）

#### タスク
1. **Tailwind CSSスタイリング**
   - 既存デザインシステムの継承
   - カテゴリ別の配色定義
   - ホバー/フォーカス効果

2. **JavaScriptインタラクション**
   - カテゴリフィルタリング（トップページ）
   - 検索機能（オプション）
   - スムーススクロール

3. **印刷スタイル最適化**
   - `@media print`の調整
   - ページ区切り制御
   - 不要要素の非表示

---

### フェーズ5: テスト・最適化（優先度: 中）

#### テスト項目
1. **機能テスト**
   - 全19記事のページが正しく生成される
   - リンクが正しく動作する
   - QRコードが正しいURLを指す

2. **表示テスト**
   - A4横向きでの表示確認
   - 各ブラウザでの表示確認（Chrome, Firefox, Safari）
   - 印刷プレビュー確認

3. **アクセシビリティテスト**
   - スクリーンリーダー対応
   - キーボード操作
   - コントラスト比チェック

4. **パフォーマンステスト**
   - ページ読み込み時間
   - ビルド時間

---

## デザインガイドライン

### 配色

#### カテゴリ別カラーパレット
```typescript
const categoryColors = {
  "Claude × 技術ブログシリーズ": {
    primary: "#667eea",      // 紫
    secondary: "#764ba2",
    accent: "#a78bfa",
  },
  "Claude Code開発シリーズ": {
    primary: "#3b82f6",      // 青
    secondary: "#1e40af",
    accent: "#60a5fa",
  },
  "Claude制御・プロンプト技術": {
    primary: "#10b981",      // 緑
    secondary: "#047857",
    accent: "#34d399",
  },
};
```

### タイポグラフィ
- **見出し（H1）**: 28px, bold, line-height 1.2
- **見出し（H2）**: 20px, bold, line-height 1.3
- **本文**: 16px, normal, line-height 1.6
- **キャプション**: 14px, normal, line-height 1.5

### スペーシング
- **カード間**: 24px
- **セクション間**: 48px
- **要素間**: 16px

---

## データ抽出ロジック詳細

### HTMLパース優先順位

#### 1. タイトル抽出
```typescript
// 優先順位1: h1タグ
const h1 = doc.querySelector('h1');
const title = h1?.textContent?.trim() || '';

// クリーンアップ: 末尾の " | SIOS Tech. Lab" を除去
const cleanTitle = title.replace(/\s*\|\s*SIOS Tech\.?\s*Lab\.?$/i, '');
```

#### 2. 目次抽出
```typescript
// data-smooth-scroll="1" の配下
const tocContainer = doc.querySelector('[data-smooth-scroll="1"]');
const tocLinks = tocContainer?.querySelectorAll('a');
const tableOfContents = Array.from(tocLinks || [])
  .map(link => link.textContent?.trim())
  .filter(Boolean);
```

#### 3. 概要抽出
```typescript
// 戦略1: 「はじめに」セクションの最初の段落
const introSection = doc.querySelector('#hajimeni')?.nextElementSibling;
const summary = introSection?.textContent?.trim().slice(0, 300) || '';

// 戦略2: 最初のpタグ（戦略1が失敗した場合）
// 戦略3: メタディスクリプション（両方失敗した場合）
```

#### 4. キーポイント抽出
```typescript
// 戦略1: 目次の主要項目（レベル2見出し）
const keyPoints = tableOfContents
  .filter(item => !item.match(/^(\d+\.){2}/)) // サブ項目を除外
  .slice(1, 6); // 「はじめに」を除く最大5項目

// 戦略2: 箇条書きリストから抽出（戦略1が不十分な場合）
```

---

## README.mdパースロジック

### カテゴリマッピング生成

```typescript
interface ArticleCategoryMapping {
  [articleId: string]: {
    category: string;
    subcategory?: string;
    description: string;
  };
}

// パースロジック
function parseReadme(content: string): ArticleCategoryMapping {
  const mapping: ArticleCategoryMapping = {};

  // 正規表現でマークダウンをパース
  // - **48397**: タイトル
  const articleRegex = /^-\s+\*\*(\d+)\*\*:\s+(.+)$/gm;

  let currentCategory = '';
  let currentSubcategory = '';

  // 見出しレベルでカテゴリを追跡
  // ### 1. Claude × 技術ブログシリーズ
  // #### 🔹 基盤記事

  // 実装詳細...

  return mapping;
}
```

---

## QRコード生成

### オプション1: 外部API（推奨）
```typescript
const qrCodeUrl = (articleId: string) => {
  const targetUrl = `https://tech-lab.sios.jp/archives/${articleId}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}`;
};
```

### オプション2: ローカル生成（qrcode npm パッケージ）
```bash
npm install qrcode @types/qrcode
```

```typescript
import QRCode from 'qrcode';

async function generateQRCode(articleId: string): Promise<string> {
  const targetUrl = `https://tech-lab.sios.jp/archives/${articleId}`;
  return await QRCode.toDataURL(targetUrl);
}
```

**推奨**: オプション1（外部API）
- 依存追加不要
- ビルド時間短縮
- 既存index.htmlと同じ方式

---

## npm スクリプト

### package.json への追加

```json
{
  "scripts": {
    "build:blog-archive": "tsx src/blog-page-generator.ts",
    "build": "npm run build:claude && npm run build:notion && npm run build:blog-archive"
  }
}
```

---

## 成果物チェックリスト

### フェーズ1
- [ ] README.mdパーサー実装
- [ ] HTMLパーサー実装
- [ ] データモデル定義
- [ ] 19記事すべてのメタデータ抽出確認

### フェーズ2
- [ ] トップページHTMLテンプレート作成
- [ ] 個別ページHTMLテンプレート作成
- [ ] A4横向きCSSスタイル定義

### フェーズ3
- [ ] ページ生成スクリプト実装
- [ ] QRコード生成実装
- [ ] ビルドスクリプト統合
- [ ] 全ページ生成確認

### フェーズ4
- [ ] Tailwind CSSスタイリング
- [ ] カテゴリフィルタリング実装
- [ ] ナビゲーション実装
- [ ] 印刷スタイル最適化

### フェーズ5
- [ ] 機能テスト完了
- [ ] 表示テスト完了（全ブラウザ）
- [ ] アクセシビリティテスト完了
- [ ] パフォーマンステスト完了

---

## リスク管理

### 技術的リスク

#### リスク1: HTMLパースの複雑性
- **内容**: ブログ記事のHTML構造が不統一で、パースが困難
- **影響度**: 中
- **対策**:
  - フォールバック戦略を複数用意
  - 手動で調整が必要な記事をリストアップ
  - README.mdから補完できる情報を最大限活用

#### リスク2: A4横向きレイアウトの制約
- **内容**: 記事によって情報量が異なり、1ページに収まらない
- **影響度**: 低
- **対策**:
  - フォントサイズ・行間の動的調整
  - 概要を300文字に制限
  - キーポイントを5項目に制限

#### リスク3: ビルド時間の増加
- **内容**: 19ページ生成により、ビルド時間が増加
- **影響度**: 低
- **対策**:
  - 差分ビルド（変更された記事のみ再生成）
  - 並列処理の検討

### スケジュールリスク
- **想定工数**: 2-3日（フルタイム換算）
- **優先度**: フェーズ1 > フェーズ2 > フェーズ3 > フェーズ4 > フェーズ5

---

## 今後の拡張性

### 将来的な機能追加候補

1. **検索機能**
   - 全文検索（クライアントサイド）
   - タグベース検索

2. **ソート機能**
   - 日付順
   - カテゴリ順
   - 関連性順

3. **統計情報**
   - 記事数カウント
   - カテゴリ別分布
   - タグクラウド

4. **自動更新**
   - 新しい記事のスクレイピング検知
   - 自動ページ再生成
   - GitHub Actions統合

5. **多言語対応**
   - 英語版ページ生成
   - i18n対応

---

## 参考資料

### 既存資産
- `/home/node/workspace/docs/index.html`: デザイン参考
- `/home/node/workspace/doc/README.md`: メタデータソース
- `/home/node/workspace/src/scraper.ts`: パース参考実装
- `/home/node/workspace/theme/*.css`: カスタムテーマ

### 外部リソース
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [QR Code Generator API](https://goqr.me/api/)
- [A4サイズCSS設定](https://developer.mozilla.org/en-US/docs/Web/CSS/@page)

---

## 承認・レビュー

### 実装前の確認事項

#### ユーザー確認が必要な項目
1. **デザイン方向性**: 既存index.htmlのスタイルを継承してよいか？
2. **情報の優先順位**: タイトル、概要、キーポイント以外に必要な情報は？
3. **A4横向きの固定性**: 画面サイズに応じた可変レイアウトは不要か？
4. **ナビゲーション**: 記事の並び順（カテゴリ順？ID順？）の優先順位は？
5. **QRコード**: 外部API利用でよいか？（プライバシー・依存性の観点）

#### 技術的判断事項
1. **テンプレートエンジン**: テンプレートリテラル vs Handlebars
2. **データ永続化**: 中間JSONファイル生成の要否
3. **ビルドトリガー**: 手動 vs 自動（GitHub Actions）

---

## 変更履歴

- **2025-10-22**: 初版作成
  - プロジェクト概要、要件定義、技術スタック、フェーズ定義
  - データモデル、実装詳細、成果物チェックリスト作成

---

## 次のアクション

### ユーザーへの質問
上記「承認・レビュー」セクションの確認事項について、ご意見をいただきたいです。特に以下の点について：

1. デザイン方向性と必要な情報
2. A4横向きの固定性と可変性のバランス
3. 記事の並び順の優先順位

### 実装開始の準備
確認事項にご回答いただけましたら、フェーズ1（データ抽出・パース）から実装を開始します。
