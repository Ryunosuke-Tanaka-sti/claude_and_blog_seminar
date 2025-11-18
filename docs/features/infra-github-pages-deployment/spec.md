# GitHub Pages デプロイメント仕様書

## 概要
GitHub ActionsとGitHub Pagesを使用して、MarpプレゼンテーションとAstro製フロントエンドを自動ビルド・デプロイするCI/CDパイプラインを構築します。

## 背景・課題

### 現状の問題
- Marpとfrontendの2つのワークスペースが存在するが、統合されたデプロイ仕組みがない
- 手動でビルドを実行する必要があり、ヒューマンエラーのリスクがある
- ビルド成果物の管理が煩雑
- GitHub Pagesへの公開手順が自動化されていない

### 解決したい課題
1. **frontendのビルド**: Astro製のWebサイトをビルド
2. **marpのビルド**: Markdownスライドを HTML に変換
3. **assetsのコピー**: Marpが参照する画像・SVGファイルを適切な場所に配置
4. **2つのビルドの連携**: frontendとmarpのビルド成果物を統合
5. **GitHub Pagesへの自動デプロイ**: mainブランチへのpush時に自動公開

## ツールの目的
GitHub Actionsワークフローを使用して、以下を自動化：
- Marpスライドのビルド（`application/marp/` → `dist/*.html`）
- Astroフロントエンドのビルド（`application/frontend/` → `dist/`）
- assetsファイルのコピー（`application/marp/src/assets/` → `dist/assets/`）
- ビルド成果物のGitHub Pagesへのデプロイ

## 現状のプロジェクト構成

### リポジトリ情報
- **リポジトリ**: `Ryunosuke-Tanaka-sti/claude_and_blog_seminar`
- **モノレポ構成**: npm workspaces
- **ワークスペース**:
  - `application/marp` - プレゼンテーションスライド
  - `application/frontend` - Webサイト
  - `application/tools` - ユーティリティツール

### ビルドスクリプト（package.json）
```json
{
  "scripts": {
    "build": "npm run build:marp && npm run build:frontend",
    "build:marp": "npm run build --workspace=application/marp",
    "build:frontend": "npm run build --workspace=application/frontend"
  }
}
```

### Marpビルドスクリプト（application/marp/package.json）
```json
{
  "scripts": {
    "build": "npm run build:all",
    "build:all": "npm run build:claude && npm run build:notion && ...",
    "build:claude": "marp src/claude_seminar_slides.md --html --theme ./theme/github-dark.css --output ../../dist/claude_seminar_slides.html",
    "build:voice": "marp src/voice_writing_seminar.md --html --theme ./theme/github-dark.css --output ../../dist/voice_writing_seminar.html --allow-local-files"
  }
}
```

**重要**: Marpビルドは`--allow-local-files`フラグを使用してローカルアセットを参照

### Frontendビルドスクリプト（application/frontend/package.json）
```json
{
  "scripts": {
    "build": "astro check && astro build"
  }
}
```

### ビルド出力ディレクトリ
- **共通出力先**: `/dist/`（リポジトリルート）
- **Marp出力**: `dist/*.html`（個別のHTMLファイル）
- **Frontend出力**: `dist/`（Astroのビルド成果物）
- **Assets**: `application/marp/src/assets/`（画像・SVG）

## 技術要件

### GitHub Actions要件
- **トリガー**: `main`ブランチへのpush
- **Node.jsバージョン**: 20.x（LTS）
- **パッケージマネージャー**: npm
- **キャッシュ**: `node_modules`をキャッシュして高速化

### ビルド戦略：npm workspace対応の並列ビルド + Artifact統合

**採用アプローチ**: モノレポの依存関係を正しく解決し、並列ビルドでパフォーマンスを向上

**ビルドフロー**:
```
Job: install
    ↓
ルートでnpm ci（モノレポ全体の依存関係）
    ↓
node_modulesをartifactにアップロード
    ↓
┌─────────────────┬─────────────────┐
│  Job: build-marp │ Job: build-site │ (並列実行)
│                  │                 │
│ node_modules     │ node_modules    │
│ ダウンロード     │ ダウンロード    │
│ ↓                │ ↓               │
│ Marpビルド       │ Frontendビルド  │
│ ↓                │ ↓               │
│ dist/slides/     │ dist/           │
└─────────────────┴─────────────────┘
    ↓                    ↓
  artifact          artifact
  (marp-dist)       (site-dist)
         ↓                ↓
      Job: deploy (成果物統合)
              ↓
         GitHub Pages
```

