# フロントエンド機能仕様書：Astro + React環境構築

## 概要
このプロジェクトのフロントエンドワークスペース（`application/frontend/`）に、Astro 4.x + React 18.xを使用した静的サイト生成（SSG）環境を構築します。

## 背景・課題
- 現在、フロントエンドワークスペースには`package.json`と`CLAUDE.md`のみが存在
- Marpで生成したスライドやブログ記事データを統合的に表示するWebサイトが必要
- モノレポ構成に適合した、効率的なビルドシステムの構築が必要

## 情報設計（最重要）

### 初期構築で作成するページ
このフェーズでは、基本的な環境構築のみを行い、シンプルなトップページを作成します。

| 情報項目 | 必須/任意 | 優先度 | 説明 |
|---------|----------|--------|------|
| サイトタイトル | 必須 | 最重要 | プロジェクトのタイトル表示 |
| サイト説明 | 必須 | 重要 | このサイトの目的を説明 |
| 構築完了メッセージ | 必須 | 重要 | 環境構築が成功したことを確認 |

### 情報の構造
```
トップページ（index.astro）
├── ヘッダー
│   └── サイトタイトル（最重要）
├── メインコンテンツ
│   ├── 環境構築完了メッセージ（重要）
│   └── サイト説明（重要）
└── フッター
    └── プロジェクト情報（補足）
```

## 技術仕様

### 使用フレームワーク・ライブラリ
- **Astro**: 4.16.14（既存package.jsonに記載）
- **React**: 18.3.1（既存package.jsonに記載）
- **@astrojs/react**: 3.6.2（既存package.jsonに記載）
- **TypeScript**: 5.8.3（既存package.jsonに記載）

### ディレクトリ構成
```
application/frontend/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── atoms/           # 最小単位（Button, Text, など）
│   │   ├── molecules/       # atomsの組み合わせ
│   │   ├── organisms/       # 複雑な機能単位
│   │   └── templates/       # ページレイアウト
│   ├── pages/               # Astroページ（ルーティング）
│   │   └── index.astro      # トップページ
│   ├── layouts/             # 共通レイアウト
│   │   └── BaseLayout.astro # 基本レイアウト
│   ├── hooks/               # カスタムフック（将来の拡張用）
│   ├── services/            # API呼び出しロジック（将来の拡張用）
│   ├── stores/              # 状態管理（将来の拡張用）
│   ├── types/               # TypeScript型定義
│   │   └── index.ts         # 共通型定義
│   └── utils/               # ユーティリティ関数
│       └── index.ts         # 共通関数
├── public/                  # 静的アセット
│   └── favicon.svg          # ファビコン
├── astro.config.mjs         # Astro設定ファイル
├── tsconfig.json            # TypeScript設定ファイル
├── package.json             # 既存（更新不要）
└── CLAUDE.md                # 既存（更新不要）
```

## Astro設定仕様

### astro.config.mjs の要件
- Reactインテグレーションを有効化
- ビルド出力先: `dist`（デフォルト、`application/frontend/dist`）
- サイトURL設定（GitHub Pages用）
- ベースパスの設定

**注記**: GitHub Actionsで最終的なビルド統合を行うため、ビルド出力先はワークスペース配下のdistで問題ありません。

### tsconfig.json の要件
- Astro推奨設定をベースにする
- strict モードを有効化
- パスエイリアス設定（`@components`, `@layouts`, `@utils`など）

## 初期ページ仕様

### トップページ（index.astro）
**目的**: 環境構築が正しく完了したことを確認するための最小限のページ

**表示内容**:
- サイトタイトル: "Claude & Blog Seminar"
- 説明文: "Claudeを活用した技術ブログ執筆のテクニックとワークフロー"
- 構築完了メッセージ: "Astro + React環境の構築が完了しました"
- Reactコンポーネントのテスト表示（動作確認用）

**レイアウト**: BaseLayoutを使用

### 基本レイアウト（BaseLayout.astro）
**役割**: 全ページ共通のHTML構造を提供

**含める要素**:
- HTML doctype、head、body構造
- メタタグ（title, description, viewport）
- OGPタグ（将来の拡張用に準備）
- スロットによるコンテンツ挿入

### Reactコンポーネント例（atoms/WelcomeMessage.tsx）
**目的**: Reactが正しく統合されているか確認

**表示内容**:
- "環境構築が成功しました！" というメッセージ
- propsによるカスタマイズ可能なテキスト

## ビルドシステム統合

### package.jsonスクリプト（既存）
既存の設定を使用（ビルド出力先のみ調整）：
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

**注記**:
- ビルド出力先は `application/frontend/dist`（Astroのデフォルト）
- GitHub Actionsで最終的な`dist/`への配置を調整

### モノレポビルドシステム（既存）
ルートの`package.json`にすでに統合済み：
```json
{
  "scripts": {
    "build": "npm run build:marp && npm run build:frontend",
    "build:frontend": "npm run build --workspace=application/frontend",
    "dev:frontend": "npm run dev --workspace=application/frontend"
  }
}
```

## 非機能要件

### パフォーマンス
- 初期ロード: 2秒以内（シンプルページのため十分達成可能）
- ビルド時間: 10秒以内
- 静的HTML生成によるゼロJS実行時間（Reactコンポーネントは最小限）

### レスポンシブ対応
- モバイル（〜768px）: 単一カラムレイアウト
- タブレット（769px〜1024px）: 同上
- デスクトップ（1025px〜）: 中央揃え、最大幅1200px

### アクセシビリティ
- セマンティックHTML使用（header, main, footer）
- ARIA属性は必要な箇所のみ使用
- 色のコントラスト: WCAG AA準拠

