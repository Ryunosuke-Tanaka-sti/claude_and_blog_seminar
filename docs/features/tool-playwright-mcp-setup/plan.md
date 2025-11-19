# Playwright MCP セットアップ実装計画書

## プロジェクト概要

### 目的
DevContainer環境でPlaywright MCPをnpx方式で構成し、Claude CodeからWebブラウザ自動化機能を利用可能にする。

### スコープ
- ✅ 環境確認（Node.js, npm, npxバージョンチェック）
- ✅ `.mcp.json`の作成または更新
- ✅ Chromiumブラウザエンジンのインストール
- ✅ `.gitignore`の更新
- ✅ VSCodeリロード手順の案内
- ✅ 動作確認テストの実施
- ❌ 他のブラウザ（Firefox, WebKit）のインストール（オプション）
- ❌ トレース・ビデオ録画機能の設定（オプション）

### 前提条件
- DevContainer: Node.js 20 base image
- Claude Code: VSCode拡張機能インストール済み
- インターネット接続: Chromiumダウンロード用
- ディスク空き容量: 最低500MB

## 開発アプローチ

### 3フェーズ開発の適用
このプロジェクトは以下の3フェーズで進めます：

1. **計画フェーズ**（完了）
   - 仕様書の作成（`spec.md`）✓
   - 実装計画書の作成（`plan.md`）✓

2. **実装フェーズ**
   - 環境確認の実施
   - `.mcp.json`ファイルの作成または更新
   - Chromiumブラウザのインストール
   - `.gitignore`の更新
   - セットアップ完了の確認

3. **検証フェーズ**
   - VSCodeリロード
   - Claude CodeでPlaywright MCPツール認識確認
   - テストURL（`https://example.com`）でのナビゲーションテスト
   - スクリーンショット取得テスト
   - `docs/research/`に結果を記録

## 技術仕様サマリー

### 使用技術
| 技術 | バージョン | 用途 |
|------|-----------|------|
| Node.js | v20以上 | 実行環境 |
| npm | v10以上 | パッケージ管理 |
| npx | v10以上 | Playwright MCP起動 |
| @playwright/mcp | latest | MCPサーバー |
| Chromium | 最新（自動） | ブラウザエンジン |

### セットアップフロー
```
環境確認
  ↓
Node.js v20以上 & npm v10以上
  ↓
.mcp.json存在確認
  ↓
┌───────────────────────┬───────────────────────┐
│ 存在しない            │ 存在する              │
│  ↓                    │  ↓                    │
│ 新規作成              │ playwriteエントリ追加 │
└───────────────────────┴───────────────────────┘
  ↓
.mcp.json保存
  ↓
Chromiumインストール
  ↓
npx playwright install chromium
  ↓
~/.cache/ms-playwright/chromium-xxxx/
  ↓
.gitignore更新
  ↓
セットアップ完了
  ↓
ユーザーにVSCodeリロードを案内
  ↓
動作確認テスト実施
```

## 作成するファイルの詳細

### 1. `.mcp.json`

**ファイルパス**: `/home/node/workspace/.mcp.json`

**役割**: Claude CodeがPlaywright MCPサーバーを認識し、起動するための設定

