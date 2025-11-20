# HTML→Markdown変換ライブラリ調査レビュー

## 実施日
2025-11-19

## 概要
ブログスクレイパーの改善（HTML保存→Markdown保存への移行）に向けて、TypeScript/JavaScriptで利用可能なHTML→Markdown変換ライブラリを調査しました。記事50175（「HTMLでブログ記事を保存してる奴、全員Markdownにしろ。AIが読みにくいでしょうが！」）で指摘された問題を解決するための技術選定です。

## 背景・課題

### 現在の実装の問題点
- **トークン消費が多い**: HTMLタグ（`<div>`, `<p>`, `<section>`など）がトークンを消費
- **可読性が低い**: HTMLタグが邪魔で、AIも人間も読みにくい
- **改善の余地あり**: 現在の圧縮率73%からさらに削減可能

### 目標
- HTML→Markdown変換により、さらに20%程度のトークン削減を実現
- 構造情報（見出し、リスト、コードブロック）を保持
- 可読性を大幅に向上
- TypeScriptプロジェクトとの統合が容易

## 調査対象ライブラリ

### 1. Turndown ⭐ 推奨候補
**GitHub**: https://github.com/mixmark-io/turndown
**npm**: https://www.npmjs.com/package/turndown

#### 特徴
- **人気度**: 最も人気のあるHTML→Markdown変換ライブラリ
- **対応環境**: Node.js、ブラウザ両対応
- **入力形式**: HTML文字列、DOM要素、document、fragment
- **カスタマイズ性**: 高い（ルールシステム、プラグイン対応）

#### 主要機能
- Markdownスタイルのカスタマイズ
  - 見出しスタイル: setext / atx
  - リストマーカー: `*`, `-`, `+`
  - コードブロック: indented / fenced
  - 強調記法: `*` / `_`, `**` / `__`
  - リンクスタイル: inlined / referenced
- カスタムルール追加（`addRule(key, rule)`）
- 要素の保持/削除（`keep()`, `remove()`）
- プラグインシステム（`use(plugin)`）

#### TypeScript対応
- **型定義**: `@types/turndown` パッケージで提供
- **インストール**: `npm install --save-dev @types/turndown`
- **状態**: コミュニティメンテナンス（DefinitelyTyped）

#### 長所
- ✅ 最も広く使われている（実績が豊富）
- ✅ カスタマイズ性が高い
- ✅ プラグインエコシステムが存在
- ✅ ドキュメントが充実
- ✅ シンプルなAPI

#### 短所
- ❌ 本体はJavaScript製（TypeScript nativeではない）
- ❌ エスケープルールが aggressive（過剰にエスケープすることがある）
- ❌ 一部の高度なHTML構造での変換品質に注意が必要

#### 使用例
```typescript
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-'
});

const markdown = turndownService.turndown('<h1>Hello World</h1>');
// Output: # Hello World
```

#### カスタムルール例
```typescript
turndownService.addRule('strikethrough', {
  filter: ['del', 's', 'strike'],
  replacement: (content) => '~~' + content + '~~'
});
```

---

### 2. node-html-markdown
**npm**: https://www.npmjs.com/package/node-html-markdown

#### 特徴
- **パフォーマンス重視**: 大量のHTML処理に最適化
- **対応環境**: Node.js、ブラウザ両対応
- **設計思想**: 「他のライブラリが遅すぎた」という理由で開発

#### 主要機能
- 高速な変換処理（ギガバイト単位のHTMLを日次処理可能）
- 基本的なHTML要素の変換
- シンプルなAPI

#### TypeScript対応
- 情報不足（公式ドキュメント未確認）

#### 長所
- ✅ パフォーマンスが非常に高い
- ✅ 大量データ処理に適している

#### 短所
- ❌ カスタマイズ性の情報が少ない
- ❌ ドキュメントが不足
- ❌ コミュニティが小さい
- ❌ TypeScript対応状況が不明確

#### 適用シーン
- 数千〜数万件のHTML記事を一括変換する場合
- パフォーマンスが最優先の場合

---

### 3. rehype-remark（unified エコシステム）
**GitHub**: https://github.com/rehypejs/rehype-remark
**npm**: https://www.npmjs.com/package/rehype-remark

#### 特徴
- **unified エコシステム**: HTML処理（rehype）とMarkdown処理（remark）を橋渡し
- **AST ベース**: HAST（HTML AST）→ MDAST（Markdown AST）変換
- **プラグイン連携**: 豊富なrehype/remarkプラグインと組み合わせ可能

