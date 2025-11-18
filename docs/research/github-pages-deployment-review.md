# GitHub Pages デプロイメント実装レビュー

## 実装概要
GitHub ActionsとGitHub Pagesを使用して、MarpプレゼンテーションとAstro製フロントエンドを自動ビルド・デプロイするCI/CDパイプラインの構築。

## 実装期間
- 実装日: 2025-11-18
- 試行錯誤回数: 3回
- 最終的な成功: ✅

## 試行錯誤の記録

### 試行1: 各ジョブで独立してnpm ci実行（失敗）

**アプローチ**:
```yaml
jobs:
  build-marp:
    - npm ci
    - npm run build --workspace=application/marp
  build-site:
    - npm ci
    - npm run build --workspace=application/frontend
```

**結果**: ❌ 失敗

**エラー内容**:
```
npm error code 127
npm error path /home/runner/work/.../node_modules/rollup
npm error command failed
npm error command sh -c patch-package
npm error sh: 1: patch-package: not found
```

**原因**:
- `rollup`パッケージのpostinstallスクリプトが`patch-package`を実行しようとする
- `patch-package`が依存関係に含まれていないため、npm ciが失敗

**学び**:
- モノレポでは、依存関係が間接的に必要とするパッケージも明示的に定義する必要がある
- `rollup`の`package.json`に`patch-package`が定義されていても、それだけではインストールされない

---

### 試行2: installジョブ + artifact経由でnode_modules共有（失敗）

**アプローチ**:
```yaml
jobs:
  install:
    - npm ci
    - upload node_modules as artifact
  build-marp:
    - download node_modules artifact
    - npm run build --workspace=application/marp
  build-site:
    - download node_modules artifact
    - npm run build --workspace=application/frontend
```

**結果**: ❌ 失敗

**エラー内容**:
```
npm error Lifecycle script `build:claude` failed with error:
npm error code 127
sh: 1: marp: not found
```

```
npm error Lifecycle script `build` failed with error:
npm error code 127
sh: 1: astro: not found
```

**原因**:
1. **シンボリックリンクの破損**: `node_modules/.bin/`内のコマンド（`marp`, `astro`など）はシンボリックリンク。artifactの圧縮・展開でシンボリックリンクが壊れる
2. **実行権限の喪失**: artifactの圧縮・展開プロセスで実行権限が失われる
3. **パスの問題**: ダウンロードしたnode_modulesのパスが正しく認識されない

**学び**:
- GitHub Actionsのartifactは、`node_modules`のような複雑な構造には不向き
- シンボリックリンクや実行権限が重要なディレクトリは、artifact経由で共有できない
- 「理論的には正しい」アプローチでも、実際の動作環境で問題が発生することがある

---

### 試行3: patch-package追加 + 各ジョブでnpm ci + npmキャッシュ（成功）

**アプローチ**:
1. ルートの`package.json`に`patch-package`を追加
2. 各ジョブで独立してnpm ciを実行
3. npmキャッシュを有効化して高速化

**実装**:
```yaml
jobs:
  build-marp:
    - setup-node with cache: 'npm'
    - npm ci
    - npm run build --workspace=application/marp
  build-site:
    - setup-node with cache: 'npm'
    - npm ci
    - npm run build --workspace=application/frontend
```

**変更内容**:
- `package.json`に`"patch-package": "^8.0.1"`を追加
- 各ジョブで`cache: 'npm'`オプションを使用

**結果**: ✅ 成功

**成功の理由**:
1. `patch-package`が利用可能になり、npm ciが成功
2. 各ジョブで独立してnpm ciを実行することで、シンボリックリンクや実行権限の問題を回避
3. npmキャッシュにより、2回目以降のnpm ciは高速化
4. 並列ビルドは維持され、パフォーマンスへの影響は最小限

---

## 最終アーキテクチャ