**内容**:
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless", "--isolated"]
    }
  }
}
```

**設定パラメータの説明**:
- `type: "stdio"`: 標準入出力通信（Claude Codeとの統合方式）
- `command: "npx"`: グローバルインストール不要、常に最新を使用
- `@playwright/mcp@latest`: 開発環境用（最新版自動取得）
- `--headless`: DevContainer環境でGUI不要
- `--isolated`: プロファイルロック問題の回避、複数セッション対応

**既存設定がある場合の処理**:
- JSONを読み込んでパース
- `mcpServers`オブジェクトに`playwright`エントリを追加
- 既存の他のMCPサーバー設定は保持

### 2. `.gitignore`（更新）

**ファイルパス**: `/home/node/workspace/.gitignore`

**役割**: Playwright MCP関連のキャッシュ・一時ファイルをVCS対象外化

**追加内容**:
```gitignore
# Playwright MCP
.playwright-mcp/
.playwright-auth/
*.webm
trace.zip
```

**各項目の説明**:
- `.playwright-mcp/`: スクリーンショット、ビデオ録画の保存先
- `.playwright-auth/`: 認証情報（Cookieなど）の保存先
- `*.webm`: ビデオ録画ファイル
- `trace.zip`: デバッグトレースファイル

### 3. Chromiumブラウザエンジン

**インストール先**: `~/.cache/ms-playwright/chromium-1194/`（バージョン番号は変動）

**インストールコマンド**:
```bash
npx playwright install chromium
```

**ダウンロードサイズ**: 約173MB

**インストール時間**: 30秒〜2分（ネットワーク速度による）

## タスク分割

### タスク1: 環境確認
**所要時間**: 1分

**実施内容**:
```bash
node --version  # v20.x.x以上を確認
npm --version   # 10.x.x以上を確認
npx --version   # 10.x.x以上を確認
```

**合格基準**:
- Node.js v20以上
- npm v10以上
- npx v10以上

**エラー時の対応**:
- バージョン不足の場合: エラーメッセージを表示して終了
- DevContainer設定の確認を案内

### タスク2: `.mcp.json`作成または更新
**所要時間**: 2分

**実施内容**:
1. `.mcp.json`の存在確認
2. 存在しない場合: 新規作成
3. 存在する場合: JSON読み込み → `playwright`エントリ追加
4. ファイル保存

**合格基準**:
- `.mcp.json`が正しいJSON形式である
- `mcpServers.playwright`エントリが存在する
- `--headless`, `--isolated`フラグが設定されている

**エラー時の対応**:
- JSON構文エラー: バックアップ作成 → 上書き提案
- 書き込み権限エラー: エラーメッセージ表示 → 権限確認を案内

### タスク3: Chromiumブラウザインストール
**所要時間**: 2分

**実施内容**:
```bash
npx playwright install chromium
```

**合格基準**:
- `~/.cache/ms-playwright/chromium-xxxx/`が存在する
- `chrome-linux/chrome`実行ファイルが存在する
- インストール成功メッセージが表示される

**エラー時の対応**:
- ネットワークエラー: 再試行を提案
- 依存関係不足: `npx playwright install-deps chromium`を実行
- ディスク容量不足: 容量確保を案内

### タスク4: `.gitignore`更新
**所要時間**: 1分

**実施内容**:
1. `.gitignore`の存在確認
2. Playwright関連の除外設定を追記
3. ファイル保存

**合格基準**:
- `.gitignore`に以下が含まれる:
  - `.playwright-mcp/`
  - `.playwright-auth/`
  - `*.webm`
  - `trace.zip`

**エラー時の対応**:
- 書き込み失敗: 警告を表示して継続（セットアップは完了とみなす）

### タスク5: セットアップ完了確認とユーザー案内
**所要時間**: 1分

**実施内容**:
1. セットアップ成功メッセージの表示
2. VSCodeリロード手順の案内
3. 動作確認テスト方法の提示

**合格基準**:
- ユーザーに以下を案内:
  - VSCodeリロード方法（`Cmd/Ctrl + Shift + P` → "Developer: Reload Window"）
  - 動作確認テストプロンプト

## 検証計画

### 検証項目1: ファイル作成確認
**確認方法**:
```bash
# .mcp.json存在確認
cat .mcp.json

# .gitignore更新確認
grep -A 4 "# Playwright MCP" .gitignore

