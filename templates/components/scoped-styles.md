# Scoped Style 部品集

Marpで `<!-- _style: scoped -->` を使用するためのスタイル部品集です。各スライドに必要な部分だけコピーして使用してください。

## 🎨 基本的なコンテンツボックス

### ハイライトボックス

#### GitHub Dark テーマ用
```html
<!-- _style: scoped -->
<style>
.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin: 10px 0;
  font-weight: bold;
  text-align: center;
}
</style>

<div class="highlight">
重要なポイントをここに書く
</div>
```

#### Canyon Custom テーマ用
```html
<!-- _style: scoped -->
<style>
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
</style>

<div class="highlight">
重要なポイントをここに書く
</div>
```

### デモボックス

#### GitHub Dark テーマ用
```html
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
</style>

<div class="demo">
**デモ内容**
実演やサンプルコードをここに書く
</div>
```

#### Canyon Custom テーマ用
```html
<!-- _style: scoped -->
<style>
.demo {
  background: #f8f9fa;
  border-left: 4px solid #00BCD4;
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0;
}
</style>

<div class="demo">
**デモ内容**
実演やサンプルコードをここに書く
</div>
```

## 🏃‍♂️ ワークショップ専用スタイル

### 実習ボックス
```html
<!-- _style: scoped -->
<style>
.exercise {
  background: #fff3cd;
  border: 2px solid #ffeaa7;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  position: relative;
}
.exercise::before {
  content: "🏃‍♂️ 実習";
  position: absolute;
  top: -12px;
  left: 15px;
  background: #ffeaa7;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: bold;
}
.time-box {
  background: #e2e3e5;
  border-radius: 20px;
  padding: 8px 16px;
  display: inline-block;
  font-size: 0.9em;
  font-weight: bold;
  margin: 5px 0;
  color: #495057;
}
</style>

<div class="exercise">
**実習時間**: <span class="time-box">30分</span>

### 課題内容
1. ステップ1
2. ステップ2
3. ステップ3
</div>
```

### チェックポイントボックス
```html
<!-- _style: scoped -->
<style>
.checkpoint {
  background: #d1ecf1;
  border: 2px solid #bee5eb;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}
.checkpoint::before {
  content: "✅ チェックポイント";
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
  color: #0c5460;
}
</style>

<div class="checkpoint">
ここまでで以下ができていますか？
- [ ] 項目1
- [ ] 項目2
- [ ] 項目3
</div>
```

### タイムボックス（単体使用）
```html
<!-- _style: scoped -->
<style>
.time-box {
  background: #e2e3e5;
  border-radius: 20px;
  padding: 8px 16px;
  display: inline-block;
  font-size: 0.9em;
  font-weight: bold;
  margin: 5px 0;
  color: #495057;
}
</style>

<span class="time-box">15分</span>
```

## 💻 技術発表専用スタイル

### Tech ハイライト
```html
<!-- _style: scoped -->
<style>
.tech-highlight {
  background: linear-gradient(135deg, #1f6feb 0%, #f85149 100%);
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
  font-weight: bold;
}
</style>

<div class="tech-highlight">
技術的な重要ポイントを強調
</div>
```

### アーキテクチャボックス
```html
<!-- _style: scoped -->
<style>
.architecture {
  background: var(--gh-bg-secondary, #161b22);
  border-left: 4px solid var(--gh-accent-emphasis, #1f6feb);
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  color: var(--gh-text-primary, #f0f6fc);
}
</style>

<div class="architecture">
**システム構成**
```
┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │
└─────────────┘    └─────────────┘
```
</div>
```

### コードブロック
```html
<!-- _style: scoped -->
<style>
.code-block {
  background: var(--gh-bg-canvas-inset, #010409);
  border: 1px solid var(--gh-border-default, #30363d);
  border-radius: 8px;
  padding: 16px;
  margin: 10px 0;
  overflow-x: auto;
}
</style>

<div class="code-block">
```typescript
// コード例
interface Example {
  property: string;
}
```
</div>
```

### Before/After 比較
```html
<!-- _style: scoped -->
<style>
.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}
.comparison .before, .comparison .after {
  padding: 15px;
  border-radius: 8px;
  border: 2px solid var(--gh-border-default, #30363d);
}
.comparison .before {
  background: rgba(248, 81, 73, 0.1);
  border-color: #f85149;
}
.comparison .after {
  background: rgba(46, 160, 67, 0.1);
  border-color: #2ea043;
}
</style>

<div class="comparison">
<div class="before">
**Before**
- 問題点1
- 問題点2
</div>

<div class="after">
**After**
- 改善点1
- 改善点2
</div>
</div>
```

## 📊 レイアウト系

### 2カラムレイアウト
```html
<!-- _style: scoped -->
<style>
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 20px 0;
}
.column {
  padding: 15px;
}
</style>

<div class="two-columns">
<div class="column">
**左側の内容**
- 項目1
- 項目2
</div>

<div class="column">
**右側の内容**
- 項目A
- 項目B
</div>
</div>
```

### 3カラムレイアウト
```html
<!-- _style: scoped -->
<style>
.three-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}
.column {
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}
</style>

<div class="three-columns">
<div class="column">
**列1**
内容
</div>

<div class="column">
**列2**
内容
</div>

<div class="column">
**列3**
内容
</div>
</div>
```

## 🎯 特殊効果

### グラデーション背景
```html
<!-- _style: scoped -->
<style>
.gradient-bg {
  background: linear-gradient(135deg, rgba(31, 111, 235, 0.1) 0%, rgba(248, 81, 73, 0.1) 100%);
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

<div class="gradient-bg">
グラデーション背景のコンテンツ
</div>
```

### 影付きカード
```html
<!-- _style: scoped -->
<style>
.card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

<div class="card">
**カードタイトル**
カードの内容をここに書く
</div>
```

### 注意・警告ボックス
```html
<!-- _style: scoped -->
<style>
.warning {
  background: rgba(255, 193, 7, 0.1);
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
}
.warning::before {
  content: "⚠️ 注意";
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #ffc107;
}
.info {
  background: rgba(23, 162, 184, 0.1);
  border-left: 4px solid #17a2b8;
  border-radius: 4px;
  padding: 15px;
  margin: 15px 0;
}
.info::before {
  content: "ℹ️ 情報";
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #17a2b8;
}
</style>

<div class="warning">
注意が必要な内容
</div>

<div class="info">
参考情報
</div>
```

## 📖 使用方法のコツ

### 1. 必要な部分だけコピー
各スライドで使用するスタイルだけを選んでコピーすることで、ファイルサイズを最小限に抑えられます。

### 2. テーマに応じたスタイル選択
- **GitHub Dark**: 技術的・専門的な内容
- **Canyon Custom**: カジュアル・明るい内容

### 3. 組み合わせ使用
複数のスタイルを同じスライドで使う場合は、`<style>`タグ内にまとめて記述してください。

```html
<!-- _style: scoped -->
<style>
.highlight { /* ... */ }
.demo { /* ... */ }
.time-box { /* ... */ }
</style>
```

### 4. カスタマイズ
色やサイズを調整する場合は、CSS値を変更してください。ただし、一貫性を保つため大幅な変更は避けることをお勧めします。