#### 主要機能
- HTML → Markdown AST 変換
- カスタムハンドラーによる要素別変換ロジック
- `data-mdast="ignore"` 属性でHTML要素を除外
- 特定のHTML要素（SVGなど）をそのまま保持可能
- TypeScript完全対応（型定義内蔵）

#### TypeScript対応
- ✅ **完全対応**（TypeScript製）
- ✅ `Options` インターフェースをエクスポート
- ✅ 高度な型定義（hast-util-to-mdastから）

#### 長所
- ✅ TypeScript native（完全な型安全性）
- ✅ 豊富なプラグインエコシステム
- ✅ AST変換による柔軟性
- ✅ ドキュメント生成パイプラインに最適
- ✅ セマンティック情報の保持が得意

#### 短所
- ❌ 学習曲線が高い（unified エコシステムの理解が必要）
- ❌ シンプルな変換には過剰な設計
- ❌ 依存関係が多い
- ❌ セットアップが複雑

#### 使用例
```typescript
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';

const file = await unified()
  .use(rehypeParse) // HTMLをパース
  .use(rehypeRemark) // HTML AST → Markdown AST
  .use(remarkStringify) // Markdown ASTを文字列化
  .process('<h1>Hello World</h1>');

console.log(String(file)); // # Hello World
```

#### 適用シーン
- ドキュメント生成パイプライン（MDXなど）
- HTML/Markdown双方向変換が必要な場合
- 既にunified エコシステムを使用している場合
- Markdown linting/formatting との統合

---

### 4. その他のライブラリ（調査対象外）

#### Markdown → HTML 方向のライブラリ（今回の目的と逆）
- **marked**: Markdown → HTML（今回は不要）
- **@ts-stack/markdown**: Markdown → HTML（TypeScript製）
- **showdown**: 双方向変換（主にMarkdown → HTML用途）

---

## 比較表

| ライブラリ | TypeScript対応 | カスタマイズ性 | パフォーマンス | 学習コスト | 推奨度 |
|-----------|---------------|---------------|---------------|-----------|--------|
| **Turndown** | △（型定義あり） | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **⭐⭐⭐⭐⭐** |
| **node-html-markdown** | ？（不明） | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **rehype-remark** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

### 評価基準
- **TypeScript対応**: 型定義の充実度
- **カスタマイズ性**: ルール追加、動作変更の柔軟性
- **パフォーマンス**: 大量データ処理時の速度
- **学習コスト**: 導入・習得の容易さ（⭐が多いほど簡単）
- **推奨度**: 本プロジェクトへの適合度

---

## 推奨ライブラリ: Turndown

### 選定理由

#### 1. プロジェクトの要件との適合性
- ✅ **シンプルな用途**: ブログ記事のHTML→Markdown変換（複雑なパイプライン不要）
- ✅ **カスタマイズ必要**: 長いalt属性の簡略化など（記事50175参照）
- ✅ **TypeScript統合**: 既存のTypeScriptプロジェクトに容易に統合可能

#### 2. 実績と信頼性
- 最も広く使われているHTML→Markdown変換ライブラリ
- 多くのプロジェクトで採用（GitHub Stars: 8.5k+）
- 長期間メンテナンスされている

#### 3. カスタマイズの容易性
記事50175で実装された`BlogMarkdownConverter`（Python版）と同等のカスタマイズが可能：

```typescript
// カスタムルール例: 長いalt属性の簡略化
turndownService.addRule('simplifyImageAlt', {
  filter: 'img',
  replacement: (content, node) => {
    const src = node.getAttribute('src') || '';
    const alt = node.getAttribute('alt') || '';

    // Mermaid図など、alt属性が100文字以上の場合は簡略化
    if (alt.length > 100) {
      return `![image](${src})`;
    }

    return `![${alt}](${src})`;
  }
});
```

#### 4. 学習コストの低さ
- シンプルなAPI（基本は1行で変換完了）
- ドキュメントが充実
- サンプルコードが豊富

#### 5. パフォーマンス
本プロジェクトの規模（数十〜数百記事）では十分な性能

---

## 実装方針

### フェーズ1: 基本実装
1. Turndownのインストール
   ```bash
   npm install turndown
   npm install --save-dev @types/turndown
   ```