# Chromiumインストール確認
npx playwright install --list
```

**合格基準**:
- `.mcp.json`が正しく作成されている
- `.gitignore`にPlaywright関連設定が追加されている
- Chromiumがインストール済みと表示される

### 検証項目2: Claude Code統合確認
**確認方法**:
1. VSCodeをリロード
2. Claude Codeパネルを開く
3. 利用可能なツール一覧を確認

**合格基準**:
- Playwright MCPツールが認識されている
- エラーログが出力されていない

### 検証項目3: 基本動作テスト
**テストプロンプト**:
```
Playwright MCPを使用して、https://example.com を開いてページタイトルを取得してください
```

**期待される結果**:
- ナビゲーション成功
- ページタイトル: "Example Domain"
- スナップショット取得成功

**合格基準**:
- エラーなく実行完了
- 正しいタイトルが取得される
- スクリーンショットが生成される（オプション）

### 検証項目4: スクリーンショット取得テスト
**テストプロンプト**:
```
https://playwright.dev を開いて、スクリーンショットを取得してください
```

**期待される結果**:
- スクリーンショット保存: `.playwright-mcp/screenshot.png`
- ファイルサイズ: 約50KB以上

**合格基準**:
- スクリーンショットファイルが生成される
- 画像が正常に表示できる

## リスクと対策

### リスク1: プロファイルロックエラー
**発生条件**: 複数のブラウザセッションが同時に起動

**エラーメッセージ**:
```
Error: Browser is already in use for /home/node/.cache/ms-playwright/mcp-chrome-XXXXX
```

**対策**:
- `--isolated`フラグを設定（事前対策）
- エラー発生時: キャッシュクリア手順を案内
```bash
rm -rf ~/.cache/ms-playwright/mcp-chrome-*
```

### リスク2: Chromiumインストール失敗
**発生条件**: ネットワークエラー、依存関係不足

**対策**:
- 再試行を提案
- 依存関係インストール:
```bash
npx playwright install-deps chromium
```

### リスク3: JSON構文エラー
**発生条件**: 既存の`.mcp.json`が不正

**対策**:
- バックアップ作成（`.mcp.json.backup`）
- 新しい設定で上書き提案
- ユーザーに確認を求める

### リスク4: ディスク容量不足
**発生条件**: Chromiumインストール時（173MB必要）

**対策**:
- 事前に容量確認
```bash
df -h /home/node/.cache/
```
- 容量不足時: 不要ファイルの削除を案内

## 成功基準

### 必須条件
- ✅ `.mcp.json`が正しく作成されている
- ✅ Chromiumがインストールされている
- ✅ `.gitignore`が更新されている
- ✅ Claude CodeでPlaywright MCPが認識される
- ✅ `https://example.com`へのナビゲーションが成功する

### 推奨条件
- ✅ スクリーンショット取得が成功する
- ✅ プロファイルロックエラーが発生しない
- ✅ セットアップが5分以内に完了する

### オプション条件
- 🟢 トレース機能が利用可能
- 🟢 ビデオ録画機能が利用可能
- 🟢 複数ブラウザセッションが並行動作する

## タイムライン

| フェーズ | タスク | 所要時間 | 累積時間 |
|---------|-------|---------|---------|
| 実装 | 環境確認 | 1分 | 1分 |
| 実装 | `.mcp.json`作成 | 2分 | 3分 |
| 実装 | Chromiumインストール | 2分 | 5分 |
| 実装 | `.gitignore`更新 | 1分 | 6分 |
| 実装 | ユーザー案内 | 1分 | 7分 |
| 検証 | VSCodeリロード | 30秒 | 7分30秒 |
| 検証 | 基本動作テスト | 1分 | 8分30秒 |
| 検証 | スクリーンショットテスト | 1分 | 9分30秒 |
| 検証 | レビュー記録 | 5分 | 14分30秒 |

**合計**: 約15分（初回セットアップ）

## 次のステップ

### 実装フェーズ移行時の依頼内容
```
以下の仕様書を読み込んでPlaywright MCPをセットアップしてください：
@docs/features/tool-playwright-mcp-setup/spec.md

実装方針：
- 環境確認を最初に実施
- 既存の.mcp.json設定は保持して追加
- エラーハンドリングを適切に実装
- セットアップ完了後、動作確認方法をユーザーに案内
```

### 検証フェーズでの記録内容
検証完了後、`docs/research/playwright-mcp-setup-review.md`に以下を記録：

- セットアップにかかった実際の時間
- 発生したエラーとその解決方法
- 動作確認テストの結果
- 改善提案（あれば）

### 確定仕様への昇格
検証が成功し、運用に乗った場合：

```bash
# 確定仕様として保存
cp docs/features/tool-playwright-mcp-setup/spec.md \
   docs/spec/infra/playwright-mcp-setup.md
```

## 備考

### npx方式のメリット（再確認）
- ✅ グローバルインストール不要
- ✅ 常に最新版を使用（`@latest`）
- ✅ `package.json`を汚染しない
- ✅ チーム共有が簡単（`.mcp.json`のみ）

### 本番環境での推奨事項
本番環境ではバージョン固定を推奨：
```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@0.0.47", "--headless", "--isolated"]
    }
  }
}
```

### トラブルシューティング参考資料
- 提供された手順書: `docs/spec/marp/image-size-guideline.md`のトラブルシューティングセクション
- Playwright公式: https://playwright.dev/docs/troubleshooting
- MCP GitHub Issues: https://github.com/microsoft/playwright-mcp/issues
