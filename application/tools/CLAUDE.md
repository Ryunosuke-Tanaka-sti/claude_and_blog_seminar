# Tools実装ルール（ユーティリティツール）

## 概要
ワークスペースの作業を効率化するユーティリティツールの実装ルールです。
TypeScriptでCLIツールやスクリプトを作成します。

## 技術スタック
- **言語**: TypeScript 5.x
- **ランタイム**: Node.js
- **実行方法**: tsx（開発時）、tsc（ビルド時）
- **モジュール形式**: CommonJS

## ディレクトリ構成
```
application/tools/
├── src/                   # TypeScriptソースファイル（将来の拡張用）
├── *.ts                   # ツールスクリプト（ルート直下）
│   ├── scraper.ts         # Webスクレイパー
│   ├── blog-html-generator.ts    # HTML生成
│   ├── blog-data-extractor.ts    # データ抽出
│   └── fetch-ogp-images.ts       # OGP画像取得
├── dist/                  # ビルド出力
├── package.json
└── tsconfig.json
```

## 開発の基本方針

### ツールの役割
このディレクトリのツールは以下の目的で使用されます：
- ✅ データ収集の自動化（スクレイピング）
- ✅ ファイル生成の自動化（HTMLインデックス生成など）
- ✅ データ変換・抽出の自動化
- ✅ 繰り返し作業の効率化

### 開発アプローチ
**人間が注目すべきこと：**
- ✅ ツールの**目的**と**使用方法**
- ✅ 入力データの**形式**と**検証**
- ✅ 出力結果の**正確性**
- ✅ エラーハンドリングの**適切性**

**AIに任せること：**
- 🤖 実装の詳細（アルゴリズム）
- 🤖 エラーメッセージの文言
- 🤖 ログ出力の整形
- 🤖 型定義の詳細

## TypeScript設定

### tsconfig.json の基本設定
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## コード規約

### 基本原則
- **単一責任の原則**: 1ツール1機能
- **関数の分割**: 1関数は50行以内を目安
- **型安全**: `any`型の使用を最小限に
- **エラーハンドリング**: 必ずtry-catchでエラーを捕捉

### ファイル構成
```typescript
// 1. import文
import * as fs from 'fs';
import * as path from 'path';

// 2. 型定義
interface ArticleData {
  id: string;
  title: string;
  url: string;
}

// 3. 定数定義
const OUTPUT_DIR = 'docs/data';
const BASE_URL = 'https://example.com';

// 4. ユーティリティ関数
function validateInput(data: unknown): data is ArticleData {
  // バリデーションロジック
}

// 5. メイン関数
async function main() {
  try {
    // メイン処理
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// 6. 実行
main();
```

### 命名規則
- **ファイル名**: kebab-case（例: `blog-data-extractor.ts`）
- **関数名**: camelCase（例: `fetchArticleData`）
- **型名**: PascalCase（例: `ArticleData`）
- **定数**: UPPER_SNAKE_CASE（例: `OUTPUT_DIR`）

## 依存関係

### よく使用するライブラリ
```json
{
  "dependencies": {
    "cheerio": "^1.1.2",        // HTML/XMLパース
    "node-fetch": "^2.7.0"      // HTTP リクエスト
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "@types/cheerio": "^0.22.35",
    "@types/node-fetch": "^2.6.13",
    "tsx": "^4.20.3",           // TypeScript実行
    "typescript": "^5.8.3"
  }
}
```

## 実装パターン

### パターン1: スクレイピングツール
```typescript
// ブログ記事をスクレイピングして保存
async function scrapeArticle(url: string): Promise<void> {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  // データ抽出
  const title = $('h1.title').text();
  const content = $('article').html();

  // ファイル保存
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `article-${id}.html`),
    content
  );
}
```

