# GitHub Pages デプロイメント 確定仕様書

> **ステータス**: 運用中
> **最終更新**: 2025-11-18
> **バージョン**: 1.1

## 概要
GitHub ActionsとGitHub Pagesを使用して、MarpプレゼンテーションとAstro製フロントエンドを自動ビルド・デプロイするCI/CDパイプラインです。mainブランチへのpush時に、変更されたファイルパスに応じて自動的にビルド・デプロイが実行されます。

## 背景・課題

### 解決した課題
1. **手動ビルドの排除**: 手動でビルドを実行する必要があり、ヒューマンエラーのリスクがあった
2. **ビルド成果物の統合**: MarpとFrontendの2つのワークスペースを統合して公開する仕組みが必要だった
3. **デプロイの自動化**: GitHub Pagesへの公開手順が自動化されていなかった
4. **npm workspaceへの対応**: モノレポ構成での依存関係解決とビルドの最適化が必要だった
5. **不要なビルドの削減**: `docs/` ディレクトリ（計画・仕様書）の変更時に不要なデプロイが実行されていた

## 実装情報

### 実装ファイル
- **メインファイル**: `.github/workflows/deploy.yml`
- **関連ファイル**:
  - `package.json` (ルート) - patch-package依存関係の追加
  - `application/marp/package.json` - ビルドスクリプト
  - `application/frontend/package.json` - ビルドスクリプト

### 技術スタック
- **CI/CD**: GitHub Actions
- **Node.js**: 20.x (LTS)
- **パッケージマネージャー**: npm
- **ビルドツール**: Marp CLI 4.x, Astro 4.x
- **ホスティング**: GitHub Pages
- **使用するActions**:
  - `actions/checkout@v5` - リポジトリのチェックアウト
  - `actions/setup-node@v6` - Node.jsのセットアップ（npmキャッシュ対応）
  - `actions/upload-artifact@v4` - ビルド成果物のアップロード
  - `actions/download-artifact@v4` - ビルド成果物のダウンロード
  - `peaceiris/actions-gh-pages@v4` - GitHub Pagesへのデプロイ

## アーキテクチャ

### デプロイフロー
```
mainブランチへpush
  ↓
GitHub Actions トリガー
  ↓
┌──────────────────────────┬──────────────────────────┐
│  Job: build-marp         │  Job: build-site         │
│                          │                          │
│  npm ci (npmキャッシュ)  │  npm ci (npmキャッシュ)  │
│  ↓                       │  ↓                       │
│  Marpビルド              │  Frontendビルド          │
│  ↓                       │  ↓                       │
│  artifact: marp-dist     │  artifact: site-dist     │
└──────────────────────────┴──────────────────────────┘
              ↓                        ↓
              └────────┬───────────────┘
                       ↓
               Job: deploy
                       ↓
            GitHub Pagesにデプロイ
```

### ビルド戦略の選択
3回の試行錯誤の結果、以下のアプローチを採用：

**最終アプローチ**: 各ジョブで独立してnpm ci + npmキャッシュ

**選択理由**:
- ✅ **シンボリックリンクの問題を回避**: node_modules/.bin/のコマンド（marp, astro）が正常動作
- ✅ **実行権限の問題を回避**: artifactの圧縮・展開による権限喪失がない
- ✅ **npmキャッシュで高速化**: 2回目以降のnpm ciは約75%高速化
- ✅ **並列ビルドでビルド時間短縮**: MarpとFrontendが同時実行
- ✅ **シンプルで保守しやすい**: 複雑なartifact管理が不要

**却下したアプローチ**:
1. ❌ 各ジョブで独立してnpm ci（patch-package未定義）→ rollupのpostinstallエラー
2. ❌ installジョブでnpm ci + node_modules共有 → シンボリックリンク/実行権限の問題

## 機能仕様

### ワークフロー定義

| 要素 | 仕様 | 実装状況 |
|------|------|----------|
| トリガー | mainブランチへのpush（パスフィルター付き） | ✅ 実装済み |
| パスフィルター | `application/marp/**`, `application/frontend/**`, `.github/workflows/deploy.yml` | ✅ v1.1で追加 |
| 並列ビルド | MarpとFrontendを同時実行 | ✅ 実装済み |
| npmキャッシュ | setup-nodeのcache機能 | ✅ 実装済み |
| 成果物統合 | deployジョブで統合 | ✅ 実装済み |
| エラーハンドリング | ビルド失敗時にデプロイ中止 | ✅ 実装済み |

### ジョブ構成

