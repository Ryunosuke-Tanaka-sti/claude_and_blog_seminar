# 共通スタイル定義

各テンプレートで使用できる共通スタイル部品です。必要に応じて `style:` セクションにコピーして使用してください。

## ハイライトボックス系

### 基本ハイライト（github-dark用）
```css
.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin: 10px 0;
  font-weight: bold;
  text-align: center;
}
```

### 明るいハイライト（canyon-custom用）
```css
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
```

## コンテンツボックス系

### デモボックス（github-dark用）
```css
.demo {
  background: var(--gh-bg-secondary, #161b22);
  border: 2px solid var(--gh-border-default, #30363d);
  border-radius: 8px;
  padding: 20px;
  margin: 0 0;
  color: var(--gh-text-primary, #f0f6fc);
}
```

### デモボックス（canyon-custom用）
```css
.demo {
  background: #f8f9fa;
  border-left: 4px solid #00BCD4;
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0;
}
```

## 特殊コンテンツ系

### 実習ボックス
```css
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
```

### チェックポイントボックス
```css
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
```

### タイムボックス
```css
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
```

## テーブルスタイル

### GitHub Dark テーマ用
```css
th, td {
  border: 1px solid var(--gh-border-default, #30363d);
  padding: 12px;
  text-align: center;
  color: var(--gh-text-primary, #f0f6fc);
}
th {
  background-color: var(--gh-bg-tertiary, #21262d);
  font-weight: 600;
}
td {
  background-color: var(--gh-bg-secondary, #161b22);
}
```

## コードブロック

### GitHub Dark用コードスタイル
```css
code {
  background-color: var(--gh-bg-secondary, #161b22);
  color: var(--gh-text-primary, #f0f6fc);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Source Code Pro', 'SFMono-Regular', Consolas, monospace;
  border: 1px solid var(--gh-border-default, #30363d);
}
```

## 比較レイアウト

### Before/After比較
```css
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
```