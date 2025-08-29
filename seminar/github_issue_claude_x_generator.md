---
marp: true
theme: github-dark
paginate: true
size: 16:9

---

<!--_class: title-->

# GitHub Issue × Claude API

## ブログからX投稿への完全自動化システム
### 37%コスト削減を実現する3パターン生成

---

<!-- _class: subTitle-->

# Part 1: システム概要

---

# 課題：ブログの拡散って手間じゃない？

<div class="box red">

## よくある悩み
- **時間がない**: X投稿を手動作成する時間が取れない
- **品質のばらつき**: 書く人によって訴求力が異なる
- **パターン化困難**: 記事ごとに最適な表現が見つからない

</div>

<div class="highlight">
GitHub Issue 1つで解決する方法があります！
</div>

---

# 解決：完全自動化システム

```
GitHub Issue作成
    ↓
GitHub Actions起動
    ↓
記事HTML取得
    ↓
Claude APIで3パターン生成
    ↓  
Pull Request自動作成
```

<div class="highlight">
Issue作成から5-10分で投稿文完成 🚀
</div>

---

<!-- _class: subTitle-->

# Part 2: 技術アーキテクチャ

---

# システム構成

<!--_class: twoColumns-->

<div>

## GitHub Actions
- **トリガー**: Issue作成
- **処理**: 自動ワークフロー
- **出力**: Pull Request

## Python Scripts
- HTML記事取得・圧縮
- Claude API通信
- Git操作自動化

</div>

<div>

## Claude API統合
- **プロンプトキャッシュ**: 37%削減
- **3パターン同時生成**
- **品質検証システム**

## 自動化フロー
- Issue → PR → マージ
- 完全なCI/CD統合

</div>

---

# コスト最適化の秘密

<div class="box blue">

## プロンプトキャッシュ活用
- **通常料金**: $3.00/1Mトークン
- **キャッシュ料金**: $0.30/1Mトークン
- **削減効果**: 37%のコスト削減

</div>

**年間削減効果**（50回/月実行）
- 月間: 約$1.50削減（225円）
- 年間: 約$18削減（2,700円）

---

<!-- _class: subTitle-->

# Part 3: 3パターン戦略

---

# なぜ3パターン？

<div class="highlight">
異なるオーディエンスへの最適化
</div>

<!--_class: twoColumns-->

<div>

## Pattern A: 効果重視型
🚀 **「処理速度3倍向上！」**
- ターゲット: マネージャー層
- アプローチ: 数値・ROI重視

## Pattern B: 課題共感型
😰 **「その設定ミス、よくある」**
- ターゲット: 現場エンジニア
- アプローチ: 親しみやすさ

</div>

<div>

## Pattern C: 学習促進型
🔥 **「2025年注目の技術」**
- ターゲット: ジュニア層
- アプローチ: スキルアップ

## リスク分散効果
- 特定アプローチの失敗を回避
- データ収集による学習機会

</div>

---

# 品質保証メカニズム

<div class="box green">

## 自動検証システム
- **技術的正確性**: 記事内容との一致チェック
- **誇張表現の排除**: NGワード検出
- **文字数最適化**: 260文字制限遵守
- **リンクカード対応**: URL配置最適化

</div>

**検証項目例**
- 「革命的」→記事内に根拠があるか？
- 数値効果→正確な引用か？
- ハッシュタグ→適切な選択か？

---

<!-- _class: subTitle-->

# Part 4: 実践デモ

---

# 使用方法（超簡単）

<div class="box blue">

## 1. Issue作成
```
タイトル: https://tech-lab.sios.jp/archives/48651
```

## 2. 待つ（5-10分）

## 3. PRレビュー・マージ

</div>

**それだけで3パターンの投稿文が完成！**

---

# 生成例

```
Pattern A: 効果重視
🚀 APIレスポンス時間を50%短縮！
📝 Redis活用でDB負荷を大幅削減
⚡ 技術スタック: Redis, Python, FastAPI
🔧 実装時の注意点も解説
#Redis #API最適化 #Python

Pattern B: 課題共感  
😰 APIが重くてユーザーが離脱...そんな経験ありませんか？
💡 Redisキャッシュを使えば劇的に高速化できます！
⚡ Python + FastAPIで実装
🎯 パフォーマンス改善のコツも紹介
#パフォーマンス改善 #Redis
```

---

<!-- _class: subTitle-->

# Part 5: まとめ・今後

---

# キーポイント

<div class="box blue">

### 🎯 このシステムの価値
- **完全自動化**: 人手不要でIssue→PR生成
- **品質保証**: Claude APIによる高品質な投稿文
- **コスト最適化**: 37%削減の実現
- **多様性確保**: 3パターンによるリーチ最大化

</div>

<div class="highlight">
エンジニアの情報発信を革新する自動化システム
</div>

---

# 今後の展望

<div class="box green">

## 拡張可能性
- 複数記事の一括処理
- A/Bテストによる効果測定
- 他SNSプラットフォーム対応

</div>

<div class="box blue">

## 技術発展
- 機械学習による最適パターン予測
- リアルタイムトレンド分析統合
- 多言語対応（英語版同時生成）

</div>

---

# Thank You!

<div class="highlight">
GitHub Issue 1つでブログ拡散が完全自動化
</div>

**今日から使える技術で、情報発信の効率を革新しましょう！**

GitHub: [claude_and_blog_seminar](https://github.com/Ryunosuke-Tanaka-sti/claude_and_blog_seminar)