#### Job 1: build-marp（Marpスライドビルド）
1. リポジトリをチェックアウト
2. Node.js 20.x をセットアップ（npmキャッシュ有効）
3. モノレポ全体の依存関係をインストール（`npm ci`）
4. Marpスライドをビルド（`npm run build --workspace=application/marp`）
5. ビルド成果物をartifactとしてアップロード（名前: `marp-dist`）

**出力**:
- `dist/slides/*.html` - スライドHTMLファイル
- `dist/slides/assets/` - 画像・SVGアセット

#### Job 2: build-site（Frontendビルド）
1. リポジトリをチェックアウト
2. Node.js 20.x をセットアップ（npmキャッシュ有効）
3. モノレポ全体の依存関係をインストール（`npm ci`）
4. Astro Frontendをビルド（`npm run build --workspace=application/frontend`）
5. ビルド成果物をartifactとしてアップロード（名前: `site-dist`）

**出力**:
- `dist/` - Astroビルド成果物（index.html, _astro/, etc.）

#### Job 3: deploy（統合とデプロイ）
1. `marp-dist` artifactをダウンロード → `dist/slides/`
2. `site-dist` artifactをダウンロード → `dist/`
3. 統合された`dist/`ディレクトリをGitHub Pagesにデプロイ

**依存関係**: `build-marp`と`build-site`の両方が成功した場合のみ実行

### 最終的なディレクトリ構造（GitHub Pagesデプロイ後）
```
dist/
├── index.html                                    # Astro Frontend トップページ
├── _astro/                                       # Astroビルド成果物
│   ├── *.css
│   ├── *.js
│   └── ...
├── (その他Astroが生成するファイル・ディレクトリ)
└── slides/                                       # Marp スライド（独立）
    ├── ai_spec_driven_development_slides.html
    ├── automation_pipeline_deep_dive_slides.html
    ├── blog_reason_lt_slides.html
    ├── blog_to_marp_workflow.html
    ├── claude_seminar_slides.html
    ├── github_issue_claude_x_generator.html
    ├── notebook_lm_slack_bot_slides.html
    ├── notion_and_claude_blog_write.html
    ├── vibe_coding.html
    ├── voice_writing_seminar.html
    └── assets/                                    # スライド用アセット
        ├── (SVG/PNGファイル群)
        └── ...
```

**アクセスURL**:
- Frontend: `https://ryunosuke-tanaka-sti.github.io/claude_and_blog_seminar/`
- スライド例: `https://ryunosuke-tanaka-sti.github.io/claude_and_blog_seminar/slides/claude_seminar_slides.html`

## データ仕様

### 入力データ
- **トリガー**: mainブランチへのgit push
- **ソースファイル**:
  - `application/marp/src/*.md` - Markdownスライド
  - `application/frontend/src/` - Astroソースコード

### 出力データ
- **GitHub Pages**: 静的HTMLファイル群
- **デプロイ先**: `gh-pages`ブランチ（自動生成）

## 非機能要件

### パフォーマンス
- **ビルド時間**: 約2-3分（並列ビルド）
- **npmキャッシュヒット時**: 約1-2分
- **並列化の効果**: 約40-50%の時間短縮
- **npmキャッシュの効果**: 約75%の時間短縮（2回目以降）

### エラーハンドリング
| エラーケース | 処理方法 | 実装状況 |
|-------------|---------|----------|
| Marpビルド失敗 | ワークフローを失敗させ、デプロイ中止 | ✅ 実装済み |
| Frontendビルド失敗 | ワークフローを失敗させ、デプロイ中止 | ✅ 実装済み |
| デプロイ失敗 | GitHub Actions標準通知 | ✅ 実装済み |
| npm ci失敗 | patch-package追加で解決 | ✅ 実装済み |

### セキュリティ
- **認証**: `GITHUB_TOKEN`（自動提供）
- **権限**: GitHub Actionsのwrite権限が必要
- **機密情報**: なし（静的サイトのみ）

## 重要な学び・試行錯誤の記録

### 試行1: 各ジョブで独立してnpm ci実行（失敗）
**エラー**: `patch-package: not found`（rollupのpostinstallスクリプト）

**原因**:
- `rollup`パッケージのpostinstallスクリプトが`patch-package`を実行しようとする
- `patch-package`が依存関係に含まれていないため、npm ciが失敗

**解決策**: ルートの`package.json`に`patch-package@^8.0.1`を追加

### 試行2: installジョブ + artifact経由でnode_modules共有（失敗）
**エラー**: `marp: not found`, `astro: not found`

**原因**:
1. シンボリックリンク（`node_modules/.bin/`）の破損
2. 実行権限の喪失
3. artifactの圧縮・展開プロセスでファイルメタデータが失われる

