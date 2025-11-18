# 実装計画書：セミナースライド一覧ページ

## プロジェクト概要

### 目的
Marpでビルドされた技術セミナースライド（全11ファイル）をトップページから参照可能にし、各スライドのタイトル、概要、対象者などの情報を表示する一覧ページを実装する。

### スコープ
- **対象**: フロントエンド（Astro + React）
- **実装範囲**: トップページへの新セクション追加、またはセミナー専用ページの作成
- **必須機能**: スライド一覧表示、各スライドへのリンク
- **推奨機能**: サムネイル画像、カテゴリタグ、対象者情報
- **オプション機能**: 検索、フィルタリング（将来の拡張として残す）

## 開発アプローチ

### 3フェーズ開発の適用
1. **計画フェーズ（完了）**: `docs/features/frontend-seminar-index/spec.md`
2. **実装フェーズ（これから）**: `application/frontend/src/`配下で実装
3. **検証フェーズ（実装後）**: `docs/research/`で差分分析

### AIデザイン駆動の適用
- **人間が注力すること**: 情報設計（何を表示するか、優先度は何か）
- **AIに委ねること**: UI/UXデザイン、色、フォント、レイアウトの詳細

## 技術仕様サマリー

### 使用技術
- **フレームワーク**: Astro 4.x (SSG)
- **UIライブラリ**: React 18.x（インタラクティブ部分、必要に応じて）
- **スタイリング**: Astroの標準CSS（スコープ付き）
- **TypeScript**: 5.x

### データソース
- **静的データ**: `src/data/seminarSlides.ts`にメタデータを定義
- **スライドファイル**: `dist/slides/*.html`（Marpビルド成果物）

### ディレクトリ構成
```
application/frontend/src/
├── data/
│   └── seminarSlides.ts          # 新規作成（スライドメタデータ）
├── types/
│   └── seminarSlide.ts           # 新規作成（型定義）
├── components/
│   ├── molecules/
│   │   └── SeminarSlideCard.tsx  # 新規作成（スライドカード）
│   └── organisms/
│       └── SeminarSlideList.tsx  # 新規作成（スライド一覧）
└── pages/
    └── index.astro               # 既存ファイルに追加
```

## 作成するファイルの詳細

### 1. 型定義ファイル: `src/types/seminarSlide.ts`

**目的**: スライドデータの型を定義

**内容**:
```typescript
export interface SeminarSlide {
  // 必須項目
  id: string;
  title: string;
  url: string;
  description: string;

  // 任意項目
  thumbnail?: string;
  targetAudience?: string[];
  theme?: 'canyon-custom' | 'github-dark';
  slideCount?: number;
  categories?: string[];
  createdAt?: string;
  updatedAt?: string;
}
```

**注意点**:
- 必須項目（`id`, `title`, `url`, `description`）は`?`なし
- 任意項目は`?`をつける

---

### 2. データ定義ファイル: `src/data/seminarSlides.ts`

**目的**: 11個のスライドのメタデータを定義

**内容**:
```typescript
import type { SeminarSlide } from '@/types/seminarSlide';

export const seminarSlides: SeminarSlide[] = [
  {
    id: 'claude_seminar_slides',
    title: '今日から使える Claude 活用で技術ブログ執筆を 3 倍速に',
    url: '/slides/claude_seminar_slides.html',
    description: 'Claude AIを使った技術ブログ執筆の効率化テクニックを紹介。プロンプトエンジニアリングから品質管理まで、実践的な手法を学べます。',
    targetAudience: ['技術ブロガー', 'AIツール初心者'],
    theme: 'github-dark',
    categories: ['Claude活用', 'ブログ執筆'],
  },
  // ... 残り10個のスライド
];
```

**実装時の注意**:
- **全11個のスライドを定義する**（仕様書の「現在のスライド一覧」を参照）
- `description`は2-3行で具体的に記述
- `targetAudience`と`categories`は適切に推測して記述
- `url`は必ず`/slides/`で始まる

---

### 3. スライドカードコンポーネント: `src/components/molecules/SeminarSlideCard.tsx`

**目的**: 単一のスライド情報をカード形式で表示

**Props**:
```typescript
interface SeminarSlideCardProps {
  slide: SeminarSlide;
}
```

**表示内容**:
- サムネイル画像（なければデフォルト画像）
- スライドタイトル（最重要）
- 概要（重要）
- 対象者（重要）
- カテゴリタグ（補足）
- スライドへのリンク（新しいタブで開く）

**デザイン要件**:
- 既存の`.feature-card`スタイルと調和するデザイン
- ホバー時に視覚的フィードバック
- レスポンシブ対応
- キーボード操作対応