### 成果物の配置
- **Marp出力**: `dist/slides/*.html` + `dist/slides/assets/`
- **Frontend出力**: `dist/` (ルート)

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
        ├── 5つのポイント.svg
        ├── PDCA.svg
        ├── QR_blog.png
        ├── blog_logo.webp
        ├── diagram_3phase_flow.svg
        ├── diagram_automation_pipeline.svg
        ├── diagram_before_after.svg
        ├── diagram_role_division.svg
        ├── failure_success.svg
        ├── next_steps.svg
        ├── profile.png
        ├── quality_comparison.svg
        ├── success_points.svg
        ├── summary_benefits.svg
        ├── troubleshooting-guide.svg
        ├── voice_benefits.svg
        ├── voice_comparison.svg
        ├── voice_topic.svg
        ├── voice_workflow.svg
        ├── 全体フェーズ.svg
        └── 従来の手法との比較.svg
```

**アクセスURL例**:
- Frontend: `https://ryunosuke-tanaka-sti.github.io/claude_and_blog_seminar/`
- スライド1: `https://ryunosuke-tanaka-sti.github.io/claude_and_blog_seminar/slides/claude_seminar_slides.html`
- スライド2: `https://ryunosuke-tanaka-sti.github.io/claude_and_blog_seminar/slides/voice_writing_seminar.html`

### npm workspace対応と競合の回避
- ✅ **依存関係の正しい解決**: ルートで一度だけ`npm ci`を実行してモノレポ全体の依存関係を解決
- ✅ **並列ビルド**: MarpとFrontendを同時実行し、ビルド時間を短縮
- ✅ **出力先分離**: Marpは`dist/slides/`、Frontendは`dist/`で競合なし
- ✅ **Artifact統合**: デプロイジョブで2つのartifactを統合
- ⚠️ **制約**: Frontendで`slides/`というパスは使用不可（Marpが占有）

## GitHub Pagesの設定

### デプロイ先
- **URL**: `https://ryunosuke-tanaka-sti.github.io/claude_and_blog_seminar/`
- **ソース**: GitHub Actions
- **ブランチ**: `gh-pages`または Actions による自動デプロイ

### 必要な権限設定
GitHub リポジトリの Settings で以下を確認：
- **Pages**: GitHub Pages を有効化
- **Actions**: workflow の write 権限を有効化
- **GITHUB_TOKEN**: デフォルトトークンでデプロイ可能か確認

## ワークフロー仕様

### ワークフローファイル
- **ファイルパス**: `.github/workflows/deploy.yml`
- **名前**: `Deploy to GitHub Pages`

### ジョブ構成

#### Job 1: install（依存関係のインストール）
1. リポジトリをチェックアウト
2. Node.js 20.x をセットアップ（npmキャッシュ有効）
3. モノレポ全体の依存関係をインストール（`npm ci`）
4. `node_modules/`をartifactとしてアップロード

**Artifact名**: `node-modules`

**重要**: npm workspaceでは、ルートで一度だけ`npm ci`を実行することで、すべてのワークスペースの依存関係が正しく解決されます。

#### Job 2: build-marp（Marpスライドビルド）
1. リポジトリをチェックアウト
2. Node.js 20.x をセットアップ
3. `node-modules` artifactをダウンロード
4. Marpスライドをビルド（`npm run build --workspace=application/marp`）
5. ビルド成果物（`application/marp/dist/`）をartifactとしてアップロード

**Artifact名**: `marp-dist`
**依存関係**: `install`ジョブの成功後に実行

#### Job 3: build-site（Frontendビルド）
1. リポジトリをチェックアウト
2. Node.js 20.x をセットアップ
3. `node-modules` artifactをダウンロード
4. Astro Frontendをビルド（`npm run build --workspace=application/frontend`）
5. ビルド成果物（`application/frontend/dist/`）をartifactとしてアップロード

**Artifact名**: `site-dist`
**依存関係**: `install`ジョブの成功後に実行

**注意**: build-marpとbuild-siteは並列実行される（どちらもinstallジョブに依存）

#### Job 4: deploy（統合とデプロイ）
1. `marp-dist` artifactをダウンロード → `dist/slides/`
2. `site-dist` artifactをダウンロード → `dist/`
3. 統合された`dist/`ディレクトリをGitHub Pagesにデプロイ

