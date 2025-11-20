# 実装計画書：HTML→Markdown変換機能（scraper.ts統合）

## プロジェクト概要

### 目的
既存のブログスクレイパー（`application/tools/scraper.ts`）にHTML→Markdown変換機能を統合し、記事保存形式をMarkdownに移行する。

### スコープ
**実装範囲**:
- ✅ Turndownライブラリの導入
- ✅ Markdown変換処理の実装
- ✅ YAML frontmatterの生成
- ✅ トークン計測の拡張（3段階）
- ✅ ファイル保存形式の変更（`.html` → `.md`）
- ✅ 既存機能の動作確認

**実装範囲外**:
- ❌ 既存の`.html`ファイルの一括変換（手動対応）
- ❌ 他サイトへの対応（SIOS Tech Lab専用）
- ❌ UIの実装（CLIツールのみ）

### 期待される成果
- トークン削減率: さらに約20%（抽出HTML → Markdown）
- 総合削減率: 約65%（生HTML → Markdown）
- 可読性向上: 60点 → 90点（主観）
- 既存機能の保持: 100%

---

## 開発アプローチ

このプロジェクトでは**段階的開発アプローチ**を採用します。

### Phase 1: 準備・調査（完了済み）
- ✅ ライブラリ調査（Turndown、node-html-markdown、rehype-remark）
- ✅ 既存コードの分析（scraper.ts）
- ✅ 仕様書の作成
- ✅ 実装計画の策定

### Phase 2: 基本実装（本フェーズ）
1. 依存関係の追加
2. Markdown変換関数の実装
3. メイン処理への統合
4. 基本動作確認

### Phase 3: カスタマイズ
1. 長いalt属性の簡略化
2. div/spanタグの除去
3. Markdown設定の最適化

### Phase 4: 検証・完成
1. 既存記事での動作確認
2. トークン削減率の測定
3. ドキュメント更新

---

## 技術仕様サマリー

### 使用技術
- **言語**: TypeScript 5.x
- **ランタイム**: Node.js
- **HTML→Markdown変換**: Turndown v7.x
- **HTMLパース**: Cheerio（既存）
- **HTTPリクエスト**: node-fetch（既存）

### 新規依存関係
```json
{
  "dependencies": {
    "turndown": "^7.2.0"
  },
  "devDependencies": {
    "@types/turndown": "^5.0.5"
  }
}
```

### ファイル構成
```
application/tools/
├── scraper.ts              # メインファイル（変更）
├── package.json            # 依存関係追加
├── package-lock.json       # 自動更新
└── tsconfig.json           # 変更なし
```

---

## 作成・変更するファイルの詳細

### 1. package.json（変更）

**変更箇所**: `dependencies`と`devDependencies`に追加

```json
{
  "dependencies": {
    "cheerio": "^1.1.2",
    "node-fetch": "^2.7.0",
    "turndown": "^7.2.0"
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "@types/cheerio": "^0.22.35",
    "@types/node-fetch": "^2.6.13",
    "@types/turndown": "^5.0.5",
    "tsx": "^4.20.3",
    "typescript": "^5.8.3"
  }
}
```

---

### 2. scraper.ts（大幅変更）

#### 2.1 import文の追加

```typescript
// 既存のimport
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

// 新規追加
import TurndownService from 'turndown';
```

#### 2.2 型定義の追加

```typescript
// 既存の型定義
type CheerioAPI = ReturnType<typeof cheerio.load>;

// 新規追加
interface OgpInfo {
    title: string;
    image: string;
    url: string;
}

interface ExtractionResult {
    html: string;
    ogpInfo: OgpInfo;
    originalTokens: number;
    extractedTokens: number;
    compressedTokens: number;
}
```

#### 2.3 YAML frontmatter生成関数（新規）

```typescript
/**
 * YAML frontmatterを生成する関数
 * @param ogpInfo OGP情報
 * @param extractedAt 抽出日時
 * @returns YAML frontmatter文字列
 */
function createYamlFrontmatter(ogpInfo: OgpInfo, extractedAt: Date): string {
    const yaml = `---
title: "${ogpInfo.title.replace(/"/g, '\\"')}"
url: ${ogpInfo.url}
image: ${ogpInfo.image}
extracted_at: ${extractedAt.toISOString()}
---

`;
    return yaml;
}
```

**実装ポイント**:
- タイトル内のダブルクォートをエスケープ
- ISO 8601形式の日時

