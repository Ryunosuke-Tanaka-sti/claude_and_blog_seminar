---
marp: true
theme: github-dark
paginate: true
size: 16:9
style: |
  section {
    font-family: 'Hiragino Sans', 'ヒラギノ角ゴシック', 'Yu Gothic', '游ゴシック', 'Noto Sans JP', sans-serif;
  }
---

<!-- _class: lead -->

# 技術発表タイトル
## 副題・技術スタック

**発表者名**  
**所属・職種**  
**発表日**

---

## Overview

### 技術スタック

- **Language**: 言語名
- **Framework**: フレームワーク名
- **Tools**: ツール群
- **Infrastructure**: インフラ構成

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

### 発表のポイント

<div class="tech-highlight">
○○を使って××を実現する方法とその効果
</div>

---

## Background

### 技術的課題

- **パフォーマンス**: 具体的な数値と問題
- **スケーラビリティ**: 拡張性の課題
- **開発効率**: 開発フローの問題

### 従来のアプローチの限界

---

## Architecture

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

### システム構成

<div class="architecture">

**全体アーキテクチャ**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │───▶│  Database   │
└─────────────┘    └─────────────┘    └─────────────┘
```

</div>

### 技術選定の理由

---

## Implementation

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

---

## Results

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

### 開発効率の向上

---

## Lessons Learned

### 成功要因

- **ポイント1**: 具体的な成功要因
- **ポイント2**: チーム連携の改善
- **ポイント3**: 技術選定の適切さ

### 課題と改善点

- **課題1**: 残る技術的課題
- **改善点1**: 次回への改善提案

---

## Next Steps

### 今後の計画

1. **短期**: 次の3ヶ月の計画
2. **中期**: 半年から1年の展望
3. **長期**: 技術トレンドとの適合

### コミュニティへの貢献

---

<!-- _class: lead -->

# Thank you

## Q&A

**GitHub**: github.com/your-username  
**Email**: your-email@company.com  
**Twitter**: @your-handle