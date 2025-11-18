# フロントエンド環境構築 - 実装計画書

## プロジェクト概要

### 目的
`application/frontend/` ワークスペースに、Astro 4.x + React 18.xを使用した静的サイト生成（SSG）環境を構築し、モノレポのビルドシステムと統合する。

### スコープ
**このフェーズで実施すること：**
- ✅ Astro + React環境の初期セットアップ
- ✅ ディレクトリ構造の構築
- ✅ 設定ファイルの作成（astro.config.mjs, tsconfig.json）
- ✅ 基本レイアウトコンポーネントの作成
- ✅ シンプルなトップページの作成（環境確認用）
- ✅ Reactコンポーネント例の作成（統合確認用）
- ✅ ビルドシステムとの統合確認

**このフェーズで実施しないこと：**
- ❌ 実際のコンテンツページ（ブログ一覧、スライド一覧など）
- ❌ 複雑な状態管理システム
- ❌ 外部APIとの統合
- ❌ 認証機能
- ❌ ESLint/Prettier設定（将来追加可能）

## 開発アプローチ：仕様書ベース開発

このプロジェクトでは、**3フェーズ開発手法**を採用します。

### フェーズ1：計画（このドキュメント）
- ✅ 仕様書の作成完了: `docs/features/frontend-astro-react-setup.md`
- ✅ 計画書の作成（このファイル）
- ❌ コードは一切書かない

### フェーズ2：実装（次のステップ）
仕様書を元にAIが自動実装：
```
以下の仕様書を読み込んで実装してください：
@docs/features/frontend-astro-react-setup.md

実装方針：
- ディレクトリ構造を正確に作成
- 設定ファイルをベストプラクティスに従って作成
- シンプルで見やすいデザインを適用
- レスポンシブ対応を考慮
```

### フェーズ3：検証（実装後）
計画と実装の差異を分析し、学びを得る。

## 技術仕様サマリー

### 技術スタック
| カテゴリ | 技術 | バージョン | 備考 |
|---------|------|-----------|------|
| フレームワーク | Astro | 4.16.14 | 既存package.jsonで定義済み |
| UIライブラリ | React | 18.3.1 | 既存package.jsonで定義済み |
| 統合 | @astrojs/react | 3.6.2 | 既存package.jsonで定義済み |
| 言語 | TypeScript | 5.8.3 | 既存package.jsonで定義済み |

### ビルド設定
- **開発サーバー**: `npm run dev:frontend`
- **ビルドコマンド**: `npm run build:frontend`
- **出力先**: `application/frontend/dist`（ワークスペース配下）
- **最終デプロイ**: GitHub Actionsで`dist/`（ルート）に統合
- **型チェック**: `astro check` をビルド前に実行

## ディレクトリ構造（詳細）

```
application/frontend/
├── src/
│   ├── components/          # Reactコンポーネント（Atomic Design）
│   │   ├── atoms/           # 最小単位のコンポーネント
│   │   │   └── WelcomeMessage.tsx    # 環境確認用コンポーネント
│   │   ├── molecules/       # atomsの組み合わせ（空）
│   │   ├── organisms/       # 複雑な機能単位（空）
│   │   └── templates/       # ページテンプレート（空）
│   ├── pages/               # Astroページ（ファイルベースルーティング）
│   │   └── index.astro      # トップページ
│   ├── layouts/             # 共通レイアウト
│   │   └── BaseLayout.astro # 基本HTML構造
│   ├── hooks/               # カスタムフック（将来の拡張用、空）
│   ├── services/            # API呼び出しロジック（将来の拡張用、空）
│   ├── stores/              # 状態管理（将来の拡張用、空）
│   ├── types/               # TypeScript型定義
│   │   └── index.ts         # 共通型定義（空でもOK）
│   └── utils/               # ユーティリティ関数
│       └── index.ts         # 共通関数（空でもOK）
├── public/                  # 静的アセット
│   └── favicon.svg          # ファビコン
├── astro.config.mjs         # Astro設定ファイル ← 新規作成
├── tsconfig.json            # TypeScript設定ファイル ← 新規作成
├── package.json             # 既存（変更不要）
└── CLAUDE.md                # 既存（変更不要）
```

**注記**:
- `atoms/`, `molecules/`, `organisms/`, `templates/` は将来の拡張のためディレクトリのみ作成
- 初期段階では `WelcomeMessage.tsx` のみ実装
- `hooks/`, `services/`, `stores/` も将来の拡張用に空ディレクトリを作成

## 作成するファイルの詳細

### 1. 設定ファイル

#### astro.config.mjs
**目的**: Astroの動作設定
**重要な設定**:
- Reactインテグレーション有効化
- ビルド出力先: デフォルト（`dist/`、つまり`application/frontend/dist`）
- サイトURL（GitHub Pages用）
- ベースパス設定

**注記**: GitHub Actionsで最終的なビルド統合を行うため、出力先はワークスペース配下で問題ありません。

#### tsconfig.json
**目的**: TypeScriptコンパイラ設定
**重要な設定**:
- Astro推奨設定をベース
- strict モード有効化
- パスエイリアス（`@/components`, `@/layouts` など）

