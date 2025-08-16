---
marp: true
theme: github-dark
paginate: true
size: 16:9
style: |
  section {
    font-family: 'Hiragino Sans', 'ヒラギノ角ゴシック', 'Yu Gothic', '游ゴシック', 'Noto Sans JP', sans-serif;
  }
  .highlight {
    background: linear-gradient(135deg, #D4ED00 0%, #00BCD4 100%);
    color: #333333;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
    font-weight: bold;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .demo {
    background: #f8f9fa;
    border-left: 4px solid #00BCD4;
    border-radius: 4px;
    padding: 20px;
    padding-bottom: 10px;
    margin: 0;
  }
  .demo pre {
    background: #ffffff;
    color: #24292e;
    border-radius: 6px;
    padding: 16px;
    margin: 10px 0;
    overflow-x: auto;
    border: 2px solid #d1d9e0;
  }
  .demo code {
    background: #ffffff;
    color: #24292e;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 15px;
    line-height: 1.6;
    font-weight: 500;
  }
  .content-section {
    padding: 15px 0;
    margin: 0;
  }
  .important {
    border-left: 4px solid #00BCD4;
    background-color: rgba(0, 188, 212, 0.1);
    padding: 8px 20px;
    padding-bottom: 2px;
    margin-bottom: 2px;
    border-radius: 0 4px 4px 0;
  }
  .box {
    padding: 20px;
    border-radius: 8px;
    margin: 10px 0;
    border-left: 4px solid;
  }
  .box.blue {
    background-color: rgba(33, 150, 243, 0.1);
    border-left-color: #2196F3;
  }
  .box.green {
    background-color: rgba(76, 175, 80, 0.1);
    border-left-color: #4CAF50;
  }
  .box.yellow {
    background-color: rgba(255, 193, 7, 0.1);
    border-left-color: #FFC107;
  }
  .box.red {
    background-color: rgba(244, 67, 54, 0.1);
    border-left-color: #F44336;
  }
  table {
    margin: 20px auto;
    border-collapse: collapse;
    width: 100%;
  }
  th {
    background-color: #4a5568 !important;
    color: #ffffff !important;
    font-weight: bold;
    padding: 12px;
    border: 1px solid #718096;
    text-align: center;
  }
  td {
    background-color: #2d3748 !important;
    color: #e2e8f0 !important;
    padding: 12px;
    border: 1px solid #718096;
    text-align: center;
  }
  /* ページ番号（右上の数字）を非表示 */
  section::before {
    display: none;
  }
  
  /* twoColumns後の横断結論表示用 */
  .cross-conclusion {
    background: linear-gradient(135deg, #D4ED00 0%, #00BCD4 100%);
    color: #333333;
    padding: 15px 20px;
    border-radius: 8px;
    margin: 20px auto;
    font-weight: bold;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    border: 2px solid #00BCD4;
    width: 90%;
    max-width: 800px;
    display: block;
    clear: both;
  }
  
  .cross-conclusion::before {
    content: "💡 ";
    font-size: 1.2em;
    margin-right: 8px;
  }
---

<!--_class: title-->

# 音声認識×AI文体補正で実現する技術ブログ執筆の革新

## ～1時間で高品質な記事を完成させる方法～

---

# 自己紹介

<!--_class: twoColumns-->

<div>

**フロントエンドエンジニア・AI 活用**

- Figma による デザイン構築
- 社内業務改善 AI システム開発
- 3 年弱で技術記事 165 本執筆

**本日の資料**

🔗 [**GitHub**:Ryunosuke-Tanaka-sti](https://github.com/Ryunosuke-Tanaka-sti/claude_and_blog_seminar)
🔗 [**登壇資料**](https://ryunosuke-tanaka-sti.github.io/claude_and_blog_seminar/)

</div>

<div>

![](./assets/profile.png)

</div>

---

# 本日のゴール

## 音声で思考をそのまま技術記事に

<div class="important">

1. 🎙️ **音声認識で執筆時間を95%削減**
2. 🤖 **AI文体補正で一貫性のある文章へ**
3. 📊 **タイトル・メタディスクリプションの自動生成**
4. 🔍 **第一読者視点のAI評価で品質保証**

</div>

<div class="highlight">
今日から使える完全ガイド（Notion MCPはおまけ）
</div>

---

# なぜ音声執筆が革新的なのか？


![bg contain 90%](./assets/voice_comparison.svg)

---

# 実績：12時間→1時間の実現

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 24px; }
</style>

| フェーズ         | 従来の方法             | 音声×AI後           | 削減率 |
| ---------------- | ---------------------- | ------------------- | ------ |
| **アイデア出し** | 30-60 分（構成メモ）   | 5-10 分（音声入力） | 80%    |
| **下書き作成**   | 3-4 時間（タイピング） | 10-15 分（音声→AI） | 95%    |
| **文体統一**     | 1-2 時間（手動修正）   | 5 分（Claude）      | 96%    |
| **タイトル生成** | 30-60 分（試行錯誤）   | 5 分（Claude）      | 90%    |
| **品質チェック** | 2-3 時間（自己確認）   | 10 分（AI 評価）    | 93%    |

<div class="highlight">
トータル：12時間 → 1時間（92%削減）
</div>

---

# 音声執筆ワークフローの全体像

![contain auto center](./assets/voice_workflow.svg)

---

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 20px; }
</style>

# 本日の流れ（45 分）

| 時間     | 内容                             | 実演 |
| -------- | -------------------------------- | ---- |
| 0-5 分   | 導入・音声執筆のメリット         | -    |
| 5-10 分  | AI第一読者システム開始           | ✅   |
| 10-20 分 | 音声認識×Notion AI 実践          | ✅   |
| 20-30 分 | Claude による高度な文体補正      | ✅   |
| 30-35 分 | AI評価結果確認とタイトル生成     | ✅   |
| 35-40 分 | ベストプラクティス               | -    |
| 40-45 分 | Q&A                              | -    |

---

<!-- _class: subTitle-->

# Part 1: AI第一読者システムの開始

---

# なぜAI第一読者が革新的なのか？

## 従来の記事レビューの課題

<div class="important">

- 👥 **他のエンジニアは忙しい**
- ⏰ **手動ファクトチェックに数時間**
- 💸 **専門家への相談コスト**
- 📅 **専門家の空き時間に依存**

</div>

<div class="highlight">
この課題をAI第一読者システムが完全解決！
</div>

---

# AI第一読者の圧倒的メリット

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 20px; }
</style>

| 項目 | 従来の方法 | AI第一読者手法 |
|------|------------|----------------|
| **時間** | 数時間〜半日 | 5〜30分 |
| **網羅性** | 人間の見落としリスク | AIの包括的チェック |
| **継続性** | 一回限り | 定期的な自動チェック |
| **コスト** | 専門家への相談コスト | AIサービス利用料のみ |
| **アクセス性** | 専門家の空き時間に依存 | 24時間いつでも利用可能 |

<div class="highlight">
90%以上の時間削減と24時間対応を実現！
</div>

---

# 🎬 ライブデモ：AI第一読者評価の開始

<div class="highlight">
ここから実際にAIを第一読者にした記事評価を開始します！
</div>

---

# AI第一読者評価の実践手順

## STEP 1: PDF準備とプロンプト設定

<div class="demo">

**プロンプト実演**
```
【ここでライブAI評価プロンプトを実演】

添付した資料の内容をもとにファクトチェックして、
技術的ブログとして多角的な評価から判断して

評価観点：
1. 技術的正確性（公式ドキュメントと照合）
2. 2025年時点での最新性
3. 類似記事との差別化ポイント
4. 初心者への配慮度
5. 実践的価値
```

</div>

---

# AI第一読者による内部処理プロセス

## AIエージェントの分析手順

1. **本文抽出と理解**
2. **記載情報の精査計画を立案**
3. **公式ドキュメントや技術サイトを調査**
4. **情報の正確性・最新性を評価**
5. **改善提案を含む詳細レポート作成**

<div class="important">

**特徴**：
- 🔍 **数百のサイトを並行調査**
- 📝 **引用元明記の詳細レポート**
- ⚡ **5〜30分で完了通知**

</div>

---

# AI評価開始！執筆プロセスを並行進行

<div class="highlight">
AI評価をバックグラウンドで開始しました！<br>
評価完了まで音声執筆プロセスを進めます
</div>

<div class="important">
**並行処理のメリット**：
- AI評価：5〜30分で自動実行
- 人間：執筆作業に集中可能
- 効率：待ち時間ゼロで作業継続
</div>

---

<!-- _class: subTitle-->

# Part 2: 音声アウトライン生成実演

---

# アウトライン生成の2つのアプローチ

<!-- _class: twoColumns-->

<div>

### 対話型アプローチ
- Claude と段階的に構造を組み立て
- 計画重視・論理的思考タイプ向け
- **今回は時間の都合でスキップ**

</div>

<div>

### 抽出型アプローチ ⭐
- **まず話してしまう→後から構造化**
- 直感重視・アイデア発散タイプ向け
- **音声入力との相性が抜群**

</div>


---

<div class="cross-conclusion">
「話す」が得意な人には抽出型が圧倒的に効率的
</div>


---

# 音声アウトライン生成の実践

## 実演テーマ：「Marpプレゼン資料作成」

### STEP 1: 思いついたことを自由に話す（3分）

<div class="demo">

```
【ここでライブ音声入力を実演】
```

</div>

**ポイント**: 完璧を求めず、思考の流れそのままに

---

# 🎬 ライブデモ：音声アウトライン生成

<div class="highlight">
ここから実際に音声入力でアウトライン生成を実演します！
</div>

---

# STEP 2: Claude でアウトライン抽出

## プロンプト実演

<div class="demo">

```
【ここでライブアウトライン抽出プロンプトを実演】
```

</div>

---

# 抽出されたアウトライン例

<div class="demo">

```markdown
【ここでClaude が生成したアウトラインがリアルタイムで表示される】
```

</div>

**所要時間**: 音声3分 + Claude処理30秒 = **3分30秒**

<div class="highlight">
ライブデモでリアルタイム生成されたアウトラインがここに表示されます！
</div>

---

<!-- _class: subTitle-->

# Part 3: 音声執筆→AI補正の完全フロー

---

# 音声執筆の実践テクニック

## 効果的な音声入力のコツ

<div class="box blue">

### 1. 環境設定
- **静かな場所**で集中
- **マイク品質**にこだわる（スマホでもOK）
- **姿勢**：リラックスして話しやすく

</div>

<div class="box green">

### 2. 話し方のコツ
- **5-10分単位**で区切る
- **「えー」「あの」**もそのまま話す
- **専門用語**はゆっくり明確に
- **完璧を求めない**（後で修正前提）

</div>

<div class="box yellow">

### 3. 内容のコツ
- **アウトラインの1章ずつ**話す
- **具体例やエピソード**を積極的に含める
- **読者に語りかける**ように話す

</div>

---

# 🎬 ライブデモ：音声執筆実演

<div class="highlight">
ここから実際にアウトラインの1章を音声で執筆します！
</div>

---

# 音声執筆実演：生成されたアウトラインの第1章


### 実際に話してみます（5分間）

<div class="demo">

**音声入力の様子をリアルタイム実演**

- 画面分割：左側に音声認識結果、右側にメモ
- 思考の流れそのままを言葉にする過程
- 「あー、これも説明した方がいいかな」という迷いも含めて
- 具体的なコード例も口頭で説明

</div>

**観察ポイント**：
- 音声認識の精度
- 自然な話し言葉の流れ
- アイデアの連鎖の様子

---

# 音声入力結果の例

<div class="demo">

```markdown


```

</div>

**問題点**：
- 句読点がない
- 話し言葉の冗長性
- 構成が整理されていない

---

# Notion AI による第一次補正

## Notion での補正手順

### 1. 音声入力テキストを選択
### 2. 右クリック→「AIで改善」
### 3. 「文章を改善する」を選択

<div class="demo">

**補正後の例**
```markdown


```

</div>

---

<!-- _class: subTitle-->

# Part 3: Claude による文体統一・完成

---

# なぜClaude での文体統一が必要か？

## Notion AI の限界と Claude の強み

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 18px; }
</style>

| 項目 | Notion AI | Claude |
|------|-----------|---------|
| **基本的な文法修正** | ✅ 得意 | ✅ 得意 |
| **技術ブログ特有の文体** | ❌ 限定的 | ✅ 高精度 |
| **読者意識の反映** | ❌ 困難 | ✅ 可能 |
| **技術的正確性** | ❌ 一般的 | ✅ 専門的 |
| **一貫性のある構成** | ❌ 困難 | ✅ 可能 |

<div class="highlight">
Claude は技術ブログの文脈を理解し、プロレベルの文章に変換
</div>

---

# 🎬 ライブデモ：Claude 文体補正

<div class="highlight">
ここから実際にNotion AI補正済みテキストをClaudeで文体統一します！
</div>

---

# 文体統一の実践プロンプト

<div class="demo">

```


```

</div>

---

# Claude 文体統一結果

<!--_class: twoColumns-->

<div>

## useState：関数コンポーネントでの状態管理

### クラス → 関数コンポーネントの進化

<div class="demo">

```jsx
// Before: クラスコンポーネント
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }
}
```

</div>

</div>

<div>

### useState でシンプルに

<div class="demo">

```jsx
// After: useState
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}
```

</div>

<div class="highlight">
コード量50%削減、可読性大幅向上
</div>

</div>

---

# 完成した記事の品質

## Before（音声入力直後） vs After（Claude統一後）

### 改善された点

1. **構造化**：適切な見出しとマークダウン記法
2. **技術精度**：正確なコード例と解説
3. **読みやすさ**：適切な改行と段落分け
4. **一貫性**：統一された文体とトーン
5. **完成度**：そのまま公開できるレベル

<div class="highlight">
音声入力5分 + Notion AI 30秒 + Claude 1分 = 6分30秒で完成
</div>

### 従来手法との比較
- **従来**：1章800文字を書くのに2-3時間
- **音声×AI**：6分30秒（**95%短縮**）

---

<!-- _class: subTitle-->

# Part 4: AI評価結果の確認とタイトル生成

# 🎬 ライブデモ：AI評価結果の確認

<div class="highlight">
執筆完了！セミナー冒頭で開始したAI第一読者評価の結果を確認します
</div>

---

# AI評価結果の例

<div class="demo">

```markdown
【ここでAI評価結果がリアルタイムで表示される】

## 評価スコア（5点満点）
- 技術的正確性: 4.5点
- 読みやすさ: 4.0点  
- 実用性: 4.5点
- 独自性: 4.0点
- 最新性: 4.0点

## 改善提案
1. 具体的なコード例をもう1つ追加
2. エラーハンドリングの説明を補強
3. 初心者向けの用語解説を充実

## 引用元・参考情報
- Marp公式ドキュメント
- Markdown仕様書（CommonMark）
- GitHub Pages関連記事
```

</div>

**所要時間**: AI評価5〜30分（バックグラウンド） + 確認2分

---

# よくある判定ミスと対処法

<!--_class: twoColumns-->

<div>

## 1. レポートに納得がいかない場合

**原因**: ブログ内容が不足して主張がAIに伝わっていない
**対処法**: ブログ側を加筆して情報を補完

## 2. 「リンクがない」判定

**対処法**: 「リンクは含まれていると思います。再度確認をしてください」

</div>

<div>

## 3. 「情報が古い」指摘

**対処法**: 自分が参照した最新情報を共有して修正を求める

## 4. ハルシネーションリスク

**対処法**: **最終確認は必ず人間が実施**。AIの言葉を100%信じない

</div>

---

# 🎬 ライブデモ：SEOタイトル生成

<div class="highlight">
最後に完成記事からSEO最適化タイトルを生成して完了です！
</div>

---

# SEO最適化タイトル生成の実践

## Claude による高度なタイトル生成

<div class="demo">

**プロンプト実演**
```
【ここでライブタイトル生成プロンプトを実演】

あなたは、SEOに精通したライターです。

Goal：技術ブログ用タイトル・メタディスクリプションの作成
Plan：
- 記事全文を分析し内容を把握
- ターゲット読者と解決する課題を特定  
- 55-60文字以内でタイトルを5案作成
- 各案にSEOスコアと理由を付記

制約：
- 技術用語は正確に記載
- 誇大表現は避ける（「完全版」「決定版」NG）
- 具体的な価値を明示
```

</div>

---

# タイトル生成結果の例

<div class="demo">

```markdown
【ここでClaude が生成したタイトル案がリアルタイムで表示される】

## 提案タイトル（5案）

1. 【SEO:95点】Marpプレゼン資料作成を音声入力で3倍高速化する方法
2. 【SEO:92点】音声認識×Claude文体補正でMarp資料を効率作成  
3. 【SEO:90点】話すだけでMarpスライド完成！音声入力活用術
4. 【SEO:88点】Marpプレゼン作成時間75%削減：音声からAI補正まで
5. 【SEO:85点】Claude×音声認識で変わるMarp資料作成【実践手順付き】

## メタディスクリプション
音声認識とAI文体補正を組み合わせたMarpプレゼン資料作成手法を実演解説。従来手法と比較して作業時間を大幅短縮する具体的なワークフローと実際の成果を詳しく紹介します。
```

</div>

**所要時間**: Claude処理30秒 + 選択30秒 = **1分**

<div class="highlight">
完成！音声入力からAI評価まで全工程完了🎉
</div>

---

<!-- _class: subTitle-->

# Part 5: ベストプラクティス・注意点

---

# 音声執筆の成功のための5つのポイント

<div class="box blue">

## 1. 🎯 完璧主義を捨てる
- 音声入力では「後で直す」前提で進める
- 80%の品質で次のステップへ
- 言い直しに時間をかけすぎない

</div>

<div class="box green">

## 2. 📱 環境に合わせた使い分け
- **移動中**：アイデア出し・アウトライン
- **自宅**：本格的な音声執筆
- **オフィス**：テキスト修正・最終調整

</div>

<div class="box yellow">

## 3. 🔄 段階的な品質向上
- 音声入力→Notion AI→Claude の順番を守る
- 各段階で異なる目的を意識
- 一度に完璧を求めない

</div>

---

# よくある失敗パターンと対策

<!--_class: twoColumns-->

<div>

## ❌ 失敗パターン1：音声で完璧を求める

**症状**：言い間違いのたびに止めて修正
**対策**：「えー」「あの」も含めて続ける

## ❌ 失敗パターン2：AIに丸投げ

**症状**：音声入力後、全てAIに任せる
**対策**：自分の意図を明確にプロンプトで指示

</div>

<div>

## ❌ 失敗パターン3：ツールの過度な使い分け

**症状**：毎回全てのツールを使う
**対策**：記事の性質に応じて取捨選択

## ❌ 失敗パターン4：環境への配慮不足

**症状**：周囲を気にせず大声で話す
**対策**：場所に応じた音量・時間帯の調整

</div>

---

# 音声執筆に向いている記事・向いていない記事

<!--_class: twoColumns-->

<div>

## ✅ 音声執筆に向いている

<div class="box green">

- **体験談ベースの記事**：自然な語りが活きる
- **解説記事**：教える感覚で話しやすい
- **比較記事**：「AとBの違いは...」と話しやすい
- **初心者向け記事**：優しく語りかける文体

</div>

</div>

<div>

## ❌ 音声執筆に向いていない

<div class="box red">

- **リファレンス記事**：正確性重視、構造化が必要
- **API仕様書**：厳密な技術仕様
- **コードレビュー**：詳細な技術検証が必要
- **学術論文調**：堅い文体が求められる記事

</div>

</div>

---

<div class="highlight">
自分の記事タイプを見極めて使い分けることが重要
</div>

---

# 継続的な改善のコツ

<!--_class: twoColumns-->

<div>

## 📊 効果測定

- **執筆時間の記録**：従来手法との比較
- **記事品質の評価**：読者反応・PV数
- **自分の変化**：文章力・アイデア力の向上

## 🔄 改善サイクル

1. **実践**：新しい記事で音声執筆
2. **振り返り**：うまくいった点・課題
3. **調整**：プロンプトやワークフローの最適化
4. **共有**：成功パターンの蓄積

</div>

<div>

## 📚 スキルアップ

- **文体の改善**：良い記事の文体を学習
- **音声技術の向上**：話すスキル自体の向上
- **AI活用の深化**：より効果的なプロンプト作成

## 🎯 継続のコツ

- **小さく始める**：1記事の一部から試す
- **習慣化**：毎日5分の音声練習
- **仲間作り**：同じ手法を試す人との交流

</div>

---

<!-- _class: subTitle-->

# Part 6: Q&A・次のステップ

---

# よくある質問

<!--_class: twoColumns-->

<div>

## Q1: 音声認識の精度が低い場合は？

**A**: 以下の方法で改善できます
- マイク環境の改善（イヤホンマイク推奨）
- 専門用語の事前辞書登録
- ゆっくり明瞭に発音
- 短いセンテンスで区切る

## Q2: 会社のセキュリティ制約がある場合は？

**A**: 段階的な導入がおすすめ
- まずは個人ブログで練習
- 社内用途はローカル音声認識ツール活用
- Claude の代わりに社内AI活用

</div>

<div>

## Q3: 音声入力が恥ずかしい場合は？

**A**: 環境選択と慣れが重要
- 一人になれる場所で練習
- 小声でも認識可能
- 「独り言」感覚で始める

## Q4: どのくらいで慣れますか？

**A**: 個人差はありますが
- 1週間：基本操作に慣れる
- 1ヶ月：自然に話せるようになる
- 3ヶ月：効率的なワークフロー確立

</div>

---

# 次のステップ・発展的活用

<div class="box blue">

## 🚀 レベル1：基本マスター（今日から1週間）
- 音声アウトライン生成の習慣化
- Notion AI + Claude フローの定着
- 短い記事（1000文字）で練習

</div>

<div class="box green">

## 🚀 レベル2：効率化追求（1-3ヶ月）
- 文体抽出・プロンプト最適化
- 複数ツールの連携自動化
- 長文記事（3000文字以上）への挑戦

</div>

<div class="box yellow">

## 🚀 レベル3：高度な活用（3ヶ月以降）
- 音声 + 動画コンテンツ制作
- 多言語展開
- チーム全体でのワークフロー共有

</div>

---

# 今日から実践できるアクション

<!--_class: twoColumns-->

<div>

<div class="box blue">

## ✅ 今日やること
1. **スマホの音声入力設定確認**
2. **Notionアカウント作成（未登録の場合）**
3. **Claude アカウント確認**

</div>

<div class="box green">

## ✅ 明日やること
1. **5分間の音声アウトライン練習**
2. **短い記事の音声執筆挑戦**

</div>

</div>

<div>

<div class="box yellow">

## ✅ 今週やること
1. **完全な記事を1本音声で作成**
2. **従来手法との時間比較**
3. **成功パターンの記録**

</div>

</div>

---

<div class="highlight">
最初の一歩が一番重要！完璧でなくても始めることが大切
</div>

---

# まとめ

## 🎙️ 音声×AI執筆で得られるもの

### ✅ 圧倒的な時間短縮
- **12時間 → 1-2時間**（85%削減）
- 思考速度での執筆実現

### ✅ 執筆の質的向上
- より自然で親しみやすい文体
- 豊かな表現とアイデアの深掘り

### ✅ 執筆習慣の確立
- 場所を選ばない執筆環境
- 疲労軽減による継続性向上

### ✅ 新しい創造的プロセス
- 右脳と左脳の協働
- AI との効果的なコラボレーション

---

# 配布資料・参考リンク

**本日の内容はすべてブログで公開されています**

🔗 [**GitHub リポジトリ**](https://github.com/Ryunosuke-Tanaka-sti/claude_and_blog_seminar)
🔗 [**詳細記事一覧**](https://tech-lab.sios.jp/archives/tag/claudex%e6%8a%80%e8%a1%93%e3%83%96%e3%83%ad%e3%82%b0)

**関連記事**
- 音声認識執筆の詳細手法
- アウトライン生成テクニック  
- Claude プロンプト集
- 文体統一の実践例

![](./assets/QR_blog.png)

---

# Q&A タイム

### ご質問をお待ちしています！

<div class="important">

**よくある質問カテゴリ**
- 🎙️ 音声入力のコツ・環境設定
- 🤖 AI プロンプトの書き方
- ⏱️ 時間短縮の実現方法
- 📝 文体統一のテクニック
- 🔧 ツール選択・環境構築

</div>

<div class="highlight">
音声×AIで、あなたの技術発信が劇的に変わります！🚀
</div>

**#音声執筆 #Claude #技術ブログ #AI活用 #生産性向上**

---

<!-- _class: subTitle-->

## ありがとうございました！

### 音声×AIで新しい執筆体験を！

<div class="highlight">
話すだけで思考が記事になる時代の始まり
</div>

**連絡先・フォローアップ**
- 📧 質問・相談随時受付
- 🔗 コミュニティ参加歓迎  
- 📚 追加資料は GitHub で公開

**今日から音声執筆、始めませんか？** 🎤✨