#### 2.4 Markdown変換関数（新規）

```typescript
/**
 * HTMLをMarkdownに変換する関数
 * @param html HTML文字列
 * @param ogpInfo OGP情報
 * @returns Markdown文字列（YAML frontmatter付き）
 */
function convertHtmlToMarkdown(html: string, ogpInfo: OgpInfo): string {
    // Turndownサービスの初期化
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        strongDelimiter: '**',
        linkStyle: 'inlined'
    });

    // カスタムルール1: 長いalt属性の簡略化
    turndownService.addRule('simplifyImageAlt', {
        filter: 'img',
        replacement: (content, node) => {
            const element = node as HTMLImageElement;
            const src = element.getAttribute('src') || '';
            const alt = element.getAttribute('alt') || '';

            // alt属性が100文字以上の場合は簡略化
            if (alt.length > 100) {
                return `![image](${src})`;
            }

            return alt ? `![${alt}](${src})` : `![](${src})`;
        }
    });

    // カスタムルール2: div/spanタグはテキストのみ抽出
    turndownService.addRule('removeDivSpan', {
        filter: ['div', 'span'],
        replacement: (content) => content
    });

    // HTMLコメントを除去してからMarkdown変換
    const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');

    // Markdown変換
    const markdown = turndownService.turndown(cleanHtml);

    // YAML frontmatterを追加
    const frontmatter = createYamlFrontmatter(ogpInfo, new Date());

    return frontmatter + markdown;
}
```

**実装ポイント**:
- Turndownの基本設定（atxスタイル、fencedコードブロックなど）
- カスタムルール1: 長いalt属性の簡略化（Mermaid図対応）
- カスタムルール2: div/spanタグの除去
- HTMLコメントの除去（メタデータはYAML frontmatterに移行）

#### 2.5 extractAndCompressContent関数の変更

**現在の実装**:
- 戻り値: `string`（圧縮HTML）
- ログ出力: 2段階（抽出、圧縮）

**変更後の実装**:
- 戻り値: `ExtractionResult`（HTML + メタデータ）
- ログ出力: 2段階（変更なし、Markdown変換のログは別関数で出力）

```typescript
/**
 * コンテンツを抽出して圧縮する関数
 * @param $ Cheerio instance
 * @param targetSelector 抽出対象のCSSセレクタ
 * @param sourceUrl ソースURL
 * @returns 抽出結果オブジェクト
 */
function extractAndCompressContent(
    $: CheerioAPI,
    targetSelector: string = 'section.entry-content',
    sourceUrl: string = ''
): ExtractionResult {
    try {
        const title = $('title').text().trim();
        const ogpInfo = extractOgpInfo($);

        const targetElements = $(targetSelector);

        if (targetElements.length === 0) {
            console.error(`指定されたセレクタ '${targetSelector}' に該当する要素が見つかりませんでした`);
            throw new Error('Content extraction failed');
        }

        const targetElement = targetElements.first();

        const originalFullTokens = estimateClaudeTokens($.html());
        const extractedTokens = estimateClaudeTokens(targetElement.html() || '');

        // 既存の処理（script/style削除、属性削除など）
        targetElement.find('script, style, noscript').remove();

        // 画像処理は既存のまま（Markdown変換時に再処理）
        targetElement.find('img').each((_, elem) => {
            const $img = $(elem);
            // alt/src属性は保持（Markdown変換時に使用）
            $img.removeAttr('class');
            $img.removeAttr('id');
            $img.removeAttr('style');
        });

        // その他の属性削除（既存のまま）
        targetElement.find('*').each((_, elem) => {
            const $elem = $(elem);
            const tagName = $elem.prop('tagName')?.toLowerCase();
            if (tagName === 'a') {
                const href = $elem.attr('href');
                $elem.removeAttr('class');
                $elem.removeAttr('id');
                $elem.removeAttr('style');
                if (href) {
                    $elem.attr('href', href);
                }
            } else {
                $elem.removeAttr('class');
                $elem.removeAttr('id');
                $elem.removeAttr('style');
            }
        });

        let compressedContent = targetElement.html() || '';
        compressedContent = compressedContent.replace(/>\\s+</g, '><');

        const finalCompressedTokens = estimateClaudeTokens(compressedContent);

        // ログ出力（既存のまま）
        console.log(`元ページ全体のトークン数: ${originalFullTokens.toLocaleString()}`);
        console.log(`抽出後のトークン数: ${extractedTokens.toLocaleString()}`);
        console.log(`最終圧縮後のトークン数: ${finalCompressedTokens.toLocaleString()}`);
        console.log(`抽出による削減: ${(originalFullTokens - extractedTokens).toLocaleString()}`);
        console.log(`圧縮による削減: ${(extractedTokens - finalCompressedTokens).toLocaleString()}`);
        console.log(`総削減トークン数: ${(originalFullTokens - finalCompressedTokens).toLocaleString()}`);

        const extractionRatio = originalFullTokens > 0
            ? ((originalFullTokens - extractedTokens) / originalFullTokens * 100)
            : 0;

        const compressionOnlyRatio = extractedTokens > 0
            ? ((extractedTokens - finalCompressedTokens) / extractedTokens * 100)
            : 0;

        const totalCompressionRatio = originalFullTokens > 0
            ? ((originalFullTokens - finalCompressedTokens) / originalFullTokens * 100)
            : 0;

        console.log(`抽出による削減率: ${extractionRatio.toFixed(2)}%`);
        console.log(`圧縮による削減率: ${compressionOnlyRatio.toFixed(2)}%`);
        console.log(`総合圧縮率: ${totalCompressionRatio.toFixed(2)}%`);

        // ページタイトルを含むHTML（Markdown変換用）
        const htmlWithTitle = `<h1>${title}</h1>\\n\\n${compressedContent}`;

        return {
            html: htmlWithTitle,
            ogpInfo: {
                title: ogpInfo.title || title,
                url: sourceUrl || ogpInfo.url,
                image: ogpInfo.image
            },
            originalTokens: originalFullTokens,
            extractedTokens: extractedTokens,
            compressedTokens: finalCompressedTokens
        };
    } catch (error) {
        console.error(`処理中にエラーが発生しました: ${error}`);
        throw error;
    }
}
```

