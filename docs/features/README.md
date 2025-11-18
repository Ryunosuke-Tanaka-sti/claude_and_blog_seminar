# Features ディレクトリ

このディレクトリには、新機能開発の仕様書と計画書をディレクトリ単位で管理します。

## ディレクトリ構成

各機能は独立したディレクトリとして管理され、以下のファイルを含みます：

```
features/
├── README.md                        # このファイル
└── [feature-name]/                  # 機能ごとのディレクトリ
    ├── spec.md                      # 仕様書（必須）
    ├── plan.md                      # 実装計画書（必須）
    └── assets/                      # 図表・画像（任意）
        ├── diagram.svg
        └── screenshot.png
```

## 命名規則

### ディレクトリ名
機能のワークスペースと内容を表す名前を使用します。

**フォーマット**: `[workspace]-[feature-name]`

**ワークスペースプレフィックス**:
- `frontend-` - フロントエンド機能（Astro + React）
- `marp-` - Marpスライド
- `tool-` - ツール開発

**例**:
- `frontend-astro-react-setup/` - フロントエンド環境構築
- `frontend-blog-index/` - ブログ一覧ページ
- `frontend-article-detail/` - 記事詳細ページ
- `marp-claude-intro/` - Claudeセミナースライド
- `marp-automation-workflow/` - 自動化ワークフロースライド
- `tool-index-generator/` - HTMLインデックス生成ツール
- `tool-ogp-fetcher/` - OGP画像取得ツール

### ファイル名
各ディレクトリ内のファイル名は統一されています：

- `spec.md` - 仕様書（必須）
- `plan.md` - 実装計画書（必須）
- `assets/` - 仕様書用の図表・画像（任意）

## 新機能の追加手順

### 1. ディレクトリ作成
```bash
mkdir -p docs/features/[workspace]-[feature-name]
```

**例**:
```bash
mkdir -p docs/features/frontend-blog-index
```

### 2. テンプレートコピー
適切なテンプレートをコピーします。

```bash
# フロントエンド機能
cp docs/templates/spec-template-frontend.md docs/features/frontend-[name]/spec.md

# Marpスライド
cp docs/templates/spec-template-marp.md docs/features/marp-[name]/spec.md

# ツール開発
cp docs/templates/spec-template-tool.md docs/features/tool-[name]/spec.md
```

**例**:
```bash
cp docs/templates/spec-template-frontend.md docs/features/frontend-blog-index/spec.md
```

### 3. 仕様書作成
Claude Codeに依頼して仕様書を作成します。

```
@docs/CLAUDE.md を読み込んだ状態で、
以下のテンプレートを元に仕様書を作成してください：
@docs/features/frontend-blog-index/spec.md

要件：
- ブログ記事一覧を表示する
- 記事のタイトル、サムネイル、公開日時を表示
- カテゴリ別にフィルタリング可能
```

### 4. 計画書作成
仕様書を元に実装計画書を作成します。

```
以下の仕様書を元に、実装計画書（plan.md）を作成してください：
@docs/features/frontend-blog-index/spec.md

以下を含めてください：
- 実装スコープ
- タスク分割
- リスクと対策
- 検証計画
- 成功基準
- タイムライン
```

### 5. assetsディレクトリ（任意）
図表や画像が必要な場合は作成します。

```bash
mkdir -p docs/features/frontend-blog-index/assets
```

## ファイルの役割

### spec.md（仕様書）
機能の詳細な仕様を記述します。

**目的**:
- AIに人間の意図を正確に伝える
- 実装フェーズでの指針となる
- 検証フェーズでの比較基準となる

**必須セクション**:
- 概要・背景
- 情報設計または機能要件
- データ仕様
- 非機能要件
- デザイン指針（AIに委ねる）
- 技術的制約
- テスト観点

**禁止事項**:
- ❌ 実装コードの記述
- ❌ デザインの詳細指定（色、フォントサイズなど）
- ❌ 具体的なロジックの記述

### plan.md（実装計画書）
実装の進め方を記述します。

**目的**:
- 実装の全体像を把握する
- タスクを適切に分割する
- リスクを事前に洗い出す
- 検証基準を明確にする

**必須セクション**:
- プロジェクト概要（目的とスコープ）
- 開発アプローチ（3フェーズ開発）
- 技術仕様サマリー
- 作成するファイルの詳細
- 検証計画
- リスクと対策
- 成功基準
- タイムライン

### assets/（図表・画像）
仕様書に含める図表や画像を格納します。

**用途**:
- フロー図（SVG推奨）
- 構成図
- モックアップ（ワイヤーフレームレベル）
- 参考スクリーンショット

**注意**:
- 詳細なデザインモックは不要（AIデザイン駆動）
- 情報の構造や優先度を示す図に留める

## ベストプラクティス

### 1. 小さく始める
- 最初から完璧を目指さない
- 小規模な機能で試してみる
- 検証フェーズで学びを得て改善

### 2. 情報設計に注力（フロントエンド）
- 「何を」「どの順で」表示するかを明確に
- 「どう見せるか」はAIに任せる
- 情報の優先度を3段階で定義（最重要・重要・補足）

### 3. 入出力を明確に（バックエンド/ツール）
- 入力の形式を具体例で示す
- 出力の期待値を明確にする
- エラーケースを網羅的にリストアップ

### 4. 段階的に改善
- 仕様書は1回で完璧にならない
- 検証フェーズの学びを次回に活かす
- テンプレート自体も改善していく

## 既存の機能

### frontend-astro-react-setup
- **目的**: Astro + React環境の初期構築
- **スコープ**: ディレクトリ構成、設定ファイル、サンプルページ
- **ステータス**: 計画完了、実装待ち

## 参考資料

### プロジェクト内ドキュメント
- 計画フェーズルール: `docs/CLAUDE.md`
- 仕様書ベース開発ガイド: `docs/spec-based-development-guide.md`
- テンプレート使用方法: `docs/templates/README.md`
- プロジェクト全体ガイド: `CLAUDE.md`

### 各ワークスペースの実装ルール
- Marp: `application/marp/CLAUDE.md`
- Frontend: `application/frontend/CLAUDE.md`
- Tools: `application/tools/CLAUDE.md`

---

## よくある質問

### Q: なぜディレクトリ単位で管理するのか？
A: 以下の理由からディレクトリ単位が適しています：
- 仕様書と計画書を1つの場所にまとめられる
- 図表や画像を同じ場所に格納できる
- 将来的に追加資料を入れやすい
- 機能ごとに独立して管理できる

### Q: spec.mdとplan.mdの違いは？
A:
- **spec.md**: 「何を作るか」を定義（仕様）
- **plan.md**: 「どう作るか」を定義（計画）

### Q: assetsディレクトリは必須？
A: 任意です。図表や画像が必要な場合のみ作成してください。

### Q: ファイル名を変更してもいい？
A: 推奨しません。`spec.md`と`plan.md`で統一することで、プロジェクト全体の一貫性が保たれます。

### Q: バグ修正もこのディレクトリ？
A: いいえ。バグ修正は `docs/bugs/` ディレクトリで管理します。同様にディレクトリ単位で管理します。

---

## まとめ

このディレクトリは**計画フェーズ**専用です。実装コードは一切書きません。

**重要な原則**:
1. ディレクトリ単位で機能を管理
2. spec.mdとplan.mdの2ファイル構成
3. 情報設計に注力、デザイン詳細はAIに委ねる
4. 段階的に改善していく

詳細なガイドは `docs/CLAUDE.md` と `docs/spec-based-development-guide.md` を参照してください。