### 2. レイアウトコンポーネント

#### src/layouts/BaseLayout.astro
**目的**: 全ページ共通のHTML構造
**含める要素**:
- HTML5ドキュメント構造（doctype, html, head, body）
- メタタグ（title, description, viewport）
- OGPタグ（将来の拡張用）
- スロットによるコンテンツ挿入
- レスポンシブ対応のviewport設定

**propsの型定義**:
```typescript
interface Props {
  title: string;
  description: string;
}
```

### 3. ページコンポーネント

#### src/pages/index.astro
**目的**: トップページ（環境確認用）
**表示内容**:
- サイトタイトル: "Claude & Blog Seminar"
- サイト説明: "Claudeを活用した技術ブログ執筆のテクニックとワークフロー"
- 環境構築完了メッセージ
- Reactコンポーネントの動作確認表示

**使用コンポーネント**:
- BaseLayout（レイアウト）
- WelcomeMessage（React、動作確認用）

### 4. Reactコンポーネント

#### src/components/atoms/WelcomeMessage.tsx
**目的**: Reactインテグレーションの動作確認
**機能**:
- propsでメッセージをカスタマイズ可能
- シンプルなテキスト表示
- TypeScript型定義あり

**propsの型定義**:
```typescript
interface WelcomeMessageProps {
  message?: string;
}
```

**デフォルトメッセージ**: "環境構築が成功しました！"

### 5. 静的アセット

#### public/favicon.svg
**目的**: ブラウザタブのアイコン
**要件**:
- SVG形式
- シンプルなデザイン
- プロジェクトのイメージに合ったもの

### 6. 型定義とユーティリティ（空ファイルでOK）

#### src/types/index.ts
将来の拡張用。空ファイルまたはコメントのみでOK。

#### src/utils/index.ts
将来の拡張用。空ファイルまたはコメントのみでOK。

## 実装の詳細要件

### Astro設定（astro.config.mjs）の要件

**必須設定**:
```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  // outDirはデフォルト（dist/）を使用
  // その他の設定はAIの判断に委ねる
});
```

**考慮すべき設定**:
- `site`: GitHub Pagesのサイト URL
- `base`: ベースパス（リポジトリ名）
- `build.format`: 'file' または 'directory'
- `outDir`: 明示的に指定しない場合はデフォルト（`dist/`）

### TypeScript設定（tsconfig.json）の要件

**必須設定**:
- Astro推奨設定を継承
- strict モード有効化
- パスエイリアス設定

