# GitHub Pages デプロイメント実装計画書

## プロジェクト概要

### 目的
GitHub ActionsとGitHub Pagesを使用して、MarpプレゼンテーションとAstro製フロントエンドを自動ビルド・デプロイするCI/CDパイプラインを構築する。

### スコープ
- ✅ GitHub Actionsワークフローファイルの作成
- ✅ Marpスライドのビルド自動化
- ✅ Astroフロントエンドのビルド自動化
- ✅ assetsファイルのコピー
- ✅ GitHub Pagesへの自動デプロイ
- ❌ プレビュー環境の構築（将来的な拡張として残す）
- ❌ Slack通知（オプション機能）

### 前提条件
- リポジトリ: `Ryunosuke-Tanaka-sti/claude_and_blog_seminar`
- ブランチ: `main`ブランチへのpushをトリガーとする
- Node.js: 20.x
- パッケージマネージャー: npm

## 開発アプローチ

### 3フェーズ開発の適用
このプロジェクトは以下の3フェーズで進めます：

1. **計画フェーズ**（現在）
   - 仕様書の作成（`spec.md`）✓
   - 実装計画書の作成（`plan.md`）← 今ここ

2. **実装フェーズ**
   - GitHub Actionsワークフローファイルの作成
   - ビルドスクリプトの検証・調整
   - ローカルでのテスト実行

3. **検証フェーズ**
   - GitHub Actionsの実行確認
   - GitHub Pagesでの動作確認
   - リンク切れチェック
   - `docs/research/`に結果を記録

## 技術仕様サマリー

### 使用技術
| 技術 | バージョン | 用途 |
|------|-----------|------|
| GitHub Actions | - | CI/CDパイプライン |
| Node.js | 20.x | ビルド環境 |
| npm | 最新 | パッケージ管理 |
| Marp CLI | 4.x | スライド生成 |
| Astro | 4.x | フロントエンドビルド |
| GitHub Pages | - | ホスティング |

