# 仕様書ベース開発テンプレート集（このリポジトリ専用版）

このディレクトリには、このリポジトリの構成（Marp、Frontend、Tools）に最適化された3フェーズ開発手法のテンプレートが含まれています。

## 🎯 このリポジトリの特徴：AIデザイン駆動

従来の仕様書ベース開発では「フロントエンドのUI/UXデザインは向かない」とされていましたが、このリポジトリでは**AIデザイン駆動**アプローチにより、全てのワークスペースで仕様書ベース開発が可能です。

**ポイント**: デザインの詳細はAIに任せ、人間は**情報設計**に注力する

## テンプレート一覧

### 計画フェーズ用テンプレート

開発内容を記述する仕様書のテンプレートです。

| ファイル名 | 用途 | 配置場所 | 特徴 |
|-----------|------|---------|------|
| `spec-template-frontend.md` | フロントエンド機能 | `docs/features/frontend-*.md` | **情報設計重視** |
| `spec-template-marp.md` | Marpスライド | `docs/features/marp-*.md` | **メッセージ設計重視** |
| `spec-template-tool.md` | ツール開発 | `docs/features/tool-*.md` | **入出力仕様重視** |
| `spec-template-feature.md` | 汎用機能 | `docs/features/*.md` | 汎用テンプレート |
| `spec-template-bug.md` | バグ修正用 | `docs/bugs/*.md` | バグ修正用 |

### 確定仕様用テンプレート

実装・検証完了後の確定仕様を記述するテンプレートです。

| ファイル名 | 用途 | 配置場所 | 特徴 |
|-----------|------|---------|------|
| `spec-confirmed-template.md` | 確定仕様 | `docs/spec/[category]/[name].md` | **実装済み情報を含む** |

**使い方:**
```bash
# 実装・検証完了後に確定仕様を作成
cp docs/templates/spec-confirmed-template.md docs/spec/frontend/blog-index.md

# features/ の仕様書をベースに、実装情報を追記
# - 実装ファイルのパス
# - 使用した技術スタック
# - 実装状況
# - 既知の制約・制限事項
# - 今後の改善案
```

### 検証用テンプレート

実装後の検証・レビュー用のテンプレートです。

| ファイル名 | 用途 | 配置場所 |
|-----------|------|---------|
| `verification-review-template.md` | 実装レビュー用 | `docs/research/[レビュー名].md` として作成 |

## CLAUDE.mdについて

各ワークスペースには既にCLAUDE.mdが配置されています：

- `application/marp/CLAUDE.md` - Marpスライド実装ルール
- `application/frontend/CLAUDE.md` - フロントエンド実装ルール（Astro+React）
- `application/tools/CLAUDE.md` - ツール実装ルール（TypeScript）

これらのファイルは実装フェーズでAIに読み込ませて使用します。テンプレートとしてコピーする必要はありません。

## 使い方

### 新機能開発の流れ

以下は各ワークスペース別の例です。

#### 例1: フロントエンド機能（ブログ一覧ページ）

**ステップ1: 計画フェーズ**
```bash
# 1. 機能ディレクトリを作成
mkdir -p docs/features/frontend-blog-index

# 2. フロントエンド仕様書テンプレートをコピー
cp docs/templates/spec-template-frontend.md docs/features/frontend-blog-index/spec.md

# 3. Claude Codeで仕様書を作成
# @docs/CLAUDE.md を読み込んだ状態で
# 「ブログ一覧ページの仕様書を作成してください」と依頼

# 4. 作成された仕様書をレビュー
# ✅ 表示する情報は網羅されているか
# ✅ 情報の優先度は適切か
# ❌ デザインの詳細を書いていないか確認

# 5. 計画書を作成
# 「仕様書を元に実装計画書（plan.md）を作成してください」と依頼
```

**ステップ2: 実装フェーズ**
```bash
# @application/frontend/CLAUDE.md を読み込んだ状態で依頼：
以下の仕様書を読み込んで実装してください：
@docs/features/frontend-blog-index/spec.md

実装方針：
- 表示する情報の正確性・網羅性を最優先
- UI/UXデザインはあなたの判断で最適なものを選択
- モダンで見やすいデザインを心がけてください

# ビルドして確認
npm run build:frontend
```

#### 例2: Marpスライド（技術セミナー資料）

**ステップ1: 計画フェーズ**
```bash
# 1. 機能ディレクトリを作成
mkdir -p docs/features/marp-claude-intro

# 2. Marp仕様書テンプレートをコピー
cp docs/templates/spec-template-marp.md docs/features/marp-claude-intro/spec.md

# 3. 仕様書を作成
# 伝えたいメッセージを3つに絞る
# スライド構成を論理的に整理
# 図解が必要な箇所を明確にする

# 4. 計画書を作成
```

**ステップ2: 実装フェーズ**
```bash
# @application/marp/CLAUDE.md を読み込んだ状態で依頼：
以下の仕様書を読み込んでMarpスライドを作成してください：
@docs/features/marp-claude-intro/spec.md

実装方針：
- 伝えたいメッセージを最優先
- 情報の順序と論理的な流れを重視
- レイアウトやデザインはあなたの判断で最適化

# ビルドして確認
npm run build:marp
```