**推奨設定**:
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/layouts/*": ["src/layouts/*"]
    }
  }
}
```

### レスポンシブデザインの要件

**ブレークポイント**:
- モバイル: 〜768px
- タブレット: 769px〜1024px
- デスクトップ: 1025px〜

**レスポンシブ対応の実装方法**:
- CSS Grid または Flexbox使用
- モバイルファースト設計
- メディアクエリによる調整

### アクセシビリティの要件

**必須対応**:
- セマンティックHTML（header, main, footer, nav, article）
- alt属性の適切な使用
- 色のコントラスト比: WCAG AA準拠
- キーボード操作可能

**推奨対応**:
- ARIA属性の適切な使用
- フォーカスインジケーターの視認性
- スクリーンリーダー対応

## 検証計画

### 1. ビルド検証

**コマンド**:
```bash
# フロントエンドのみビルド
npm run build:frontend

# モノレポ全体のビルド
npm run build
```

**成功基準**:
- ✅ ビルドエラーなし
- ✅ TypeScriptの型エラーなし
- ✅ `application/frontend/dist/index.html` が生成される
- ✅ 他の静的ファイル（CSS, JS）が生成される

### 2. 開発サーバー検証

**コマンド**:
```bash
npm run dev:frontend
```

**成功基準**:
- ✅ 開発サーバーが起動（通常 http://localhost:4321）
- ✅ ブラウザでページが表示される
- ✅ HMRが動作（ファイル変更が即座に反映）
- ✅ コンソールエラーなし

### 3. Reactインテグレーション検証

**確認項目**:
- ✅ Reactコンポーネント（WelcomeMessage）が表示される
- ✅ propsが正しく渡される
- ✅ ブラウザのReact DevToolsで確認可能
- ✅ ハイドレーションエラーなし

### 4. レスポンシブ検証

**確認デバイス/サイズ**:
- iPhone SE (375px)
- iPad (768px)
- Desktop (1920px)

**確認項目**:
- ✅ レイアウトが崩れない
- ✅ テキストが読みやすい
- ✅ 画像が適切にスケールする

### 5. アクセシビリティ検証

**ツール**:
- Lighthouse（Chrome DevTools）
- axe DevTools（ブラウザ拡張）

**成功基準**:
- ✅ Lighthouseアクセシビリティスコア: 90以上
- ✅ axeで重大なエラーなし

### 6. モノレポ統合検証

**確認項目**:
- ✅ Marpビルドと競合しない（出力先が異なるため）
- ✅ `application/frontend/dist/` 内のファイル構成が正しい
- ✅ `npm run build` で両方のワークスペースがビルドされる
- ✅ GitHub Actionsでの統合を想定した出力形式

## リスクと対策

### リスク1: ビルド出力先の管理
**リスク**: フロントエンドとMarpで出力先が異なるため、GitHub Actionsでの統合が必要

**対策**:
- フロントエンド: `application/frontend/dist/`
- Marp: `dist/`（ルート直下）
- GitHub Actionsで最終的に統合する想定
- 現時点では競合の心配なし

### リスク2: TypeScript設定の不整合
**リスク**: Astro、React、既存プロジェクトの型定義が競合

**対策**:
- Astro推奨のtsconfig設定を使用
- パスエイリアスを慎重に設定
- ビルド前に `astro check` を実行

### リスク3: Reactコンポーネントのハイドレーション問題
**リスク**: サーバーサイドレンダリングとクライアントのミスマッチ

**対策**:
- `client:load` ディレクティブを適切に使用
- 初期状態をサーバーとクライアントで統一
- 条件付きレンダリングに注意

### リスク4: 開発サーバーのポート競合
**リスク**: 他のサービスが既にポート4321を使用

**対策**:
- Astro設定でポートを変更可能
- エラーメッセージを確認して適切に対処

## 成功基準

このフェーズが成功したと判断する基準：

### 必須（🔴）
- ✅ `npm run build:frontend` が成功する
- ✅ `npm run build` が成功する（Marpと統合）
- ✅ `npm run dev:frontend` が成功する
- ✅ `application/frontend/dist/index.html` が生成される
- ✅ ブラウザでトップページが表示される
- ✅ Reactコンポーネントが動作する
- ✅ TypeScriptの型エラーがない
- ✅ レスポンシブ対応されている

### 推奨（🟡）
- ✅ Lighthouseスコア: Performance 90+, Accessibility 90+
- ✅ HMRが正しく動作する
- ✅ ビルド時間が10秒以内

### オプション（🟢）
- デザインが美しい（AIに委ねる）
- アニメーションがスムーズ（AIに委ねる）

## タイムライン（想定）

### フェーズ1: 計画（完了）
- 仕様書作成: ✅ 完了
- 計画書作成: ✅ 完了（このドキュメント）

### フェーズ2: 実装（次のステップ）
**想定時間**: 30分〜1時間

**ステップ**:
1. 仕様書をAIに読み込ませる（1分）
2. AIが実装を実行（10-20分）
3. ビルド確認（5分）
4. 動作確認（10分）
5. 問題があれば修正依頼（10-20分）

### フェーズ3: 検証（実装後）
**想定時間**: 30分

**ステップ**:
1. 全ての検証項目を確認（20分）
2. レビューレポート作成（10分）
3. 学びを次回に活かす

## 次のステップ

### 実装フェーズへの移行
計画フェーズが完了したので、実装フェーズに移行します。

**実施コマンド**:
```
以下の仕様書を読み込んで実装してください：
@docs/features/frontend-astro-react-setup/spec.md

実装方針：
- ディレクトリ構造を正確に作成
- 設定ファイルをベストプラクティスに従って作成
- シンプルで見やすいデザインを適用
- レスポンシブ対応を考慮
- デザインの詳細（色、フォント、レイアウト）はあなたの判断で最適なものを選択
```

### 実装後の確認事項
1. ビルドが成功することを確認
2. 開発サーバーで動作確認
3. レスポンシブ対応を確認
4. Reactコンポーネントの動作確認

### 将来の拡張（このフェーズでは実施しない）
- ブログ記事一覧ページ
- Marpスライド一覧ページ
- カテゴリ別フィルタリング
- 検索機能
- ダークモードトグル

## 参考資料

### 公式ドキュメント
- Astro: https://docs.astro.build/
- Astro + React: https://docs.astro.build/en/guides/integrations-guide/react/
- React: https://react.dev/

### プロジェクト内ドキュメント
- プロジェクト全体ガイド: `/home/node/workspace/CLAUDE.md`
- フロントエンド実装ルール: `/home/node/workspace/application/frontend/CLAUDE.md`
- 仕様書ベース開発ガイド: `/home/node/workspace/docs/spec-based-development-guide.md`
- 仕様書テンプレート: `/home/node/workspace/docs/templates/spec-template-frontend.md`

### 参考実装
- Marp実装ルール: `/home/node/workspace/application/marp/CLAUDE.md`
- Tools実装ルール: `/home/node/workspace/application/tools/CLAUDE.md`

---

## レビューチェックリスト

計画書として適切か確認：

- [x] 実装スコープが明確に定義されているか
- [x] 技術仕様が具体的に記載されているか
- [x] ディレクトリ構造が詳細に定義されているか
- [x] 検証計画が具体的か
- [x] リスクと対策が検討されているか
- [x] 成功基準が明確か
- [x] タイムラインが現実的か
- [x] 次のステップが明確か
- [x] この段階でコードを書いていないか ✅
- [x] デザインの詳細を指定していないか ✅