### 開発体験（DX）
- Hot Module Replacement（HMR）による高速開発
- TypeScriptによる型安全性
- ESLint/Prettierによる自動フォーマット（将来追加可能）

## デザイン指針（AIに委ねる）

### デザインの方向性
- **トーン**: モダン、プロフェッショナル
- **雰囲気**: シンプル、クリーン、技術的

### デザイン上の制約
- **グラデーション**: 使用しない、またはごく控えめに（多用禁止）
- **アニメーション**: 必要最小限
- **装飾**: シンプルで機能的なデザインを優先

### AIへの依頼事項
```
この仕様書を元にAstro + React環境を構築してください。

デザイン方針：
- 情報の正確性を最優先
- シンプルで見やすく、モダンなデザイン
- グラデーションは使用しない（単色またはフラットデザインを推奨）
- レスポンシブ対応を考慮
- アクセシビリティに配慮
- 色やフォント、レイアウトはあなたの判断で最適なものを選択
```

## 技術的制約

### 既存ファイルの保持
- `package.json` - **変更しない**（依存関係は既に適切）
- `CLAUDE.md` - **変更しない**（実装ルールが記載済み）

### ビルド出力先
- **ビルド出力**: `application/frontend/dist`（Astroデフォルト）
- **最終デプロイ**: GitHub Actionsで`dist/`（ルート）に統合

### 禁止事項
- package.jsonの依存関係を変更しない
- 複雑な状態管理を導入しない（この段階では不要）

## 実装時の注意点

### 優先度
- 🔴 必須: Astro設定ファイル、ディレクトリ構造、トップページ
- 🟡 推奨: Reactコンポーネント例、BaseLayout
- 🟢 オプション: ユーティリティ関数、型定義

### 実装順序
1. **Astro設定ファイル作成**（astro.config.mjs, tsconfig.json）
2. **ディレクトリ構造作成**（src/以下の全ディレクトリ）
3. **BaseLayout作成**（基本HTML構造）
4. **トップページ作成**（index.astro）
5. **Reactコンポーネント例作成**（動作確認用）
6. **ビルド確認**（エラーなくビルドが通ること）

### 既存コードとの関係
- Marpのビルド出力と同じ`dist/`ディレクトリを共有
- `dist/`直下にHTMLファイルが生成される構成

## 検証方法

### ビルド確認
```bash
# ワークスペースのビルド
npm run build:frontend

# モノレポ全体のビルド
npm run build
```

### 開発サーバー確認
```bash
npm run dev:frontend
```

**確認ポイント**:
- ✅ 開発サーバーが起動するか
- ✅ http://localhost:4321 でページが表示されるか
- ✅ HMRが動作するか（ファイル変更が即座に反映）

### ビルド出力確認
```bash
ls -la application/frontend/dist/
```

**確認ポイント**:
- ✅ `application/frontend/dist/index.html` が生成されているか
- ✅ 他の静的ファイル（CSS, JS）が生成されているか
- ✅ ビルドが正常に完了しているか

**注記**: Marpは `dist/` に出力、Frontendは `application/frontend/dist/` に出力されるため、競合はありません。

### Reactインテグレーション確認
**確認ポイント**:
- ✅ Reactコンポーネントが正しく表示されるか
- ✅ propsが正しく渡されているか
- ✅ ブラウザコンソールにエラーがないか

## テスト観点

### 情報表示の確認
- ✅ サイトタイトルが表示されているか
- ✅ 環境構築完了メッセージが表示されているか
- ✅ 説明文が表示されているか

### ビルドシステムの確認
- ✅ `npm run build:frontend` が成功するか
- ✅ `npm run build` が成功するか（Marpと統合）
- ✅ エラーや警告が出ていないか

### 開発体験の確認
- ✅ 開発サーバーが起動するか
- ✅ HMRが正しく動作するか
- ✅ TypeScriptの型チェックが動作するか

### レスポンシブの確認
- ✅ モバイル・タブレット・デスクトップで正しく表示されるか
- ✅ レイアウトが崩れていないか

## 将来の拡張性

### 今後追加予定の機能
このフェーズでは実装せず、将来の拡張として想定：
- ブログ記事一覧ページ
- Marpスライド一覧ページ
- カテゴリ別フィルタリング
- 検索機能
- ダークモードトグル

### 拡張のための準備
今回の構築で以下を準備：
- Atomic Designに基づいたディレクトリ構造
- 型定義ディレクトリ（types/）
- ユーティリティ関数ディレクトリ（utils/）
- カスタムフックディレクトリ（hooks/）

## 参考資料
- Astro公式ドキュメント: https://docs.astro.build/
- Astro + React統合: https://docs.astro.build/en/guides/integrations-guide/react/
- プロジェクトCLAUDE.md: `/home/node/workspace/CLAUDE.md`
- フロントエンドCLAUDE.md: `/home/node/workspace/application/frontend/CLAUDE.md`

## 備考
- この仕様書は環境構築のみを対象としています
- 実際のコンテンツページは別の仕様書で定義します
- デザインの詳細はAIに委ね、情報の正確性を最重視します

---

## 仕様書レビューチェックリスト

実装前に以下を確認してください：

- [x] ディレクトリ構成が明確に定義されているか
- [x] 技術スタックが既存package.jsonと整合しているか
- [x] ビルド出力先が正しく設定されているか
- [x] 実装の優先度が明確か
- [x] デザインの詳細（色、フォントサイズなど）を書いていないか
- [x] レイアウトの細かい指定を書いていないか
- [x] 検証方法が具体的に記載されているか
- [x] 将来の拡張性が考慮されているか