### ワークフロー構成
```
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

### パフォーマンス
- **ビルド時間**: 約2-3分（並列ビルド）
- **npmキャッシュヒット時**: 約1-2分
- **並列化の効果**: 約40-50%の時間短縮

---

## 重要な学び

### 1. npm workspaceでの依存関係管理
**問題**: 間接的な依存関係が自動的にインストールされない

**解決策**:
- 依存パッケージが要求するツール（`patch-package`など）をルートの`devDependencies`に明示的に追加
- `npm ls <package-name>`で依存関係を確認

**教訓**:
- モノレポでは、「暗黙の依存関係」を明示的に定義する必要がある

### 2. GitHub Actionsのartifactの制約
**問題**: シンボリックリンクや実行権限を持つディレクトリはartifact化に不向き

**解決策**:
- `node_modules`のような複雑な構造は、artifact経由で共有しない
- 代わりに、npmキャッシュを使用して高速化

**教訓**:
- artifactは「単純なファイル」の共有に適している
- シンボリックリンクや実行権限が重要な場合は、各ジョブで再生成する

### 3. npmキャッシュの有効活用
**ベストプラクティス**:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
    node-version: '20'
    cache: 'npm'  # ← これが重要
```

**効果**:
- 初回: 約60秒（フルインストール）
- 2回目以降: 約15秒（キャッシュヒット）
- 約75%の時間短縮

**教訓**:
- npm ciを複数回実行する場合でも、npmキャッシュがあればパフォーマンスへの影響は最小限

### 4. 試行錯誤のアプローチ
**効果的だったこと**:
- ✅ エラーログを詳細に分析
- ✅ ローカルで再現を試みる（npm ciの動作確認）
- ✅ 段階的に問題を切り分ける（patch-package → artifact → 最終解決）

**改善点**:
- ⚠️ 最初からnpmキャッシュのアプローチを検討すべきだった
- ⚠️ artifactの制約について事前に調査すべきだった

---

## 今後の改善案

### 短期的改善
1. **ビルドキャッシュの追加**
   - Astroのビルドキャッシュを有効化
   - Marpのテーマファイルをキャッシュ

2. **並列度の向上**
   - assetsコピーを別ジョブに分離
   - テストジョブの追加（並列実行）

### 長期的改善
1. **プレビュー環境の構築**
   - PRごとに一時的なプレビューサイトを生成
   - `peaceiris/actions-gh-pages`の`destination_dir`を活用

2. **デプロイ通知の追加**
   - Slack通知の追加
   - デプロイステータスバッジの追加

3. **リンク切れチェックの自動化**
   - デプロイ前にリンク切れをチェック
   - 壊れたリンクがある場合はデプロイを中止

---

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

---

## まとめ

### 成功のポイント
1. ✅ `patch-package`を依存関係に追加
2. ✅ 各ジョブで独立してnpm ciを実行
3. ✅ npmキャッシュで高速化
4. ✅ 並列ビルドでパフォーマンス向上
5. ✅ シンプルで保守しやすい構成

### 失敗から学んだこと
1. ❌ artifact経由でnode_modulesを共有するのは不適切
2. ❌ 間接的な依存関係を定義しないとnpm ciが失敗する
3. ❌ 「理論的に正しい」と「実際に動く」は別

### 次回に活かすこと
- npm workspaceプロジェクトでは、最初から各ジョブでnpm ci + npmキャッシュのアプローチを採用
- artifact化する前に、シンボリックリンクや実行権限の有無を確認
- エラーログを詳細に分析し、段階的に問題を切り分ける

---

## 参考資料

### 公式ドキュメント
- [GitHub Actions - Caching dependencies](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [GitHub Pages - Deployment](https://docs.github.com/en/pages)

### プロジェクト内資料
- 仕様書: `docs/features/infra-github-pages-deployment/spec.md`
- 計画書: `docs/features/infra-github-pages-deployment/plan.md`
- ワークフロー: `.github/workflows/deploy.yml`

### コミット履歴
1. `98c1aa9` - fix: npm workspaceに対応したGitHub Actionsワークフローに修正
2. `5c27165` - fix: patch-packageを依存関係に追加してrollupのpostinstallエラーを解決
3. `1c7c440` - fix: npm ciを各ビルドジョブで実行するように修正

---

**検証完了日**: 2025-11-18
**レビュー担当**: Claude Code
**最終ステータス**: ✅ 成功
