# 再利用可能なスライド部品

よく使われるスライドパターンのテンプレートです。コピーして使用してください。

## タイトルスライド

### セミナー用
```markdown
<!-- _class: lead -->

# セミナータイトル
## サブタイトル

**発表者名**
**日付**
```

### 技術発表用
```markdown
<!-- _class: lead -->

# 技術発表タイトル
## 副題・技術スタック

**発表者名**  
**所属・職種**  
**発表日**
```

## アジェンダスライド

### 基本形
```markdown
## アジェンダ

1. **はじめに**
2. **問題提起**
3. **解決手法**
4. **実践例・デモ**
5. **まとめ**
```

### 時間付き（ワークショップ用）
```markdown
## 今日の流れ

<div class="time-box">⏰ 総時間: X時間</div>

1. **導入** <span class="time-box">15分</span>
2. **基礎知識** <span class="time-box">30分</span>
3. **ハンズオン①** <span class="time-box">45分</span>
4. **ハンズオン②** <span class="time-box">45分</span>
5. **発表・まとめ** <span class="time-box">30分</span>
```

## 目標設定スライド

### セミナー用
```markdown
## はじめに

### 本日のゴール

<div class="highlight">
参加者が○○を理解し、実際に使えるようになること
</div>

- ポイント1
- ポイント2
- ポイント3
```

### ワークショップ用
```markdown
## ワークショップのゴール

<div class="highlight">
実際に手を動かしながら○○を習得し、
明日から使えるスキルを身に付ける
</div>

### 学習目標

- **目標1**: 具体的なスキル
- **目標2**: 実践的な知識
- **目標3**: 応用力の獲得
```

## デモ・実習スライド

### デモ用
```markdown
## 実践例・デモ

### ライブデモ

<div class="demo">

**デモ内容**

1. ステップ1
2. ステップ2
3. ステップ3

</div>
```

### 実習用
```markdown
## ハンズオン① - 基本操作

<div class="exercise">

**実習時間**: <span class="time-box">30分</span>

### Step 1: 初期設定
1. ファイルを開く
2. 設定を変更
3. 動作確認

### Step 2: 基本操作
1. 機能Aを試す
2. 機能Bを実行
3. 結果を確認

</div>
```

## チェックポイントスライド

```markdown
## チェックポイント①

<div class="checkpoint">

ここまでで以下ができていますか？

- [ ] 環境設定が完了している
- [ ] 基本操作ができる
- [ ] 期待する結果が得られる

**困った方は挙手してください！**

</div>
```

## 技術的内容スライド

### アーキテクチャ図
```markdown
## Architecture

### システム構成

<div class="architecture">

**全体アーキテクチャ**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │───▶│  Database   │
└─────────────┘    └─────────────┘    └─────────────┘
```

</div>
```

### コード例
```markdown
## Implementation

### 実装のポイント

<div class="code-block">

```typescript
// 核となるコード例
interface TechSolution {
  method: string;
  performance: number;
  scalability: boolean;
}

const implementation: TechSolution = {
  method: "新しいアプローチ",
  performance: 95,
  scalability: true
};
```

</div>
```

### Before/After比較
```markdown
## Results

### パフォーマンス改善

<div class="comparison">

<div class="before">

**Before**
- レスポンス時間: 2.5s
- リクエスト/秒: 100
- エラー率: 5%

</div>

<div class="after">

**After**
- レスポンス時間: 0.8s
- リクエスト/秒: 500
- エラー率: 0.1%

</div>

</div>
```

## まとめスライド

### セミナー用
```markdown
## まとめ

### 本日学んだこと

- **ポイント1**: 要約
- **ポイント2**: 要約
- **ポイント3**: 要約

### 次のステップ

1. 今日から始められること
2. さらに学習したい人へのリソース
```

### 技術発表用
```markdown
## Lessons Learned

### 成功要因

- **ポイント1**: 具体的な成功要因
- **ポイント2**: チーム連携の改善
- **ポイント3**: 技術選定の適切さ

### 課題と改善点

- **課題1**: 残る技術的課題
- **改善点1**: 次回への改善提案
```

## 終了スライド

### カジュアル
```markdown
<!-- _class: lead -->

# ありがとうございました

## 質疑応答

**連絡先**: your-email@example.com
```

### フォーマル
```markdown
<!-- _class: lead -->

# Thank you

## Q&A

**GitHub**: github.com/your-username  
**Email**: your-email@company.com  
**Twitter**: @your-handle
```

### ワークショップ用
```markdown
<!-- _class: lead -->

# お疲れさまでした！

## アンケートにご協力ください

**質問・相談**: your-email@example.com  
**資料**: [リンク先]
```