### デプロイフロー（npm workspace対応の並列ビルド）
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
│  dist/slides/*.html      │  dist/ (Astro出力)       │
│  dist/slides/assets/     │                          │
│  ↓                       │  ↓                       │
│  artifact: marp-dist     │  artifact: site-dist     │
└──────────────────────────┴──────────────────────────┘
              ↓                        ↓
              └────────┬───────────────┘
                       ↓
               Job: deploy (両方成功後)
                       ↓
         marp-dist → dist/slides/
         site-dist → dist/
                       ↓
            GitHub Pagesにデプロイ
                       ↓
                  公開完了
```

**最終アプローチの選択理由**:
- ✅ **各ジョブで独立してnpm ci実行**: シンボリックリンクや実行権限の問題を回避
- ✅ **npmキャッシュで高速化**: 2回目以降のnpm ciは高速（キャッシュヒット時）
- ✅ **並列ビルドでビルド時間短縮**: 2つのビルドジョブが同時実行
- ✅ **シンプルで保守しやすい**: 複雑なartifact管理が不要

**試行錯誤の結果（詳細は研究レビューを参照）**:
1. ❌ 各ジョブで独立してnpm ci → patch-packageエラー
2. ❌ installジョブでnpm ci + artifact共有 → シンボリックリンク/実行権限の問題
3. ✅ patch-package追加 + 各ジョブでnpm ci + npmキャッシュ → 成功

## 作成するファイルの詳細

### 1. `.github/workflows/deploy.yml`

**目的**: GitHub Pagesへのデプロイワークフロー（npm workspace対応の並列ビルド）

**ファイル構成**:
- ワークフロー名: `Deploy to GitHub Pages`
- トリガー: `main`ブランチへのpush
- ジョブ: `build-marp`, `build-site`, `deploy`の3つ

**Job 1: build-marp**
1. リポジトリのチェックアウト
2. Node.js 20.xのセットアップ（npmキャッシュ有効）
3. モノレポ全体の依存関係をインストール（`npm ci`）
4. Marpビルドの実行（`npm run build --workspace=application/marp`）
5. `application/marp/dist/`をartifactとしてアップロード（名前: `marp-dist`）

**Job 2: build-site**（build-marpと並列実行）
1. リポジトリのチェックアウト
2. Node.js 20.xのセットアップ（npmキャッシュ有効）
3. モノレポ全体の依存関係をインストール（`npm ci`）
4. Frontendビルドの実行（`npm run build --workspace=application/frontend`）
5. `application/frontend/dist/`をartifactとしてアップロード（名前: `site-dist`）

**Job 3: deploy**（build-marpとbuild-site成功後に実行）
1. `marp-dist` artifactをダウンロード → `dist/slides/`
2. `site-dist` artifactをダウンロード → `dist/`
3. 統合された`dist/`をGitHub Pagesにデプロイ

**環境変数**:
- `GITHUB_TOKEN`: 自動的に提供される（明示的な設定不要）

**成果物**:
- `dist/`ディレクトリ全体をGitHub Pagesにデプロイ
  - `dist/` - Frontendファイル
  - `dist/slides/` - Marpスライド

**エラーハンドリング**:
- 各ビルドジョブでエラー時に即座に失敗
- どちらかのビルドが失敗した場合、deployジョブは実行されない

### 2. `application/marp/package.json`の修正

**目的**: Marpビルドスクリプトの出力先を`dist/slides/`に変更

**変更内容**:
- 全てのビルドスクリプトの`--output ../../dist/`を`--output ../../dist/slides/`に変更
- assetsコピーコマンドを追加（または別スクリプトとして分離）

**例**:
```json
{
  "scripts": {
    "build:claude": "marp src/claude_seminar_slides.md --html --theme ./theme/github-dark.css --output ../../dist/slides/claude_seminar_slides.html",
    "copy:assets": "mkdir -p ../../dist/slides/assets && cp -r src/assets/* ../../dist/slides/assets/"
  }
}
```

### 3. `.github/workflows/`ディレクトリの作成

**目的**: GitHub Actionsワークフローファイルの配置場所

**作成方法**:
```bash
mkdir -p .github/workflows
```

## ビルド出力の検証計画

### 事前検証（ローカル環境）

#### 1. Marpビルドスクリプト変更後の検証
```bash
# distディレクトリをクリーンアップ
rm -rf dist/

# Marpビルド
npm run build:marp

# 確認: dist/slides/*.html が生成されているか
ls -la dist/slides/*.html

# 確認: dist/slides/assets/ がコピーされているか
ls -la dist/slides/assets/
```

**期待結果**:
- `dist/slides/`に全てのHTMLファイルが生成されている
- `dist/slides/assets/`に全てのアセットがコピーされている
- `dist/`直下にHTMLファイルが存在しない

#### 2. 並列ビルド後の統合検証
```bash
# distディレクトリをクリーンアップ
rm -rf dist/

# Marpビルド
npm run build:marp

# Frontendビルド
npm run build:frontend

# 確認: 最終的なディレクトリ構造
tree dist/ -L 2

# 期待される構造:
# dist/
# ├── index.html              (Frontendのトップページ)
# ├── _astro/                 (Astroの成果物)
# ├── (その他Frontendファイル)
# └── slides/                 (Marpスライド)
#     ├── *.html
#     └── assets/
```

**期待結果**:
- MarpとFrontendのファイルが完全に分離されている
- 上書きや競合が一切発生していない
- `dist/slides/`がそのまま残っている

#### 3. スライド内のアセットパス確認
Marpスライドから参照されているアセットのパスを確認：

```bash
# スライドHTMLを開いて画像パスを確認
grep -r "src=" dist/slides/*.html | grep assets
```

**期待されるパス**:
- `assets/diagram_*.svg` (相対パス)
- または `./assets/diagram_*.svg`

**確認ポイント**:
- パスが`dist/slides/assets/`を正しく指しているか
- `--allow-local-files`フラグで生成されたパスが適切か

### CI環境での検証

#### 1. ワークフロー実行確認
- GitHub Actionsのログを確認
- 各ステップが正常に完了しているか
- ビルド時間を記録（最適化の参考）

#### 2. デプロイ確認
- GitHub Pagesの設定を確認
- デプロイされたURLにアクセス
- 各ページが正しく表示されるか

#### 3. アセット読み込み確認
- ブラウザの開発者ツールでネットワークタブを確認
- 404エラーが発生していないか
- 画像・SVGが正しく読み込まれているか

## リスクと対策

### リスク1: npm workspace構成でのpatch-packageエラー
**影響度**: 高 → **解決済み**
**発生確率**: 高 → **0%**

**問題の詳細**:
- `rollup`パッケージのpostinstallスクリプトが`patch-package`を要求
- `patch-package`が依存関係に含まれていないため`npm ci`が失敗

**採用した対策**:
- ✅ ルートの`package.json`の`devDependencies`に`patch-package@^8.0.1`を追加

**残存リスク**: なし

### リスク1-2: node_modulesのartifact共有の問題
**影響度**: 高 → **解決済み**
**発生確率**: 高 → **0%**

**問題の詳細**:
- artifact経由で`node_modules`を共有すると以下の問題が発生:
  1. シンボリックリンク（`node_modules/.bin/`）が壊れる
  2. 実行権限が失われる
  3. `marp`/`astro`コマンドが見つからない

**採用した対策**:
- ✅ installジョブを削除し、各ビルドジョブで独立して`npm ci`を実行
- ✅ npmキャッシュ機能（`cache: 'npm'`）を使用して高速化

**残存リスク**: なし

### リスク2: MarpとAstroのビルド成果物が競合
**影響度**: 高 → **解決済み**
**発生確率**: 中 → **0%**

**採用した対策**:
- ✅ Marpの出力先を`dist/slides/`に変更
- ✅ 並列ビルド + artifact統合で完全に分離
- ✅ 出力先が完全に異なるため競合リスクなし

**残存リスク**: なし

### リスク3: `--allow-local-files`フラグがCI環境で動作しない
**影響度**: 高
**発生確率**: 低

**対策**:
- Marp CLIのドキュメントで`--allow-local-files`の動作を確認
- CI環境で相対パスが正しく解決されるか検証

**緊急時の対応**:
- アセットをBase64エンコードしてスライドに埋め込む
- アセットを絶対URLで参照するように変更

### リスク4: GitHub Pages の権限設定が不足
**影響度**: 中
**発生確率**: 低

**対策**:
- GitHub リポジトリの Settings > Pages を確認
- Actions の書き込み権限を確認
- `GITHUB_TOKEN`の権限スコープを確認

**緊急時の対応**:
- Personal Access Tokenを使用
- GitHub Pagesの設定をブランチベースに変更

### リスク5: ビルド時間が長すぎる
**影響度**: 低
**発生確率**: 中

**対策**:
- `node_modules`のキャッシュを有効化
- 並列ビルドを検討（可能であれば）

**緊急時の対応**:
- ビルドスクリプトを最適化
- 不要なビルドステップを削除

## 成功基準

### 必須条件（全て満たす必要がある）
- ✅ GitHub Actionsワークフローがエラーなく完了する
- ✅ `dist/`ディレクトリにMarpとFrontendの成果物が両方存在する
- ✅ GitHub Pagesでサイトが公開される
- ✅ フロントエンドページが正しく表示される
- ✅ 全てのMarpスライドが正しく表示される
- ✅ 画像・SVGアセットが全て正しく読み込まれる

### 推奨条件（可能な限り満たす）
- ✅ ビルド時間が5分以内
- ✅ `node_modules`のキャッシュが有効化されている
- ✅ デプロイ後にステータスバッジが更新される

### オプション条件（余裕があれば実装）
- ⭕ リンク切れチェックの自動化
- ⭕ プレビュー環境の構築（PRごと）
- ⭕ Slack通知の追加

## タスク分解

### Phase 1: Marpビルドスクリプトの変更（15分）
1. `application/marp/package.json`のビルドスクリプトを修正
   - 全ての`--output ../../dist/`を`--output ../../dist/slides/`に変更
2. assetsコピースクリプトの追加
3. ローカルでビルドテスト
4. `dist/slides/`の構造を確認

### Phase 2: `.github/workflows/`ディレクトリ作成（5分）
1. `.github/workflows/`ディレクトリを作成
2. ディレクトリが正しく作成されたか確認

### Phase 3: GitHub Actionsワークフローファイル作成（20分）
1. `.github/workflows/deploy.yml`を作成
2. `build-marp`ジョブを記述
   - Marpビルド
   - assetsコピー
   - artifactアップロード
3. `build-site`ジョブを記述
   - Frontendビルド
   - artifactアップロード
4. `deploy`ジョブを記述
   - 2つのartifactダウンロード
   - GitHub Pagesデプロイ

### Phase 4: ローカルビルド検証（10分）
1. `rm -rf dist/`でクリーンアップ
2. `npm run build:marp`実行
3. `npm run build:frontend`実行
4. `dist/`構造の確認（競合がないか）

### Phase 5: GitHub Actionsでの実行（15分）
1. 変更をコミット・プッシュ
2. GitHub Actionsの実行ログを確認
3. 各ジョブが並列実行されているか確認
4. エラーが発生した場合は修正

### Phase 6: GitHub Pages検証（15分）
1. GitHub Pagesの設定を確認
2. デプロイされたサイトにアクセス
3. Frontend（`/`）の動作確認
4. スライド（`/slides/*.html`）の動作確認
5. アセットの読み込み確認（`/slides/assets/`）

### Phase 7: ドキュメント作成（10分）
1. `docs/research/github-pages-deployment-review.md`を作成
2. 並列ビルドの効果を記録
3. 次回に活かせる改善点を記載

**合計想定時間**: 約90分（並列ビルド設定により若干増加）

## 検証計画詳細

### テストケース

#### TC-01: Marpビルドの検証
- **目的**: Marpスライドが正しくビルドされる
- **手順**:
  1. `npm run build:marp`を実行
  2. `dist/*.html`の存在を確認
  3. HTMLファイルを開いてスライドが表示されるか確認
- **合格基準**: 全てのスライドHTMLが生成され、正しく表示される

#### TC-02: Frontendビルドの検証
- **目的**: Astroフロントエンドが正しくビルドされる
- **手順**:
  1. `npm run build:frontend`を実行
  2. `dist/`の内容を確認
  3. `dist/index.html`を開いてページが表示されるか確認
- **合格基準**: Astroのビルドが成功し、ページが表示される

#### TC-03: ビルド成果物の分離確認
- **目的**: MarpとFrontendのビルド成果物が完全に分離されている
- **手順**:
  1. `rm -rf dist/`でクリーンアップ
  2. `npm run build:marp`を実行
  3. `npm run build:frontend`を実行
  4. `tree dist/ -L 2`でディレクトリ構造を確認
- **合格基準**:
  - `dist/slides/`にMarpスライドが存在
  - `dist/`直下にFrontendファイルが存在
  - 競合や上書きが一切発生していない

#### TC-04: assetsコピーの検証
- **目的**: アセットファイルが正しくコピーされる
- **手順**:
  1. `npm run build:marp`を実行（assetsコピーを含む）
  2. `dist/slides/assets/`の内容を確認
- **合格基準**: 全てのアセットファイルが`dist/slides/assets/`にコピーされている

#### TC-05: GitHub Actionsの並列実行確認
- **目的**: ワークフローが並列で実行され、エラーなく完了する
- **手順**:
  1. ワークフローファイルをpush
  2. GitHub Actionsのログを確認
  3. `build-marp`と`build-site`が並列実行されているか確認
  4. `deploy`ジョブが両方のジョブ完了後に実行されているか確認
- **合格基準**:
  - 全てのジョブが緑色（成功）
  - `build-marp`と`build-site`が同時に開始されている
  - `deploy`ジョブが最後に実行されている

#### TC-06: GitHub Pagesでの表示確認
- **目的**: デプロイされたサイトが正しく表示される
- **手順**:
  1. GitHub PagesのURLにアクセス
  2. フロントエンドページを確認
  3. 各Marpスライドにアクセス
  4. 画像・SVGの読み込みを確認
- **合格基準**: 全てのページが正しく表示され、アセットが読み込まれる

## 実装後のメンテナンス

### 定期的なチェック項目
- GitHub Actionsの実行ログを確認（週1回）
- ビルド時間の推移を監視（月1回）
- GitHub Pagesのストレージ使用量を確認（月1回）

### アップデート計画
- Node.jsバージョンのアップデート（年1回）
- 依存パッケージのアップデート（月1回）
- GitHub Actionsのバージョンアップデート（必要に応じて）

### トラブルシューティング手順
1. GitHub Actionsのログを確認
2. エラーメッセージから原因を特定
3. ローカル環境で再現を試みる
4. 修正してpush
5. 再度ワークフローを実行

## 参考資料

### 公式ドキュメント
- [GitHub Actions - Node.js](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)
- [GitHub Pages - Quickstart](https://docs.github.com/en/pages/quickstart)
- [Astro - Deployment Guide](https://docs.astro.build/en/guides/deploy/)

### 使用するActions（2025年最新版）
- `actions/checkout@v5` - リポジトリのチェックアウト（最新安定版）
- `actions/setup-node@v6` - Node.jsのセットアップ（runner v2.327.1以降が必要）
- `actions/upload-pages-artifact@v3` - GitHub Pages用アーティファクトのアップロード（Pages専用、最新版）
- `actions/deploy-pages@v4` - GitHub Pagesへのデプロイ（最新版）

**バージョン選定理由**:
- `checkout@v5`: 最新安定版、v6-betaは除外
- `setup-node@v6`: Node.js 24対応、最新版（2025年推奨）
- `upload-pages-artifact@v3`: Pages専用の最新版（一般のartifact actionsとは別系統）
- `deploy-pages@v4`: 2025年1月以降の必須バージョン

または

- `peaceiris/actions-gh-pages@v4` - GitHub Pagesへのデプロイ（代替案）

### プロジェクト内資料
- 仕様書: `docs/features/infra-github-pages-deployment/spec.md`
- プロジェクトガイド: `CLAUDE.md`
- ビルドスクリプト: `package.json`, `application/marp/package.json`, `application/frontend/package.json`

## 次のステップ

計画フェーズ完了後の流れ：

1. **レビュー**
   - この計画書をレビュー
   - 不明点や問題点を洗い出す

2. **実装フェーズへ移行**
   - Claude Codeに実装を依頼：
   ```
   以下の仕様書と計画書を読み込んで実装してください：
   @docs/features/infra-github-pages-deployment/spec.md
   @docs/features/infra-github-pages-deployment/plan.md

   実装方針：
   - GitHub Actionsのベストプラクティスに従う
   - エラーハンドリングを適切に実装
   - コメントで各ステップの目的を記載
   ```

3. **検証フェーズ**
   - テストケースに従って検証
   - 結果を`docs/research/`に記録

---

## 計画書レビューチェックリスト

実装前に以下を確認してください：

- [x] プロジェクト概要が明確か
- [x] 技術仕様が具体的か
- [x] 作成するファイルが明確に定義されているか
- [x] リスクと対策が検討されているか
- [x] 成功基準が測定可能か
- [x] タスク分解が適切か
- [x] 検証計画が具体的か
- [x] 実装の詳細（具体的なYAMLコード）を書いていないか ✓