**注意点**:
- `target="_blank"` と `rel="noopener noreferrer"` を設定
- aria-labelを適切に設定（アクセシビリティ）

---

### 4. スライド一覧コンポーネント: `src/components/organisms/SeminarSlideList.tsx`

**目的**: 複数のスライドカードをグリッド表示

**Props**:
```typescript
interface SeminarSlideListProps {
  slides: SeminarSlide[];
}
```

**表示内容**:
- セクションタイトル（例：「技術セミナースライド」）
- セクション説明（簡単な導入文）
- スライドカードのグリッド表示

**レイアウト**:
- デスクトップ（1025px〜）: 3列グリッド
- タブレット（769px〜1024px）: 2列グリッド
- モバイル（〜768px）: 1列グリッド

**注意点**:
- `SeminarSlideCard`コンポーネントを使用
- グリッドのgapは既存の`.feature-grid`を参考にする

---

### 5. トップページの更新: `src/pages/index.astro`

**目的**: 既存のトップページに新セクションを追加

**追加内容**:
```astro
---
import SeminarSlideList from '@/components/organisms/SeminarSlideList';
import { seminarSlides } from '@/data/seminarSlides';
---

<!-- 既存のセクション -->
<section class="features">
  <!-- 既存の内容 -->
</section>

<!-- 新規セクション -->
<section class="seminars">
  <SeminarSlideList slides={seminarSlides} client:load />
</section>
```

**スタイリング**:
- 既存のCSSカスタムプロパティを使用（`--color-primary`, `--color-bg-secondary`など）
- 既存のセクションと統一感のあるデザイン

**注意点**:
- `client:load`または`client:idle`ディレクティブの使用を検討（Reactコンポーネントの場合）
- 静的データのみの場合は、Astroコンポーネントとして実装する方が軽量

---

## 実装順序

### フェーズ1: 基礎実装（最優先）
1. **型定義の作成**: `src/types/seminarSlide.ts`
2. **データ定義の作成**: `src/data/seminarSlides.ts`（全11スライドを定義）
3. **ビルド確認**: 型エラーがないことを確認

### フェーズ2: コンポーネント実装
4. **スライドカードの実装**: `src/components/molecules/SeminarSlideCard.tsx`
5. **スライド一覧の実装**: `src/components/organisms/SeminarSlideList.tsx`
6. **ビルド確認**: コンポーネントのビルドが通ることを確認

### フェーズ3: 統合と調整
7. **トップページへの統合**: `src/pages/index.astro`に新セクション追加
8. **スタイリングの調整**: 既存デザインとの調和を確認
9. **レスポンシブ確認**: モバイル・タブレット・デスクトップで表示確認

### フェーズ4: 品質確保
10. **アクセシビリティ確認**: キーボード操作、スクリーンリーダー対応
11. **リンク動作確認**: 各スライドへのリンクが正しく機能するか
12. **ビルド最終確認**: `npm run build`が成功することを確認

## 検証計画

### テスト項目

#### 1. 情報表示の確認
- [ ] 全11個のスライドが表示されている
- [ ] 各スライドのタイトルが正しく表示されている
- [ ] 概要文が読みやすく表示されている
- [ ] 情報の優先度が適切（タイトルが最も目立つ）

#### 2. インタラクションの確認
- [ ] スライドカードをクリックすると正しいURLに遷移する
- [ ] リンクが新しいタブで開く（`target="_blank"`）
- [ ] ホバー時に視覚的フィードバックがある
- [ ] キーボードのTabキーでカード間を移動できる

#### 3. レスポンシブの確認
- [ ] モバイル（〜768px）: 1列表示
- [ ] タブレット（769px〜1024px）: 2列表示
- [ ] デスクトップ（1025px〜）: 3列表示
- [ ] 各デバイスで情報の優先度が保たれている

#### 4. アクセシビリティの確認
- [ ] スクリーンリーダーで各カードの情報が読み上げられる
- [ ] リンクに適切なaria-labelが設定されている
- [ ] 色のコントラストがWCAG AA準拠

#### 5. ビルドの確認
- [ ] `npm run build --workspace=application/frontend`が成功する
- [ ] ビルド成果物のサイズが適切（過度に大きくない）
- [ ] コンソールにエラーや警告が出ていない

### 合格基準
- 上記の全テスト項目が✅になること
- ビルドが成功すること
- 既存のページ（トップページの他のセクション）が壊れていないこと

## リスクと対策

### リスク1: データ定義の漏れ
**リスク**: 11個のスライドのうち、一部のメタデータが不足している

**対策**:
- 仕様書の「現在のスライド一覧」セクションを参照
- 各スライドの`description`は具体的に記述（推測でも可）
- 不明な項目は省略可能（任意項目のため）