**変更ポイント**:
- 戻り値の型を`string`から`ExtractionResult`に変更
- HTMLコメント（メタデータ）を削除（YAML frontmatterに移行）
- OGP情報とトークン数を返すようにする

#### 2.6 main関数の変更

**主な変更点**:
- ファイル拡張子: `.html` → `.md`
- Markdown変換処理の追加
- トークン計測の拡張（3段階）

```typescript
/**
 * メイン関数
 */
async function main() {
    const url = process.env.URL || '';
    let targetUrl = url;

    if (!targetUrl) {
        targetUrl = 'https://tech-lab.sios.jp/archives/48173';
        console.log(`⚠️  URL未指定のため、デフォルトURLを使用: ${targetUrl}`);
    }

    if (!targetUrl.startsWith('https://tech-lab.sios.jp/archives')) {
        throw new Error("URLは 'https://tech-lab.sios.jp/archives' で始まる必要があります");
    }

    const cacheDir = path.join(__dirname, '../../docs/data');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log(`${cacheDir}ディレクトリを作成しました。`);
    }

    const domainPath = targetUrl
        .replace('https://', '')
        .replace('http://', '')
        .replace(/\\//g, '-')
        .replace(/\\./g, '-');

    // 拡張子を .md に変更
    const mdFilePath = path.join(cacheDir, `${domainPath}.md`);

    console.log(`📁 Markdownファイル保存先: ${mdFilePath}`);

    // キャッシュチェック（.md ファイル）
    if (fs.existsSync(mdFilePath)) {
        const stats = fs.statSync(mdFilePath);
        console.log(`✅ ${mdFilePath} が既に存在するため、後続の処理をスキップします。`);
        console.log(`📊 ファイルサイズ: ${stats.size} bytes`);
        return;
    }

    console.log('🔄 HTML取得・パース開始...');
    const $ = await fetchAndParseHtml(targetUrl);

    if (!$) {
        throw new Error('HTMLの取得に失敗しました');
    }

    const title = $('title').text().trim();
    if (title) {
        console.log(`📄 ページタイトル: ${title}`);
    }

    console.log('🔧 コンテンツ抽出・圧縮開始...');
    const extractionResult = extractAndCompressContent($, 'section.entry-content', targetUrl);

    if (!extractionResult.html) {
        throw new Error('コンテンツの抽出に失敗しました');
    }

    // Markdown変換
    console.log('📝 Markdown変換開始...');
    const markdown = convertHtmlToMarkdown(extractionResult.html, extractionResult.ogpInfo);

    // トークン計測（3段階目）
    const markdownTokens = estimateClaudeTokens(markdown);

    console.log(`Markdown変換後のトークン数: ${markdownTokens.toLocaleString()}`);
    console.log(`Markdown変換による削減: ${(extractionResult.compressedTokens - markdownTokens).toLocaleString()}`);

    const markdownReductionRatio = extractionResult.compressedTokens > 0
        ? ((extractionResult.compressedTokens - markdownTokens) / extractionResult.compressedTokens * 100)
        : 0;

    const totalReductionRatio = extractionResult.originalTokens > 0
        ? ((extractionResult.originalTokens - markdownTokens) / extractionResult.originalTokens * 100)
        : 0;

    console.log(`Markdown変換による削減率: ${markdownReductionRatio.toFixed(2)}%`);
    console.log(`総合削減率（生HTML→Markdown）: ${totalReductionRatio.toFixed(2)}%`);

    // Markdownファイル保存
    console.log(`💾 Markdownファイル保存中: ${mdFilePath}`);
    try {
        fs.writeFileSync(mdFilePath, markdown, 'utf-8');

        if (fs.existsSync(mdFilePath)) {
            const fileSize = fs.statSync(mdFilePath).size;
            console.log(`✅ Markdownファイルを保存しました: ${mdFilePath}`);
            console.log(`📊 ファイルサイズ: ${fileSize} bytes`);
        } else {
            throw new Error('Markdownファイルの保存に失敗しました');
        }
    } catch (error) {
        console.error(`❌ Markdownファイル保存エラー: ${error}`);
        throw error;
    }
}
```