**依存関係**: `build-marp`と`build-site`の両方が成功した場合のみ実行

### エラーハンドリング
- ビルドエラー時はワークフローを失敗させる
- デプロイエラー時は通知を送る（GitHub Actionsの標準通知）
- 各ステップでエラーログを出力

## 検証計画

### ビルド検証
1. **Marpビルドスクリプトの変更確認**：
   - `application/marp/package.json`のビルドスクリプトが`dist/slides/`に出力するよう変更されているか
   - assetsが`dist/slides/assets/`にコピーされるか

2. **ローカルでのビルド確認**：
   ```bash
   # Marpビルド
   npm run build:marp
   # 確認: dist/slides/*.html が存在するか
   ls -la dist/slides/

   # Frontendビルド
   npm run build:frontend
   # 確認: dist/ に Astroの成果物が存在するか
   ls -la dist/

   # 確認: 競合していないか
   ls -la dist/slides/  # Marpファイルが残っているか
   ```

3. **最終的なディレクトリ構造の確認**：
   ```
   dist/
   ├── index.html              # Frontend
   ├── (Frontendのファイル)
   └── slides/                 # Marp
       ├── *.html
       └── assets/
   ```

### デプロイ検証
1. GitHub Actionsワークフローが正常に実行されるか
2. GitHub Pagesでサイトが公開されるか
3. 各ページが正しく表示されるか：
   - フロントエンドページ
   - Marpスライド（リンク切れがないか）
   - 画像・SVGアセット（表示されるか）

### 合格基準
- ✅ GitHub Actionsワークフローがエラーなく完了
- ✅ GitHub PagesでWebサイトが公開される
- ✅ フロントエンドページが正しく表示される
- ✅ 全てのMarpスライドが正しく表示される
- ✅ 画像・SVGアセットが全て正しく読み込まれる
- ✅ リンク切れが存在しない

## セキュリティ考慮事項

### GitHub Token
- `GITHUB_TOKEN`を使用（自動的に提供される）
- Personal Access Tokenは不要（Actionsのデフォルトトークンを使用）

### 機密情報
- `.env`ファイルは含めない
- APIキーなどの機密情報は含まれていない（静的サイトのみ）

## 制約事項

### 技術的制約
- Node.js 20.x以上
- GitHub Actions の実行時間制限（無料プランでは月2,000分）
- GitHub Pages のストレージ制限（1GB）

### 既存コードとの互換性
- ルートの`package.json`スクリプトは変更しない
- **Marpの`package.json`**: ビルドスクリプトの出力先を`../../dist/`から`../../dist/slides/`に変更
- **Frontendの`package.json`**: 変更なし（`dist/`に出力）
- ローカル開発環境に影響を与えない

## 実装時の優先度

### 🔴 必須
- GitHub Actionsワークフローの作成
- Marpビルドの実行
- Frontendビルドの実行
- GitHub Pagesへのデプロイ

### 🟡 推奨
- assetsディレクトリのコピー
- ビルドキャッシュの設定
- デプロイ前のリンクチェック

### 🟢 オプション
- プレビュー環境の構築（PRごと）
- Slack通知の追加
- デプロイ履歴の記録

## 参考資料
- [GitHub Actions公式ドキュメント](https://docs.github.com/en/actions)
- [GitHub Pages公式ドキュメント](https://docs.github.com/en/pages)
- [actions/deploy-pages](https://github.com/actions/deploy-pages)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

## 備考

### Marpのアセット参照について
Marpスライドは`--allow-local-files`フラグを使用してローカルアセットを参照しています。
GitHub Pagesにデプロイする際、相対パスが正しく解決されるか検証が必要です。

### ビルド出力の競合について
MarpとAstroの両方が`dist/`に出力するため、実装時に以下を検証：
1. ビルド順序によって上書きされないか
2. 必要に応じてMarpの出力先を`dist/slides/`に変更
3. Frontendから Marpスライドへのリンクを適切に設定

---

## 仕様書レビューチェックリスト

実装前に以下を確認してください：

- [x] 現状のプロジェクト構成が明確に記述されているか
- [x] ビルド順序が明確に定義されているか
- [x] 成果物の統合方法が検討されているか
- [x] GitHub Pagesの設定要件が明確か
- [x] 検証計画が具体的か
- [x] エラーハンドリングが考慮されているか
- [x] セキュリティ考慮事項が記載されているか
- [x] 実装の詳細（具体的なYAML記述）を書いていないか ✓