### リスク2: 既存デザインとの不整合
**リスク**: 新セクションのデザインが既存のトップページと調和しない

**対策**:
- 既存の`.feature-card`スタイルを参考にする
- CSSカスタムプロパティ（`--color-*`）を活用
- 既存のグリッドレイアウトを踏襲

### リスク3: パフォーマンス劣化
**リスク**: 11個のカード表示により初期ロードが遅くなる

**対策**:
- サムネイル画像は遅延ロード（`loading="lazy"`）
- 画像最適化（WebP形式、適切なサイズ）
- 静的データのため、外部API呼び出しなし

### リスク4: スライドURLの変更
**リスク**: 将来的にスライドのURLパスが変更される可能性

**対策**:
- URLは`seminarSlides.ts`で一元管理
- ベースパスが変更される場合は、データファイルのみ更新すればOK

## 成功基準

### 機能要件
- ✅ トップページから全11個のスライドにアクセス可能
- ✅ 各スライドのタイトル、概要が表示されている
- ✅ スライドカードをクリックすると、正しいスライドが新しいタブで開く

### 非機能要件
- ✅ レスポンシブ対応（モバイル・タブレット・デスクトップ）
- ✅ アクセシビリティ対応（キーボード操作、スクリーンリーダー）
- ✅ ビルドが成功する（`npm run build`）

### デザイン要件
- ✅ 既存のトップページデザインと調和している
- ✅ 情報の優先度が視覚的に適切（タイトルが最も目立つ）
- ✅ ホバー時の視覚的フィードバックがある

### 情報設計要件
- ✅ 最重要情報（タイトル・リンク）が明確
- ✅ 重要情報（概要・対象者）が適切に表示されている
- ✅ 補足情報（カテゴリタグ）が過度に目立たない

## タイムライン

### 想定作業時間
- **型定義・データ定義**: 30分
- **コンポーネント実装**: 1時間
- **トップページ統合**: 30分
- **スタイリング調整**: 1時間
- **テスト・確認**: 30分

**合計**: 約3.5時間

### マイルストーン
1. **フェーズ1完了**: 型定義とデータ定義が完成し、ビルドが通る
2. **フェーズ2完了**: コンポーネントが実装され、単体で動作する
3. **フェーズ3完了**: トップページに統合され、全体が動作する
4. **フェーズ4完了**: 全テスト項目が✅、ビルドが成功

## 実装時の重要な注意点

### データ定義の重要性
`seminarSlides.ts`のデータ品質が実装の成否を左右します：
- **タイトル**: Marpソースファイルの最初の`#`見出しと一致させる
- **URL**: 必ず`/slides/`で始まり、`.html`で終わる
- **説明**: 2-3行で具体的に、何を学べるかを明記
- **対象者**: 具体的なペルソナ（例：「技術ブロガー」「AI初心者」）

### デザインの一貫性
既存のトップページとの調和が重要です：
- **カラースキーム**: `--color-primary`, `--color-bg-secondary`などを使用
- **フォントサイズ**: 既存の`.feature-card h3`を参考にする
- **グリッドレイアウト**: 既存の`.feature-grid`と同じgapとresponsive設定

### アクセシビリティ
以下を必ず実装してください：
- `aria-label`の設定（各スライドカードに説明的なラベル）
- `target="_blank"`には`rel="noopener noreferrer"`を追加
- キーボード操作のサポート（Tab, Enter）

## 関連ドキュメント

### 仕様書
- **本機能の仕様書**: `docs/features/frontend-seminar-index/spec.md`

### 参考資料
- **GitHub Pagesデプロイメント確定仕様**: `docs/spec/infra/github-pages-deployment.md`
- **フロントエンド実装ルール**: `application/frontend/CLAUDE.md`
- **既存のトップページ**: `application/frontend/src/pages/index.astro`
- **Marp実装ルール**: `application/marp/CLAUDE.md`

### プロジェクト全体ガイド
- **3フェーズ開発ガイド**: `docs/spec-based-development-guide.md`
- **計画フェーズルール**: `docs/CLAUDE.md`

---

## 実装開始時のチェックリスト

実装を開始する前に、以下を確認してください：

- [ ] 仕様書（`spec.md`）を読んだ
- [ ] この計画書（`plan.md`）を読んだ
- [ ] フロントエンド実装ルール（`application/frontend/CLAUDE.md`）を読んだ
- [ ] 既存のトップページ（`index.astro`）を確認した
- [ ] 11個のスライドのタイトルを把握した
- [ ] 実装順序を理解した

**準備が整ったら、実装フェーズに進んでください！**