2. 基本的な変換処理の実装
   ```typescript
   import TurndownService from 'turndown';

   const turndownService = new TurndownService({
     headingStyle: 'atx',
     hr: '---',
     bulletListMarker: '-',
     codeBlockStyle: 'fenced',
     emDelimiter: '*',
     strongDelimiter: '**'
   });

   const markdown = turndownService.turndown(htmlContent);
   ```

3. YAML frontmatter の追加
   ```typescript
   const frontmatter = `---
title: "${metadata.title}"
url: ${metadata.url}
image: ${metadata.image}
converted_at: ${new Date().toISOString()}
---

`;

   const fullMarkdown = frontmatter + markdown;
   ```

### フェーズ2: カスタマイズ
1. **長いalt属性の簡略化**（記事50175参照）
   - Mermaid図など、alt属性にコード全体が含まれる問題への対応
   - 100文字以上のalt属性は`![image](src)`に簡略化

2. **div/span タグの処理**
   - テキストのみ抽出（タグを完全除去）

3. **不要な要素の削除**
   - 目次（Table of Contents）の除外
   - コメントの除外

### フェーズ3: 統合テスト
1. 既存の3記事（50103, 50109, 50142）で検証
2. トークン削減率の測定
   - 目標: 抽出HTML → Markdown で20%削減
   - 目標: 生HTML → Markdown で累積65%削減
3. 可読性の確認（人間による目視確認）

---

## 期待される効果

### トークン削減
記事50175の実測データに基づく推定：

| 段階 | トークン数（例） | 削減率 |
|------|-----------------|--------|
| 生HTML（ページ全体） | 35,420 | - |
| ↓ ContentCompressor（既存） | 15,680 | 55.7% |
| ↓ Turndown変換（NEW） | 12,440 | 20.7% |
| **累積削減** | - | **64.9%** |

### 可読性向上
**Before（HTML）**:
```html
<section>
  <h2>見出し</h2>
  <p>これは段落です。<strong>強調テキスト</strong>があります。</p>
  <ul>
    <li>項目1</li>
    <li>項目2</li>
  </ul>
</section>
```

**After（Markdown）**:
```markdown
## 見出し

これは段落です。**強調テキスト**があります。

- 項目1
- 項目2
```

### 副次的効果
- GitHubでのdiffが見やすくなる
- Claude Codeによる記事内容の理解が向上
- 人間による記事レビューが容易になる

---

## 次のステップ

### 1. 仕様書の作成
`docs/features/` に新機能の仕様書を作成：
- 機能名: `tool-html-to-markdown-converter`
- 内容: Turndownを使ったHTML→Markdown変換機能の詳細仕様

### 2. 実装計画の策定
`docs/features/tool-html-to-markdown-converter/plan.md` に実装計画を記載：
- タスク分割
- 検証計画
- 成功基準

### 3. 実装フェーズへの移行
仕様書・計画書完成後、`application/tools/` で実装

---

## 参考資料

### 公式ドキュメント
- Turndown GitHub: https://github.com/mixmark-io/turndown
- Turndown npm: https://www.npmjs.com/package/turndown
- @types/turndown: https://www.npmjs.com/package/@types/turndown
- rehype-remark: https://github.com/rehypejs/rehype-remark
- unified: https://unifiedjs.com/

### 関連記事
- 記事50175: 「HTMLでブログ記事を保存してる奴、全員Markdownにしろ。AIが読みにくいでしょうが！」
  - Python実装の参考例（markdownifyライブラリ使用）
  - トークン削減率の実測データ
  - カスタマイズ例（長いalt属性の処理）

### プロジェクト内ドキュメント
- `docs/CLAUDE.md`: 計画フェーズのルール
- `application/tools/scraper.ts`: 既存のHTMLスクレイパー実装
- `docs/data/`: スクレイピング済みHTML記事の保存先

---

## まとめ

### 調査結果
- **推奨ライブラリ**: Turndown
- **理由**: シンプルなAPI、高いカスタマイズ性、TypeScript対応、実績
- **代替案**: rehype-remark（複雑なパイプラインが必要な場合）

### 期待される効果
- トークン削減: さらに20%削減（累積65%）
- 可読性: 60点 → 90点（主観）
- 構造保持: 見出し、リスト、コードブロックなどを維持

### 次のアクション
1. 仕様書作成（`docs/features/tool-html-to-markdown-converter/spec.md`）
2. 実装計画策定（`docs/features/tool-html-to-markdown-converter/plan.md`）
3. 実装フェーズへの移行

---

## 更新履歴
- 2025-11-19: 初版作成（Turndown、node-html-markdown、rehype-remarkの調査結果）