### パターン2: データ変換ツール
```typescript
// JSON データをHTMLインデックスに変換
function generateIndex(articles: ArticleData[]): string {
  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <ul>
        ${articles.map(a => `<li><a href="${a.url}">${a.title}</a></li>`).join('\n')}
      </ul>
    </body>
    </html>
  `;
  return html;
}
```

### パターン3: ファイル操作ツール
```typescript
// ディレクトリ内のファイルを一括処理
function processFiles(dirPath: string): void {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 処理ロジック
    const processed = transform(content);

    fs.writeFileSync(filePath, processed);
  });
}
```

## エラーハンドリング

### 基本的なエラー処理
```typescript
async function main() {
  try {
    // メイン処理
    await scrapeArticle(url);
    console.log('✓ 完了しました');
  } catch (error) {
    if (error instanceof Error) {
      console.error('エラー:', error.message);
    } else {
      console.error('不明なエラーが発生しました');
    }
    process.exit(1);
  }
}
```

### 詳細なエラーログ
```typescript
// 開発時に詳細なエラー情報を出力
if (process.env.DEBUG) {
  console.error('詳細:', error.stack);
}
```

## 実行方法

### 開発時（tsx使用）
```bash
npm run scraper --workspace=application/tools
```

### ビルド後実行
```bash
npm run scraper:build --workspace=application/tools
npm run scraper:run --workspace=application/tools
```

## 仕様書の書き方

### 良い仕様書の例
```markdown
# ツール仕様書：記事一覧HTMLジェネレーター

## 目的
ブログ記事データ（JSON）から、見やすいHTMLインデックスページを生成する

## 入力
- **ファイル**: `docs/data/articles.json`
- **形式**:
  ```json
  [
    {
      "id": "48196",
      "title": "記事タイトル",
      "url": "https://...",
      "date": "2025-01-15"
    }
  ]
  ```

## 処理内容
1. `articles.json`を読み込む
2. 日付順（降順）にソート
3. HTMLテンプレートに埋め込む
4. `docs/blog-index.html`に出力

## 出力
- **ファイル**: `docs/blog-index.html`
- **内容**: 記事一覧リスト（クリック可能なリンク）

## エラー処理
- ファイルが存在しない場合：エラーメッセージを表示して終了
- JSONが不正な場合：パースエラーを表示して終了

## 実行方法
```bash
npm run generate-index --workspace=application/tools
```

## 検証方法
1. 生成されたHTMLファイルが存在するか
2. 記事の並び順が正しいか
3. リンクが正しく動作するか
```

### 避けるべき仕様書
```markdown
❌ for文を使って配列をループして...
   （実装の詳細は書かない）

❌ console.logで進捗を表示して...
   （ログ出力の詳細は書かない）

❌ try-catchでエラーを捕捉して...
   （エラー処理の実装は書かない）
```

## 実装の流れ

### 1. 仕様書の作成
```bash
cp docs/templates/spec-template-tool.md docs/features/tool-index-generator.md
```

### 2. Claude Codeに実装依頼
```
以下の仕様書を読み込んでツールを実装してください：
@docs/features/tool-index-generator.md

実装方針：
- 入力/出力の正確性を最優先
- エラーハンドリングを適切に実装
- 実行時に進捗が分かるようログ出力を追加
```

### 3. 動作確認
```bash
npm run [tool-script] --workspace=application/tools
```

### 4. 人間のレビューポイント
- ✅ 出力ファイルは期待通りか？
- ✅ エラー時に適切なメッセージが表示されるか？
- ✅ 実行速度は許容範囲か？
- 🤖 コードの書き方は気にしない（AIに任せる）

## 禁止事項
- ❌ ユーザー入力を検証せずに実行しない
- ❌ エラーを握りつぶさない（必ず通知）
- ❌ ハードコードされた値を多用しない（定数化）
- ❌ 外部APIを叩く際にレート制限を無視しない

## パフォーマンス考慮事項
- 大量のファイル処理時はバッチ処理を検討
- 外部API呼び出しは並列化を検討（レート制限に注意）
- メモリ使用量が大きい場合はストリーム処理を検討

## セキュリティ考慮事項
- ユーザー入力はサニタイズする
- ファイルパスはパストラバーサル攻撃を防ぐ
- 環境変数から機密情報を読み込む（ハードコード禁止）

## トラブルシューティング

**問題: ツールが期待通りに動作しない**
- 対処: 入力データの形式を確認
- デバッグモードで詳細ログを出力

**問題: エラーメッセージが分かりにくい**
- 対処: エラーメッセージに具体的な情報を追加
- 「何が」「なぜ」失敗したかを明記

**問題: 実行速度が遅い**
- 対処: ボトルネックを特定（console.timeで計測）
- 並列処理やキャッシュを検討

## 参考資料
- TypeScript公式: https://www.typescriptlang.org/
- Node.js公式: https://nodejs.org/
- Cheerio: https://cheerio.js.org/
