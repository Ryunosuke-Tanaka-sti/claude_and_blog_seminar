# テンプレート使用例とTips

実際のプレゼンテーション作成での具体的な使用例とコツを紹介します。

## 🎯 シナリオ別使用例

### シナリオ1: エンジニア向けLT（15分）

**使用テンプレート**: `technical-template.md`
**テーマ**: `github-dark`

```bash
# 1. テンプレートをコピー
cp templates/base/technical-template.md seminar/my-lt-slides.md

# 2. ビルド
marp seminar/my-lt-slides.md --html --theme ./theme/github-dark.css --output ./docs/my-lt-slides.html
```

**カスタマイズのポイント**:
- Overview を1スライドに簡潔にまとめる
- Background は問題提起を明確に
- Implementation にコード例を必ず含める
- Results で数値的な改善を示す

### シナリオ2: 新人研修ワークショップ（4時間）

**使用テンプレート**: `workshop-template.md`
**テーマ**: `canyon-custom`

```bash
# 1. テンプレートをコピー
cp templates/base/workshop-template.md seminar/beginner-workshop.md

# 2. ビルド
marp seminar/beginner-workshop.md --html --theme ./theme/canyon-custom.css --output ./docs/beginner-workshop.html
```

**カスタマイズのポイント**:
- 各実習の時間配分を明確に設定
- チェックポイントを多めに設置
- 参加者のレベルに応じて課題難易度を調整

### シナリオ3: 社内勉強会（45分）

**使用テンプレート**: `seminar-template.md`
**テーマ**: `github-dark` または `canyon-custom`

```bash
# 1. テンプレートをコピー
cp templates/base/seminar-template.md seminar/internal-study-session.md
```

**カスタマイズのポイント**:
- アジェンダに質疑応答時間を含める
- デモは実際の業務で使う例を選ぶ
- まとめで次回予告や関連トピックを紹介

## 🛠️ 実践的なカスタマイズテクニック

### 1. 効果的なハイライト使い分け

```markdown
<!-- 最重要ポイント -->
<div class="highlight">
今日の最重要ポイント
</div>

<!-- 実習・デモ内容 -->
<div class="demo">
実際に手を動かす内容
</div>

<!-- 注意事項 -->
<div class="checkpoint">
ここで確認すること
</div>
```

### 2. 時間管理の工夫

```markdown
<!-- ワークショップでの時間表示 -->
## セクション1 <span class="time-box">15分</span>

<!-- 進行目安の表示 -->
<div class="time-box">⏰ 現在時刻: XX:XX</div>
```

### 3. 双方向コンテンツの追加

```markdown
<!-- _style: scoped -->
<style>
.interactive {
  background: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
}
.checkpoint {
  background: #d1ecf1;
  border: 2px solid #bee5eb;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}
</style>

<!-- 質問を投げかける -->
### 皆さんはどう思いますか？

<div class="interactive">
- 選択肢A
- 選択肢B  
- 選択肢C

**30秒考えて、隣の人と相談してください**
</div>

<!-- 手を挙げてもらう -->
### 経験者の方、手を挙げてください

<div class="checkpoint">
経験者: XX名 / 未経験者: XX名
</div>
```

## 📊 効果測定とフィードバック

### プレゼンテーション後のチェックリスト

#### セミナー系
- [ ] 参加者が主要概念を理解できたか？
- [ ] 質疑応答で深い議論ができたか？
- [ ] 次のアクションが明確になったか？

#### 技術発表系
- [ ] 技術的な課題と解決策が伝わったか？
- [ ] 実装の詳細が適切なレベルで説明できたか？
- [ ] 他の開発者が参考にできる内容だったか？

#### ワークショップ系
- [ ] 参加者全員が最後まで付いてこれたか？
- [ ] 実習で期待する成果物が作れたか？
- [ ] スキルが実際に身についたか？

### 改善のためのフィードバック収集

```markdown
<!-- 終了スライドに追加 -->
## フィードバックをお願いします

**3つの質問**
1. 一番役に立った内容は？
2. 改善すべき点は？
3. 次に聞きたいトピックは？

**連絡先**: feedback@example.com
```

## 🔥 よくある失敗パターンと対策

### 失敗パターン1: 時間オーバー

**原因**: デモや説明が長すぎる
**対策**: 
- 各セクションに厳密な時間制限を設ける
- タイマーを使用して進行管理
- 重要度に応じてスライドに優先度を付ける

### 失敗パターン2: 参加者の理解度にバラツキ

**原因**: 事前準備の確認不足
**対策**: 
```markdown
<!-- 冒頭に必ず入れる -->
## 事前準備の確認

<div class="checkpoint">
以下が完了している方は挙手してください：
- [ ] 環境構築
- [ ] 必要ファイルのダウンロード
- [ ] 基礎知識の学習
</div>
```

### 失敗パターン3: スライドが読みにくい

**原因**: 文字が多すぎる、色使いが適切でない
**対策**: 
- 1スライド1メッセージの原則を徹底
- 定義済みのスタイルクラスを活用
- 文字サイズは最小でも24px以上を維持

## 🚀 上級者向けTips

### 1. インタラクティブ要素の追加

```markdown
<!-- 投票・アンケート -->
### リアルタイムアンケート

**質問**: どの手法を使っていますか？

Menti.com code: **1234 5678**

<!-- 結果表示用のスペース -->
---
```

### 2. 動的コンテンツの準備

```markdown
<!-- _style: scoped -->
<style>
.demo {
  background: var(--gh-bg-secondary, #161b22);
  border: 2px solid var(--gh-border-default, #30363d);
  border-radius: 8px;
  padding: 20px;
  margin: 0 0;
  color: var(--gh-text-primary, #f0f6fc);
}
.live-demo {
  background: linear-gradient(135deg, rgba(31, 111, 235, 0.1) 0%, rgba(248, 81, 73, 0.1) 100%);
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

<!-- ライブコーディング用 -->
### ライブデモ

<div class="live-demo">
**準備したコード**: [GitHub リンク]

**今から実装する機能**:
1. 基本機能
2. エラーハンドリング
3. テストケース
</div>
```

### 3. バックアップスライドの準備

```markdown
<!-- メインスライドの最後に追加 -->
---

<!-- 以下はバックアップスライド -->

## 補足資料

### 詳細な技術仕様

*時間があれば説明、質問があれば対応*

### 参考資料

*深く学びたい人向け*
```

## 📈 継続的改善

### テンプレートの進化

1. **使用ログの記録**: どのテンプレートが多く使われるか
2. **フィードバックの蓄積**: 使いにくい点の収集
3. **定期的な見直し**: 四半期ごとにテンプレート更新を検討

### 組織内でのナレッジ共有

```markdown
<!-- 社内用テンプレートに追加 -->
## 社内発表時の注意事項

### ブランドガイドライン
- ロゴの配置: 右下固定
- カラーパレット: #1f6feb, #f85149, #2ea043

### 必須情報
- 発表者の所属部署
- 内容のレベル（初級/中級/上級）
- 関連するプロジェクト名
```

このようにテンプレートシステムを活用することで、一貫性を保ちながら効率的にプレゼンテーションを作成できます。