---
marp: true
theme: github-dark
paginate: true
size: 16:9

---

<!--_class: title-->

# ブログからプレゼン資料へ

## 信頼できる情報ソースを活用した
### 爆速プレゼンテーション作成術

---

<!-- _class: subTitle-->

# Part 1: 現在の課題

---

# プレゼン資料作成の悩み

<div class="box red">

## 従来の問題点
- ゼロから資料作成は時間がかかる
- 既存コンテンツの再利用が困難
- デザインセンスが必要
- 公開までの手順が複雑

</div>

<div class="highlight">
既に書いたブログ記事を有効活用できないか？
</div>

---

<!-- _class: subTitle-->

# Part 2: 解決アプローチ

---

# ブログ → Marpプレゼン変換フロー

```
執筆済みブログ記事
    ↓ [スクレイピング]
HTMLコンテンツ取得
    ↓ [Claude活用]
Marp形式に変換
    ↓ [ビルド]
プレゼン資料完成
```

<div class="highlight">
信頼できる自作コンテンツを最大限活用
</div>

---

# 実装システム構成

<div class="box blue">

## 技術スタック
- **スクレイパー**: TypeScript製ツール
- **AI変換**: Claude API
- **スライド生成**: Marp CLI
- **テーマ**: カスタムCSSテーマ
- **公開**: GitHub Pages

</div>

**所要時間**: 約10分で資料完成 🚀

---

<!-- _class: subTitle-->

# Part 3: 実際の効果

---

# 得られたメリット

<!--_class: twoColumns-->

<div>

## ⚡ 速度面
- 10分で資料作成
- 既存コンテンツ活用
- テンプレート再利用

</div>

<div>

## 📊 品質面
- 信頼性の高い情報源
- 一貫したデザイン
- GitHub Pages連携

</div>

---

# デザインの課題と対策

<div class="box red">

## 課題
- アニメーション非対応
- デザインセンス不要

</div>

<div class="box green">

## Claude活用での解決
- SVG図表の自動生成
- テーマテンプレート活用
- レイアウト最適化提案

</div>

---

<!-- _class: subTitle-->

# Part 4: 検証中の取り組み

---

# テンプレート駆動開発

1. **テンプレートライブラリ構築**
   - 用途別テーマ集
   - レイアウトパターン集

2. **Claude参照の最適化**
   - テンプレート自動選択
   - カスタマイズ最小化

3. **更なる高速化**
   - 5分以内での完成を目指す

---

# テンプレート駆動開発

<div class="highlight">
構築済みテンプレートの徹底活用
</div>

---

# ワークフロー自動化

```bash
# 1. ブログ記事取得
npm run scraper URL=https://tech-lab.sios.jp/archives/[id]

# 2. Marp変換（Claude経由）
# → 自動でテンプレート適用

# 3. ビルド & デプロイ
npm run build:[theme]
git push → GitHub Pages自動公開
```

---

<!-- _class: subTitle-->

# Part 5: まとめ

---

# キーポイント

<div class="box blue">

### 🎯 このアプローチの価値
- **既存資産の有効活用**: ブログ記事を再利用
- **時間短縮**: 10分で高品質な資料
- **継続的改善**: テンプレート蓄積で更に高速化

</div>

<div class="highlight">
コンテンツ作成者の生産性を最大化
</div>

---

# 今後の展望

<div class="box green">

## 自動化の推進
- GitHub Actions統合
- バッチ処理対応
- 多言語展開

</div>

<div class="box blue">

## AI活用の深化
- コンテンツ要約の高度化
- デザイン提案の自動化
- インタラクティブ要素の追加検討

</div>