**変更ポイント**:
- ファイルパス: `.html` → `.md`
- Markdown変換処理の追加
- トークン計測の拡張（3段階）
- ログメッセージの更新

---

## 検証計画

### 検証項目

#### 1. 基本動作確認
**目的**: Markdown変換が正しく動作するか確認

**テスト手順**:
1. 環境変数にURLを設定
   ```bash
   URL=https://tech-lab.sios.jp/archives/50245 npm run scraper --workspace=application/tools
   ```
2. `.md`ファイルが生成されることを確認
3. ファイル内容を確認（YAML frontmatter、Markdown本文）

**期待結果**:
- ✅ `.md`ファイルが生成される
- ✅ YAML frontmatterが正しく設定されている
- ✅ Markdown本文が正しく変換されている

#### 2. トークン削減率の測定
**目的**: 記事50175と同様の削減率が達成できるか確認

**テスト対象**:
- 記事50103（既存HTMLファイルを削除して再実行）
- 記事50109（既存HTMLファイルを削除して再実行）
- 記事50142（既存HTMLファイルを削除して再実行）

**測定項目**:
- 生HTML → 抽出HTML の削減率
- 抽出HTML → Markdown の削減率
- 生HTML → Markdown の総合削減率

**期待結果**:
- ✅ 抽出HTML → Markdown: 平均20%以上削減
- ✅ 生HTML → Markdown: 平均65%以上削減

#### 3. 可読性の確認
**目的**: Markdown形式が人間にとって読みやすいか確認

**テスト手順**:
1. 生成された`.md`ファイルをVS Codeで開く
2. プレビュー機能で表示
3. 見出し、リスト、リンク、画像が正しく表示されるか確認

**期待結果**:
- ✅ 見出しの階層が正しい
- ✅ リストが正しく表示される
- ✅ リンクがクリック可能
- ✅ 画像が表示される（またはalt属性が簡略化されている）

#### 4. 既存機能の動作確認
**目的**: 既存機能に影響がないか確認

**テスト項目**:
- URL検証（不正なURLでエラーが出るか）
- キャッシュ機能（既存ファイルをスキップするか）
- エラーハンドリング（ネットワークエラー時の挙動）

**期待結果**:
- ✅ すべての既存機能が正常に動作

#### 5. カスタムルールの動作確認
**目的**: 長いalt属性の簡略化が正しく動作するか確認

**テスト手順**:
1. Mermaid図を含む記事で実行
2. 生成された`.md`ファイルで画像のalt属性を確認

**期待結果**:
- ✅ 100文字以上のalt属性が`![image](src)`に簡略化されている
- ✅ 100文字未満のalt属性は`![alt](src)`として保持されている

---

## リスクと対策