**学び**: GitHub Actionsのartifactは、`node_modules`のような複雑な構造には不向き

### 試行3: patch-package追加 + 各ジョブでnpm ci + npmキャッシュ（成功）
**変更内容**:
1. `package.json`に`"patch-package": "^8.0.1"`を追加
2. 各ジョブで`cache: 'npm'`オプションを使用
3. installジョブを削除し、各ビルドジョブで独立してnpm ciを実行

**成功の理由**:
- `patch-package`が利用可能になり、npm ciが成功
- シンボリックリンクや実行権限の問題を回避
- npmキャッシュにより、2回目以降のnpm ciは高速化

## 既知の制約・制限事項

### 技術的制約
- **Node.js**: 20.x以上
- **GitHub Actions実行時間**: 無料プランでは月2,000分
- **GitHub Pagesストレージ**: 1GB
- **出力先分離**: Frontendで`slides/`パスは使用不可（Marpが占有）

### 運用上の制約
- **デプロイタイミング**: mainブランチへのpush時のみ（手動トリガーなし）
- **デプロイ対象**: `application/marp/`, `application/frontend/`, `.github/workflows/deploy.yml` の変更のみ
- **docs/ の変更**: 計画・仕様書の変更時はデプロイをスキップ（v1.1で改善）
- **プレビュー環境**: なし（PRごとのプレビューは未実装）

## 今後の改善案

### 優先度：高
- [ ] プレビュー環境の構築（PRごとに一時的なプレビューサイトを生成）

### 優先度：中
- [ ] ビルドキャッシュの追加（Astroビルドキャッシュ、Marpテーマファイル）
- [ ] デプロイ通知の追加（Slack通知、ステータスバッジ）

### 優先度：低
- [ ] リンク切れチェックの自動化（デプロイ前）
- [ ] 並列度の向上（assetsコピーを別ジョブに分離）
- [ ] テストジョブの追加（並列実行）

## ベストプラクティス

### npm workspaceでのGitHub Actions設定

✅ **推奨**:
```yaml
jobs:
  build:
    - uses: actions/setup-node@v6
      with:
        node-version: '20'
        cache: 'npm'  # npmキャッシュを有効化
    - run: npm ci      # ルートでnpm ciを実行
    - run: npm run build --workspace=<workspace-name>
```

❌ **非推奨**:
```yaml
# 各ワークスペースで個別にnpm ciを実行
- run: npm ci --workspace=<workspace-name>  # 依存関係が正しく解決されない

# node_modulesをartifact化
- uses: actions/upload-artifact@v4
  with:
    path: node_modules/  # シンボリックリンクが壊れる
```

### 依存関係の明示的な定義

✅ **推奨**:
```json
{
  "devDependencies": {
    "patch-package": "^8.0.1"  // 間接的な依存も明示
  }
}
```

❌ **非推奨**:
```json
{
  "devDependencies": {
    // patch-packageを定義しない → rollupのpostinstallが失敗
  }
}
```

## 変更履歴

| 日付 | バージョン | 変更内容 | コミットハッシュ |
|------|-----------|---------|----------------|
| 2025-11-18 | 1.1 | パスフィルター追加（`docs/` 変更時のデプロイスキップ） | TBD |
| 2025-11-18 | 1.0 | 初版作成（実装・検証完了） | e0df2a8, 1c7c440, 5c27165, 98c1aa9 |

### 関連コミット
1. `98c1aa9` - fix: npm workspaceに対応したGitHub Actionsワークフローに修正
2. `5c27165` - fix: patch-packageを依存関係に追加してrollupのpostinstallエラーを解決
3. `1c7c440` - fix: npm ciを各ビルドジョブで実行するように修正
4. `e0df2a8` - docs: GitHub Pagesデプロイメントの最終ドキュメント更新と研究レビュー追加

## 関連ドキュメント

- **計画時の仕様書**: `docs/features/infra-github-pages-deployment/spec.md`
- **実装計画書**: `docs/features/infra-github-pages-deployment/plan.md`
- **検証レビュー**: `docs/research/github-pages-deployment-review.md`
- **ワークフローファイル**: `.github/workflows/deploy.yml`

## 参考資料

### 公式ドキュメント
- [GitHub Actions - Caching dependencies](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [GitHub Pages - Deployment](https://docs.github.com/en/pages)

### プロジェクト内資料
- プロジェクト全体ガイド: `CLAUDE.md`
- 3フェーズ開発ガイド: `docs/spec-based-development-guide.md`

---

**検証完了日**: 2025-11-18
**レビュー担当**: Claude Code
**最終ステータス**: ✅ 運用中