#### 例3: ツール開発（HTMLインデックス生成）

**ステップ1: 計画フェーズ**
```bash
# 1. 機能ディレクトリを作成
mkdir -p docs/features/tool-index-generator

# 2. ツール仕様書テンプレートをコピー
cp docs/templates/spec-template-tool.md docs/features/tool-index-generator/spec.md

# 3. 仕様書を作成
# 入力/出力の形式を具体例で示す
# エラーケースを網羅的にリストアップ
# 実行方法とテスト方法を明確にする

# 4. 計画書を作成
```

**ステップ2: 実装フェーズ**
```bash
# @application/tools/CLAUDE.md を読み込んだ状態で依頼：
以下の仕様書を読み込んでツールを実装してください：
@docs/features/tool-index-generator/spec.md

実装方針：
- 入力/出力の正確性を最優先
- エラーハンドリングを適切に実装
- 実行時に進捗が分かるようログ出力を追加

# 実行して確認
npm run [tool-script] --workspace=application/tools
```

#### ステップ3: 検証フェーズ

```bash
# 1. レビューテンプレートをコピー
cp docs/templates/verification-review-template.md docs/research/frontend-blog-index-review.md

# 2. Claude Codeで差異分析を依頼
# 「@docs/features/frontend-blog-index/spec.md の計画ドキュメントと
#  @application/frontend/src/ の実装内容を確認して、
#  計画と実装の差異がある点をまとめてください」

# 3. 分析結果をレビューテンプレートに記入
# 4. 学びを次回に活かす
```

### 3. バグ修正の流れ

#### ステップ1: 計画フェーズ

```bash
# 1. バグディレクトリを作成
mkdir -p docs/bugs/login-error-fix

# 2. バグ修正仕様書のテンプレートをコピー
cp docs/templates/spec-template-bug.md docs/bugs/login-error-fix/spec.md

# 3. Claude Codeでバグ分析と修正方針を作成
# 「ログイン時のエラーに関するバグ修正仕様書を作成してください」と依頼

# 4. 修正計画書を作成（plan.md）
```

#### ステップ2-3: 実装・検証

新機能開発と同様の流れで実装・検証を行います。

## カスタマイズガイド

### プロジェクトに合わせた調整

各テンプレートは、プロジェクトの特性に合わせてカスタマイズできます：

**CLAUDE.mdのカスタマイズポイント:**
- アーキテクチャパターン（レイヤードアーキテクチャ、クリーンアーキテクチャなど）
- コード規約（ESLint/Prettierの設定、命名規則など）
- ディレクトリ構成
- テスト要件（カバレッジ目標など）

**仕様書テンプレートのカスタマイズポイント:**
- セクションの追加・削除
- 項目の優先度
- プロジェクト固有の要件項目

## ベストプラクティス

### 1. 段階的な導入

最初から完璧を目指さず、小さく始めて徐々に改善していきましょう：

1. まずは小規模な機能で試す
2. 検証フェーズで学びを得る
3. テンプレートやCLAUDE.mdを改善
4. 次の機能開発で改善版を使用

### 2. 適材適所の判断

すべての作業に仕様書ベース開発が適しているわけではありません：

**向いている:**
- バックエンドAPI開発
- データ処理ロジック
- 既存プロジェクトへの機能追加

**向いていない:**
- フロントエンドのUI/UXデザイン
- 簡単なリネーム作業
- プロジェクト構造の大幅変更

### 3. AIとの協働のコツ

- CLAUDE.mdの設定を忘れることがあるので、リアルタイムで監視
- 意図と異なる動作をした瞬間に処理を止める
- プロンプトに守ってほしい原則を改めて追加
- 事後確認で「原則守ってないですよね？」と確認

## トラブルシューティング

### よくある問題と対処法

**問題: AIが仕様書を無視してコードを書き始める**
- 対処: CLAUDE.mdの「禁止事項」セクションを強調
- プロンプトに「コードは一切書かないでください」と明記

**問題: 仕様書が曖昧で実装時に混乱する**
- 対処: 計画フェーズでAIに「この仕様書で不明瞭な点はありますか？」と質問
- 実装前にレビューを徹底

**問題: コンテキストが膨大になりセッションが限界に**
- 対処: タスクを適切に分割
- 1つの仕様書で扱う範囲を小さくする

## 参考資料

詳細なガイドは以下を参照してください：

- `docs/spec-based-development-guide.md` - 全体的なガイド
- ブログ記事:
  - [Claude Code革命！3フェーズ開発で効率的な開発](https://tech-lab.sios.jp/archives/49140)
  - [AI協働で仕様書アレルギー克服！開発時間を1週間→2日に短縮する実践法](https://tech-lab.sios.jp/archives/49148)

## フィードバック

このテンプレート集を使用して気づいた改善点があれば、ぜひフィードバックをお願いします。
検証フェーズで得られた学びを次回のテンプレート改善に活かしましょう。