### リスク1: Markdown変換の品質
**リスク内容**: HTMLの複雑な構造がMarkdownに正しく変換されない

**対策**:
- Turndownのカスタムルールで対応
- 変換結果を人間が目視確認
- 問題がある場合は追加のカスタムルールを実装

**影響度**: 中
**対策優先度**: 高

### リスク2: パフォーマンスの劣化
**リスク内容**: Markdown変換処理により実行時間が増加

**対策**:
- 処理時間を計測（console.timeで測定）
- 3秒以内に収まることを確認
- 必要に応じて最適化

**影響度**: 低
**対策優先度**: 中

### リスク3: 既存HTMLファイルとの共存
**リスク内容**: 既存の`.html`ファイルとの共存で混乱が生じる

**対策**:
- 既存の`.html`ファイルは手動削除を推奨（ドキュメント記載）
- `.md`ファイルを優先的に読み込むロジック（将来の拡張）

**影響度**: 低
**対策優先度**: 低

### リスク4: 依存関係の追加
**リスク内容**: Turndownライブラリの追加により依存関係が増加

**対策**:
- Turndownは広く使われており、メンテナンスも活発
- 依存関係の脆弱性チェック（npm auditで確認）

**影響度**: 低
**対策優先度**: 低

---

## 成功基準

### 定量的基準
| 項目 | 目標値 | 測定方法 |
|------|--------|----------|
| トークン削減率（抽出HTML→Markdown） | 20%以上 | 3記事の平均 |
| 総合削減率（生HTML→Markdown） | 65%以上 | 3記事の平均 |
| 処理時間 | 3秒以内 | console.timeで計測 |
| テスト合格率 | 100% | 検証項目1-5 |

### 定性的基準
- ✅ Markdown形式が正しく、人間が読みやすい
- ✅ 構造情報（見出し、リスト）が保持されている
- ✅ Claude Codeによる記事理解が向上している
- ✅ 既存機能に影響がない

---

## タイムライン

### Phase 2: 基本実装（2時間）
1. 依存関係の追加（10分）
   - `npm install turndown @types/turndown`
2. 関数の実装（60分）
   - `createYamlFrontmatter`関数
   - `convertHtmlToMarkdown`関数
   - `extractAndCompressContent`関数の変更
3. メイン処理の変更（30分）
   - `main`関数の変更
4. 基本動作確認（20分）
   - 1記事での動作確認

### Phase 3: カスタマイズ（1時間）
1. カスタムルールの実装（40分）
   - 長いalt属性の簡略化
   - div/spanタグの除去
2. 動作確認（20分）
   - Mermaid図を含む記事での確認

### Phase 4: 検証・完成（2時間）
1. 既存記事での動作確認（60分）
   - 3記事での検証
2. トークン削減率の測定（30分）
   - データ収集と分析
3. ドキュメント更新（30分）
   - README.md更新
   - research文書の更新

**合計見積もり**: 5時間

---

## 実装後のアクション

### 1. ドキュメント更新
- `README.md`: 使用方法の変更（`.html` → `.md`）
- `docs/research/html-to-markdown-libraries-review.md`: 実装結果の追記

### 2. 既存HTMLファイルの処理
**推奨アクション**:
- 既存の`.html`ファイルを削除
- 必要な記事を`.md`形式で再取得

**手順**:
```bash
# 既存HTMLファイルの削除
rm docs/data/*.html

# 必要な記事の再取得
URL=https://tech-lab.sios.jp/archives/50245 npm run scraper --workspace=application/tools
URL=https://tech-lab.sios.jp/archives/50235 npm run scraper --workspace=application/tools
# ...
```

### 3. Claude Code Skillへの統合（将来の拡張）
現在のスクレイパーをClaude Code Skillとして登録する方法を検討（記事50154参照）

---

## 参考資料

### プロジェクト内ドキュメント
- 仕様書: `docs/features/tool-html-to-markdown-converter/spec.md`
- 調査結果: `docs/research/html-to-markdown-libraries-review.md`
- 既存実装: `application/tools/scraper.ts`

### 関連記事
- 記事50175: Python実装の参考例
- 記事50154: Claude Code Skills 実装ガイド

### 技術ドキュメント
- Turndown GitHub: https://github.com/mixmark-io/turndown
- Turndown Documentation: https://github.com/mixmark-io/turndown#usage

---

## 更新履歴
- 2025-11-19: 初版作成（基本実装計画）
