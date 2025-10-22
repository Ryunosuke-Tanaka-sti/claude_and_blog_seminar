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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 10px;
    margin: 10px 0;
    font-weight: bold;
    text-align: center;
  }
  .box {
    border: 2px solid var(--gh-border-default, #30363d);
    border-radius: 8px;
    padding: 15px 20px;
    margin: 10px 0;
    background: var(--gh-bg-secondary, #161b22);
  }
  .box.red {
    border-color: #f85149;
  }
  .box.green {
    border-color: #3fb950;
  }
  .box.blue {
    border-color: #58a6ff;
  }
  .box.yellow {
    border-color: #d29922;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
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
  code {
    background-color: var(--gh-bg-secondary, #161b22);
    color: var(--gh-text-primary, #f0f6fc);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Source Code Pro', 'SFMono-Regular', Consolas, monospace;
    border: 1px solid var(--gh-border-default, #30363d);
  }
  pre {
    background-color: var(--gh-bg-canvas-inset, #010409);
    color: var(--gh-text-primary, #f0f6fc);
    border: 1px solid var(--gh-border-default, #30363d);
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    white-space: pre;
    word-break: keep-all;
    overflow-wrap: normal;
  }
  pre code {
    background: none;
    border: none;
    padding: 0;
    white-space: pre;
    word-break: keep-all;
    overflow-wrap: normal;
  }
  /* インラインコードは改行を許可しない */
  code {
    word-break: keep-all;
    overflow-wrap: normal;
    white-space: nowrap;
  }
  img {
    max-width: 100%;
    max-height: 450px;
    margin: 0 auto;
    display: block;
  }
  section > img:only-child {
    max-height: 520px;
  }
  .small {
    font-size: 0.85em;
  }
  .tiny {
    font-size: 0.75em;
  }
---

<!--_class: title-->

# フロント×バック型定義同期の実践術

## Orval最適化で爆速開発を実現
### 自動化パイプライン深掘りセミナー

---

# 本日のゴール

<div class="highlight">
型定義同期の自動化 + Orval最適化で
フロント・バック並行開発を実現
</div>

## 今日持ち帰っていただくこと

1. **Single Source of Truth** - DTOを唯一の型定義源とする設計思想
2. **エラー型設計の重要性** - 型安全なエラーハンドリングの実現
3. **Orval最適化テクニック** - バンドルサイズ20-30%削減
4. **実測データ** - 47ファイル移行で70-79%効率化

---

# セミナー構成

**Part 1: 型定義問題と自動化の必要性（10分）**
- 従来の3つの問題、Single Source of Truth

**Part 2: 自動生成パイプラインの構築（15分）**
- DTO設計、OpenAPI生成、Orval、エラー型設計

**Part 3: Orval最適化の実践（10分）**
- 自動生成の罠、最適化設定、実測データ

**まとめ・実践への提案（5分）**
- 重要ポイント、導入ステップ、Q&A

---

<!-- _class: subTitle-->

# Part 1: 型定義問題と自動化の必要性

## なぜ手動管理では限界があるのか

---

# 従来の開発で発生していた3つの問題

<div style="font-size: 0.9em;">

<div class="box red">

## 問題1: 型定義の重複管理
- バックエンド（DTOクラス）とフロントエンド（手動作成）で同じ情報を2箇所管理

</div>

<div class="box red">

## 問題2: 型定義の不整合
- DTOの変更がフロントに反映されず、プロパティ名不一致や必須/オプショナル設定ミスが発生

</div>

</div>

---

# 型定義の不整合の具体例

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.85em;">

<div>

## バックエンドDTO
```typescript
export class CreatePostDto {
  @IsString()
  @MaxLength(280)
  text: string;  // 必須

  @IsOptional()
  @IsArray()
  mediaIds?: string[];  // オプショナル
}
```

</div>

<div>

## フロントエンド型定義（誤り）
```typescript
interface CreatePost {
  text?: string;  // [NG] 誤ってオプショナル
  mediaIds: string[];  // [NG] 誤って必須
}
```

</div>

</div>

**結果**: コンパイルは通るが、ランタイムでエラーが発生

---

# 問題3: エラー型が自動生成されない

<div style="font-size: 0.9em;">

<div class="box red">

**問題の詳細**
- OpenAPI仕様でエラーレスポンス型定義が不十分、フロントで`any`型になり実行時エラー増加、IDEの補完も効かない

</div>

<div class="box yellow">

**なぜ見落とされるのか**
- 成功パターンに注力しがちで、エラーレスポンス設計が後回しになり、各エンドポイントで一貫性がない

</div>

</div>

---

# Single Source of Truth（単一の真実の源）

<div style="font-size: 0.85em;">

<div class="box blue">

**設計思想**

1. **DTOを唯一の型定義源とする**
   - NestJSのDTOクラスが全ての型定義のマスター、デコレーターから制約情報も自動抽出

2. **自動生成による同期**
   - 手動での型定義作成を完全に排除、ビルドプロセスに自動生成を組み込み

3. **Vibe Codingとの調和**
   - 計画フェーズでDTOの設計に集中、実装フェーズでは自動生成された型を使用
   - 型定義の同期という機械的作業から解放

</div>

</div>

---

# なぜ自動化パイプラインが必要なのか

<div style="font-size: 0.85em;">

<div class="box blue">

**人間とAIの役割分担の再定義**
- 人間（意思決定・監視）、AI（実装実行）、自動化（機械的同期作業）

</div>

<div class="box green">

**自動化が解決する4つの課題**
1. 型定義の不整合をコンパイル時に100%検出
2. 手動同期の工数とミスを完全自動化で解消
3. フロント・バック並行開発を型定義先行で可能に
4. エラーハンドリングの型安全性を統一エラー型で実現

</div>

</div>

---

<!-- _class: subTitle-->

# Part 2: 自動生成パイプラインの構築

## Nest.js → OpenAPI → Orval → Next.js

---

# パイプラインの全体像

```
Nest.js (バックエンド)
    ↓ @nestjs/swagger デコレーター
OpenAPI Spec 自動生成
    ↓ /docs/api/openapi.yaml
Orval で型定義・関数生成
    ↓ mode: "single", client: "axios-functions"
Next.js (フロントエンド)
    ↓
型安全なフロント・バック連携
```

<div class="box green">

**人間もAIも触らないファイルを作成**
- 自動生成ファイルは変更禁止、DO NOT EDITコメント、CLAUDE.mdで明文化

</div>

---

# ステップ1: DTOクラスの設計パターン

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray } from 'class-validator';

export class CreateScheduledPostDto {
  @ApiProperty({
    description: '投稿内容',
    maxLength: 280,
    example: '予約投稿テスト #test'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  text: string;

  @ApiProperty({
    description: 'メディアID配列',
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  mediaIds?: string[];
}
```

---

# OpenAPI Spec自動生成の流れ

<div style="font-size: 0.85em;">

<div class="box blue">

**必須要素**
- @ApiProperty（情報提供）、バリデーションデコレーター（制約定義）、型変換デコレーター（実行時変換）

</div>

<div class="box green">

**生成される仕様の品質**
- 完全性（全エンドポイント網羅）、詳細度（全フィールド）、ドキュメント（説明・例・制約含む）

</div>

</div>

**コマンド**: `npm run generate:openapi`

---

# 重要: エラー型設計の必要性

<div style="font-size: 0.85em;">

<div class="box red">

**問題: エラー型が自動生成されない**
- OpenAPI仕様でエラーレスポンス型定義が不十分、フロントで`any`型になり実行時エラー予防不可

</div>

<div class="box green">

**解決: RFC 7807準拠の統一エラー型**
- type（種別識別子）、title（短い説明）、status（HTTPコード）、detail（詳細）、timestamp（発生時刻）、traceId（トレースID）

</div>

</div>

---

# エラー型の基本構造: OpenAPI定義

<div class="box blue">

## RFC 7807準拠のエラーレスポンス定義

```yaml
components:
  schemas:
    ApiErrorResponse:
      type: object
      required:
        - type
        - title
        - status
        - timestamp
      properties:
        type:
          type: string
          example: "validation-error"
        title:
          type: string
          example: "Validation Failed"
        status:
          type: integer
          example: 400
        detail:
          type: string
          example: "詳細なエラーメッセージ"
        timestamp:
          type: string
          format: date-time
        traceId:
          type: string
```

</div>

**各エンドポイントで400, 401, 403, 404, 500のエラー型を定義**

---

# エラー型の基本構造: フロントエンドでの使用

<div class="box green">

## 型安全なエラーハンドリング

```typescript
// [OK] 型安全なエラーハンドリング
if (error?.response?.data) {
  const apiError = error.response.data as ApiErrorResponse;

  console.error(apiError.title);
  console.error(apiError.detail);

  // 型に基づいた分岐
  if (apiError.type === 'validation-error') {
    // ValidationErrorResponse として型安全にアクセス
    // IDEの補完が効く
  } else if (apiError.type === 'authentication-error') {
    // 認証エラーの処理
  }
}
```

</div>

**利点**: IDEの補完が効く、実行時エラーを防げる、エラーの種類を型で管理

---

# ステップ2: Orvalでフロントエンド生成

<div style="font-size: 0.85em;">

<div class="box blue">

**Orvalとは**
- OpenAPI仕様からTypeScriptコード自動生成、Axios/React Query/SWR等に対応

</div>

<div class="box green">

**基本設定**
```typescript
// orval.config.ts
export default defineConfig({
  api: {
    input: '../../../docs/api/openapi.yaml',
    output: {
      mode: "single",             // 直接エクスポート
      client: "axios-functions",  // Axios関数のみ生成
      target: 'lib/api/generated.ts',
      schemas: 'types/generated',
    }
  }
});
```

</div>

---

# 生成される成果物

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.85em;">

<div class="box blue">

## 型定義ファイル
`types/generated/*.ts`

**特徴**: DTOと1対1対応、JSDocコメント付き、制約情報も型レベルで表現

```typescript
export interface CreateScheduledPostDto {
  /**
   * 投稿内容
   * @maxLength 280
   */
  text: string;
  /** メディアID配列 */
  mediaIds?: string[];
}
```

</div>

<div class="box green">

## API呼び出し関数
`lib/api/generated.ts`

**特徴**: 型安全なAPI関数、Axios設定済み、エラー型も含む

```typescript
export const seriesDraftsControllerFindAll =
  (): Promise<SeriesDraft[]> => {
    return axiosClient({
      url: '/api/series-drafts',
      method: 'GET'
    });
  };
```

</div>

</div>

---

# ステップ3: Claudeへの通知と制御

<div style="font-size: 0.9em;">

<div class="box red">

**DO NOT EDITコメントの挿入**
```typescript
// DO NOT EDIT - Auto Generated by Orval
```

</div>

<div class="box yellow">

**CLAUDE.mdでの明文化**
- 自動生成ファイル（`lib/api/generated.ts`, `types/generated/`）は変更禁止
- 変更必要時は`backend/`の定義を修正 → `npm run generate:api`で再生成

</div>

</div>

**注意**: AIは時々無視する（約10-20%の確率） → 無視された場合は即座に指摘

---

# プロジェクト構成の最適化

```
/
├── CLAUDE.md                    # プロジェクト全体のガイドライン
├── docs/                        # 計画・設計フェーズ
│   ├── CLAUDE.md                # 計画フェーズ専用ルール
│   └── api/                     # OpenAPI Spec
│       └── openapi.yaml
└── application/                 # 実装フェーズ
    ├── backend/
    │   ├── CLAUDE.md            # バックエンド実装ルール
    │   └── src/
    │       ├── dto/             # DTOクラス（Single Source of Truth）
    │       └── main.ts          # OpenAPI生成設定
    └── frontend/
        ├── CLAUDE.md            # フロントエンド実装ルール
        ├── lib/api/
        │   └── generated.ts     # 自動生成（変更禁止）
        └── types/generated/     # 自動生成（変更禁止）
```

---

# 各CLAUDE.mdの役割

<div style="font-size: 0.85em;">

<div class="box blue">

**プロジェクト全体** (`/CLAUDE.md`)
- 共通ルール、フェーズ分離、3フェーズ開発手法の説明

</div>

<div class="box green">

**バックエンド** (`application/backend/CLAUDE.md`)
- API変更手順（DTO → OpenAPI生成）、DBスキーマ変更のルール

</div>

<div class="box yellow">

**フロントエンド** (`application/frontend/CLAUDE.md`)
- 自動生成ファイル変更禁止の明示、ライブラリ制限、API呼び出しガイドライン

</div>

</div>

---

# 大規模プロジェクトでの運用課題

<div class="box yellow">

**課題: フロント・バック担当者が異なる場合**
- OpenAPI Specを共有リソースとして管理
- 変更通知の仕組み（GitHub Actions、Slack連携）

</div>

<div class="box green">

**解決策: 並行開発の実現方法**

1. **モックサーバーの活用** - Prism、MSWなどでモック実装
2. **型定義先行アプローチ** - OpenAPI Spec を先に作成
3. **段階的統合** - 型定義 → モック → 実装の順で段階的に

</div>

---

<!-- _class: subTitle-->

# Part 3: Orval最適化の実践

## 便利すぎる自動生成の罠と解決策

---

# 便利すぎる自動生成の罠

<div class="box red">

**初期設定の問題**
```typescript
// orval.config.ts（旧設定）
export default defineConfig({
  api: {
    output: {
      mode: "split",      // [NG] ラッパー関数が生成される
      client: "swr",      // [NG] 全エンドポイントにSWRフック
    }
  }
});
```

</div>

**発生した4つの問題**
1. 生成された関数がエクスポートされない
2. バンドルサイズの肥大化
3. 不要なSWRオーバーヘッド
4. コンポーネント設計の硬直化

---

# 問題1: 生成された関数がエクスポートされない

<div class="box red">

**症状**
```typescript
// [NG] エラー
import { googleAuthControllerAnalyzeDayOfWeekPerformance }
  from "@/lib/api/generated";
// Module '"@/lib/api/generated"' has no exported member
```

**原因**
- `mode: "split"` により `getLINEBotPromptBattleAPI()` ラッパー関数が生成
- 関数が直接エクスポートされず、ラッパー経由でのみアクセス可能

</div>

<div class="box green">

**解決**
```typescript
mode: "single"  // [OK] 直接エクスポートに変更
```

</div>

---

# 問題2-4: バンドル肥大化、不要なオーバーヘッド

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 22px; }
</style>

| 項目 | Before | After | 改善 |
|------|--------|-------|------|
| 自動生成フック数 | 41個 | 0個 | 完全削除 |
| バンドルサイズ | 100% | 70-80% | **20-30%削減** |
| コード行数 | ~2030行 | ~800行 | **約60%削減** |

<div class="box red">

**問題3**: 全エンドポイント分のSWRフックが自動生成され、mutation（POST/PUT/DELETE）にもSWRが適用される

**問題4**: SWRの状態（`isMutating`, `error`）とフォームの状態（`isSubmitting`, `validationErrors`）が分裂し、エラーハンドリングが複雑化

</div>

---

# SWRの本質を見つめ直す

<div style="font-size: 0.85em;">

<div class="box blue">

**SWRが最適な用途**
- Read（データ取得）、キャッシュ戦略、自動再検証、複数コンポーネント間データ共有

</div>

<div class="box red">

**SWRが不適切な用途**
- CUD（Create/Update/Delete）、一回限りのmutation、フォーム送信
- **useSWRMutationの問題**: フォーム状態統合が煩雑、不要なキャッシュオーバーヘッド

</div>

</div>

---

# 最適化された設定

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.8em;">

<div class="box red">

## Before（旧設定）
```typescript
export default defineConfig({
  api: {
    output: {
      mode: "split",      // [NG]
      client: "swr",      // [NG]
      target: 'lib/api/generated.ts',
    }
  }
});
```

**問題点**: ラッパー関数生成、全エンドポイントにSWRフック、バンドル肥大化

</div>

<div class="box green">

## After（新設定）
```typescript
export default defineConfig({
  api: {
    output: {
      mode: "single",           // [OK]
      client: "axios-functions",// [OK]
      target: 'lib/api/generated.ts',
      schemas: 'types/generated',
      override: {
        mutator: {
          path: './lib/axiosClient.ts',
          name: 'axiosClient'
        }
      }
    }
  }
});
```

**改善点**: 直接エクスポート、Axios関数のみ、バンドル削減

</div>

</div>

---

# axiosInstance とは

<div class="box blue">

## 標準的なAxiosインスタンス

**用途**:
- インターセプター設定
- 直接HTTP呼び出し
- グローバル設定
- **開発者が直接使用する**

**使用例**:
```typescript
// [OK] 正しい使用例
import { axiosInstance } from "@/lib/axiosClient";

const response = await axiosInstance.get("/.auth/me");
const result = await axiosInstance.post("/api/custom", data);
```

**特徴**: 通常のAxiosと同じAPI（`.get()`, `.post()`, `.put()`, `.delete()` が使える）

</div>

---

# axiosClient とは（注意が必要）

<div class="box green">

## Orval mutator関数

**用途**:
- Orval生成時のカスタムmutator
- **自動生成API関数内でのみ使用**
- configオブジェクトを受け取る
- **開発者が直接使用してはいけない**

**誤った使用例（エラーになる）**:
```typescript
// [NG] 直接使用は禁止
import { axiosClient } from "@/lib/axiosClient";

await axiosClient.get("/api/users");
// TypeError: axiosClient.get is not a function
```

</div>

<div class="box red">

**実際のバグ**: プロジェクト内で3ファイルで混同が発覚し、修正が必要だった

</div>

---

# 適材適所のアプローチ

<div class="highlight">
Read（GET） → SWRの恩恵を最大限活用<br>
CUD（POST/PUT/DELETE） → シンプルにAxiosで十分
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; font-size: 0.9em;">

<div class="box green">

**データ取得（Read）**
- カスタムSWRフック
- キャッシュ・再検証
- データ共有

</div>

<div class="box blue">

**Mutation（CUD）**
- 直接Axios
- useState管理
- シンプル実装

</div>

</div>

---

# パターン1: データ取得（Read）

```typescript
/**
 * シリーズ下書き一覧を取得するカスタムフック SWRのキャッシュ・再検証・データ共有の恩恵を受けられる
 */
export const useSeriesDraftsControllerFindAll = () => {
  return useSWR("/api/series-drafts", () => seriesDraftsControllerFindAll());
};

// コンポーネントでの使用
const { data, error, isLoading, mutate } = useSeriesDraftsControllerFindAll();
```

**利点**: SWRのキャッシュ戦略により複数コンポーネントで同じデータを効率的に共有

---

# パターン2: Mutation（CUD）

```typescript
/**
 * シリーズ下書きを作成する処理 
 * SWRのオーバーヘッドなしで、シンプルに実装できる
 */
const handleCreate = async (data) => {
  setIsCreating(true);
  try {
    await seriesDraftsControllerCreate(data);
    mutate("/api/series-drafts");
  } finally {
    setIsCreating(false);
  }
};
```

**利点**: 不要なオーバーヘッドを回避、フォーム状態との統合が容易

---

# 移行結果の数値効果

<style scoped>
  table { table-layout: fixed; width: 100%; display:table; font-size: 22px; }
</style>

**対象範囲: 47ファイル全て移行完了**

| 項目 | Before | After | 改善 |
|------|--------|-------|------|
| 自動生成フック数 | 41個 | 0個 | 完全削除 |
| バンドルサイズ | 100% | 70-80% | **20-30%削減** |
| コード行数 | ~2030行 | ~800行 | **約60%削減** |
| 移行工数 | 推定14-20時間 | **実績4.2時間** | **70-79%効率化** |

<div class="box green" style="margin-top: 10px; padding: 12px;">

**作成したカスタムSWRフック**
必要な9個のみ作成（シリーズ下書き、GA分析API×4、X認証・GitHub API×3）

</div>

</div>

---

# AI協働による効率化

<div style="font-size: 0.9em;">

<div class="box green" style="margin: 5px 0; padding: 12px;">

**推定14-20時間 → 実績4.2時間（70-79%効率化）**

**なぜこれほど効率化できたのか？**
- Axiosの関数がパーツとして提供されていた
- AIに実装を任せる際もスムーズに進行
- 型定義が自動生成されているため、型エラーで即座に問題検出

</div>

<div class="box blue" style="margin: 5px 0; padding: 12px;">

**移行中に発見したバグ**
- axiosClient と axiosInstance の混同（3ファイル）
- 期待される401エラーのノイズ（開発環境でのコンソール煩雑化）

移行作業のおかげで、潜在的なバグを早期発見

</div>

</div>

---

# パーツ提供の考え方

<div style="font-size: 0.9em;">

<div class="highlight" style="padding: 15px; margin: 8px 0;">
すべてを自動生成するのではなく、組み立てやすいパーツを提供
</div>

<div class="box green" style="margin: 5px 0; padding: 12px;">

**AI開発効率化の鍵**
- Axiosのインターフェース部分をパーツとして切り出し
- そこに処理を書かせるだけでOK
- shadcn/uiの成功と同じアプローチ

</div>

<div class="box blue" style="margin: 5px 0; padding: 12px;">

**この考え方の効果**
- フロントとバックの型の齟齬がなくなる
- 手が止まることが減る
- すっきりとしたコードで実装できる

</div>

</div>

---

<!-- _class: subTitle-->

# まとめ・実践への提案

## 今日から始める自動化パイプライン

---

# 重要ポイントの整理

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 0.85em;">

<div>

**1. Single Source of Truth**
- DTOを唯一の型定義源とする
- 手動での型定義作成を完全に排除

**2. エラー型設計の重要性**
- RFC 7807準拠の統一エラー型
- 型安全なエラーハンドリング

**3. Orvalの最適化設定**
- `mode: "single"` で直接エクスポート
- `client: "axios-functions"` でパーツのみ生成
- バンドルサイズ20-30%削減

</div>

<div>

**4. axiosInstance vs axiosClient**
- axiosInstance: グローバル設定、直接HTTP
- axiosClient: Orval mutator、自動生成専用

**5. 適材適所のアプローチ**
- Read: カスタムSWRフック
- CUD: 直接Axios呼び出し

**6. パーツ提供の思想**
- すべてを自動化せず、組み立てやすいパーツ
- AI開発の効率化と柔軟性の両立

</div>

</div>

---

# 段階的導入ステップ

<div style="font-size: 0.85em;">

<div class="box blue">

**Step 1: 基本パイプラインの構築（1-2日）**
- DTOクラス設計、エラー型定義（RFC 7807）、OpenAPI Spec生成、Orval設定、CLAUDE.md制御ルール

</div>

<div class="box green">

**Step 2: 既存コードの移行（規模による）**
- 小規模（半日〜1日）、中規模（2-5日）、大規模（1-2週間）
- **実績**: 47ファイル 4.2時間（AI協働で70-79%効率化）

</div>

</div>

---

# よくある質問（厳選3問）

<div class="box yellow">

**Q2: エラー型を定義しないとどうなりますか？**

A: フロントエンドでエラーハンドリングが `any` 型になり、実行時エラーが増加します。IDEの補完も効きません。**エラー型設計は必須**（RFC 7807準拠を推奨）。

</div>

<div class="box red">

**Q3: axiosClient と axiosInstance の違いがわかりません**

A: **axiosInstance** = 標準的なAxiosインスタンス（`.get()`, `.post()` が使える）
**axiosClient** = Orval mutator関数（configオブジェクトを受け取る）
混同すると `TypeError: axiosClient.get is not a function` が発生。実際に3ファイルで誤使用が発覚しました。

</div>

---

# よくある質問（続き）

<div class="box green">

**Q5: バンドルサイズは本当に削減されますか？**

A: はい、実測で**20-30%削減**しました。
- 自動生成フック41個を削除
- コード行数も~2030行 → ~800行（**約60%削減**）
- 47ファイル移行で推定14-20時間が実績4.2時間（**70-79%効率化**）

</div>

<div class="box blue" style="font-size: 0.85em;">

**その他のQ&A**
- Q1: 既存プロジェクトにも適用できますか？ → はい、段階的導入が可能
- Q4: すべてのAPIにSWRフックを作る必要は？ → いいえ、Read（GET）のみ
- Q6-8: OpenAPI品質保証、他フレームワーク、React Query対応 → 詳細はAppendixへ

</div>

---

# 今日から試せること

<div style="font-size: 0.85em;">

<div class="highlight" style="padding: 15px;">
まず「DTOクラス + エラー型定義」から始めましょう
</div>

<div class="box green">

**小さく始める**
1. 1つのエンドポイントで試す → DTOに`@ApiProperty()`追加 → エラー型定義 → OpenAPI Spec生成 → Orvalで型定義自動生成

</div>

<div class="box blue">

**効果を実感する**
- 型定義の不整合をコンパイル時検出、エラーハンドリングが型安全に、フロント・バック並行開発が可能に

</div>

</div>

---

# 参考記事・リソース


**自動化パイプライン**
- [AIと爆速開発！Next.js×Nest.js型定義同期](https://tech-lab.sios.jp/archives/49157)
- [Orval SWRの自動生成をやめた理由](https://tech-lab.sios.jp/archives/49591)

**3フェーズ開発手法（基盤）**
- [Claude Code革命！3フェーズ開発で効率的な開発](https://tech-lab.sios.jp/archives/49140)
- [AI協働で仕様書アレルギー克服！](https://tech-lab.sios.jp/archives/49148)

## 公式ドキュメント
- [Orval](https://orval.dev/) - OpenAPI to TypeScript
- [NestJS Swagger](https://docs.nestjs.com/openapi/introduction)

---

<!-- _class: subTitle-->

# Appendix

## 実装チェックリスト・詳細Q&A

---

# 実装チェックリスト - Phase 1: 基盤構築

<div style="font-size: 0.7em;">

<div class="box blue">

**DTOクラスの設計**
- [ ] `@ApiProperty()`追加 → バリデーションデコレーター定義 → 型変換デコレーター設定

</div>

<div class="box yellow">

**エラー型の設計**
- [ ] 基本エラー型定義 → バリデーションエラー型 → 認証・認可エラー型 → 全エンドポイント定義（400,401,403,404,500）

</div>

<div class="box green">

**OpenAPI Spec自動生成**
- [ ] `scripts/generate-openapi.ts`作成 → `npm run generate:openapi`設定 → Swagger UI確認

</div>

</div>

---

# 実装チェックリスト - Phase 2: Orval設定

<div style="font-size: 0.7em;">

<div class="box blue">

**Orval設定ファイル作成**
- [ ] `mode: "single"` → `client: "axios-functions"` → mutator設定 → baseUrl設定

</div>

<div class="box green">

**axiosClientの実装**
- [ ] axiosInstance作成 → axiosClient mutator関数作成 → エラーハンドリング統一（401/403は console.info）

</div>

<div class="box yellow">

**自動生成の実行**
- [ ] `npm run generate:api`設定 → 生成ファイル確認 → DO NOT EDITコメント確認

</div>

</div>

---

# 実装チェックリスト - Phase 3: 実装パターン

<div style="font-size: 0.7em;">

<div class="box green">

**カスタムSWRフックの作成**
- [ ] Read用フック作成 → `hooks/`配置 → SWRキー統一（`/api/[resource]`） → エラーハンドリング統一

</div>

<div class="box blue">

**Mutation実装**
- [ ] CUD直接Axios化 → useState状態管理 → try-catch-finally適用 → SWRキャッシュ更新（`mutate()`）

</div>

<div class="box red">

**axiosInstance vs axiosClient 区別**
- [ ] 混同確認 → 直接HTTP（axiosInstance）、自動生成API（axiosClient）を正しく使用

</div>

</div>

---

# 実装チェックリスト - Phase 4-5: 検証と測定

<div style="font-size: 0.7em;">

<div class="box yellow">

**Phase 4: ドキュメントと制御**
- [ ] CLAUDE.mdルール追加 → プロジェクト構造整理 → 各フェーズ用CLAUDE.md配置・責任範囲明確化

</div>

<div class="box green">

**Phase 5: 検証と測定**
- [ ] TypeScript/ビルドエラーチェック → 動作確認・エラーハンドリングテスト → バンドルサイズ測定 → フック数・コード行数・工数記録 → ドキュメント更新

</div>

</div>

---

# トラブルシューティング（1/2）: Orval設定関連

<div style="font-size: 0.85em;">

<div class="box red">

**問題1: 生成された関数がエクスポートされない**
- **症状**: `Module has no exported member`
- **原因**: `mode: "split"` によるラッパー関数生成
- **解決**: `mode: "single"` に変更

</div>

<div class="box red">

**問題2: axiosClient.get is not a function**
- **症状**: `TypeError: axiosClient.get is not a function`
- **原因**: axiosClient と axiosInstance の混同
- **解決**: 直接HTTP呼び出しは `axiosInstance` を使用

**実際のバグ**: プロジェクト内で3ファイルで混同が発覚

</div>

</div>

---

# トラブルシューティング（2/2）: エラー処理関連

<div style="font-size: 0.85em;">

<div class="box yellow">

**問題3: エラー型が any になる**
- **症状**: エラーハンドリングで型補完が効かない
- **原因**: OpenAPI仕様にエラーレスポンス型が未定義
- **解決**: RFC 7807準拠のエラー型を定義

</div>

<div class="box yellow">

**問題4: 401エラーのノイズ**
- **症状**: 開発環境でコンソールが煩雑
- **原因**: すべてのHTTPエラーを `console.error` で出力
- **解決**: 401/403は `console.info` に変更

</div>

</div>

---

# ベストプラクティス（1/2）

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

<div>

## DTOクラスの設計
```typescript
// [OK] 良い例: 詳細な情報提供
@ApiProperty({
  description: '投稿内容',
  maxLength: 280,
  example: '予約投稿テスト #test'
})
@IsString()
@MaxLength(280)
text: string;

// [NG] 悪い例: 情報不足
@ApiProperty()
text: string;
```

</div>

<div>

## エラーハンドリング
```typescript
// [OK] 良い例: 型安全
if (error?.response?.data) {
  const apiError = error.response.data
    as ApiErrorResponse;
  console.error(apiError.title);
}

// [NG] 悪い例: any型
if (error) {
  console.error(error.message);
  // 型安全性がない
}
```

</div>

</div>

---

# ベストプラクティス（2/2）

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">

<div>

## カスタムSWRフックの命名
```typescript
// [OK] 良い例: use{Controller}{Action}
export const useSeriesDraftsControllerFindAll = () => { ... }

// [NG] 悪い例: 短すぎる命名
export const getSeriesDrafts = () => { ... }
```

</div>

<div>

## SWRキーの設計
```typescript
// [OK] パラメータなし
return useSWR("/api/series-drafts",
  () => seriesDraftsControllerFindAll());

// [OK] パラメータあり（配列キー）
return useSWR(
  params ? ["/api/posts", params] : null,
  () => getPostsByPeriod(params)
);
```

</div>

</div>

---

# よくある質問（追加5問）

<div style="font-size: 0.75em;">

<div class="box blue">

**Q1: 既存プロジェクトにも適用できますか？**

A: はい、段階的な導入が可能です。まず新規機能から適用し、効果を検証。既存コードは優先度に応じて移行（実績: 47ファイル 4.2時間）。

</div>

<div class="box green">

**Q4: すべてのAPIにSWRフックを作る必要はありますか？**

A: いいえ、必要ありません。Read（GET）のみカスタムSWRフックを作成し、CUD（POST/PUT/DELETE）は直接Axios呼び出しで十分です。実績: 41個の自動生成フックを削除し、必要な9個のみ作成。

</div>

<div class="box yellow">

**Q6: OpenAPI Specの品質をどう保証しますか？**

A: Nest.jsのデコレーターで型安全に定義し、`@ApiProperty()` で詳細な情報を提供。Swagger UIでの目視確認（`/api/docs`）とCI/CDでのバリデーションを推奨。

</div>

</div>

---

# よくある質問（追加5問・続き）

<div style="font-size: 0.75em;">

<div class="box green">

**Q7: バックエンドがNest.js以外でも適用できますか？**

A: はい、OpenAPI Specを生成できれば適用可能です。Express、FastAPI、Spring Boot、Go（Gin/Echo）など、多くのフレームワークがサポートしています。手動でOpenAPI Specを書くことも可能。

</div>

<div class="box blue">

**Q8: SWRの代わりにReact Queryを使えますか？**

A: はい、同じ考え方が適用できます。Orvalは `client: "react-query"` もサポートしており、mutation用のカスタムフックも同様に作成可能。TanStack Query（旧React Query）でも同様の最適化が有効です。

</div>

</div>

---

# Orval設定の詳細例

<div style="font-size: 0.7em;">

```typescript
// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: '../../../docs/api/openapi.yaml',
      validation: false,  // スキーマ検証を無効化（開発効率優先）
    },
    output: {
      mode: 'single',             // [OK] 直接エクスポート
      client: 'axios-functions',  // [OK] Axios関数のみ生成
      target: 'lib/api/generated.ts',
      schemas: 'types/generated',
      baseUrl: '',  // 相対URL（Azure SWA対応）
      override: {
        mutator: {
          path: './lib/axiosClient.ts',
          name: 'axiosClient'
        },
        header: `// DO NOT EDIT - Auto Generated by Orval
// Source: backend/swagger.json
// Generated: ${new Date().toISOString()}`
      }
    }
  }
});
```

</div>

---

# CLAUDE.md設定例

<div style="font-size: 0.7em;">

```markdown
# フロントエンド実装ルール

## 自動生成ファイル（絶対に変更禁止）
- `lib/api/generated.ts`
  - Orvalで自動生成
  - バックエンドのOpenAPI Specから生成
  - 変更が必要な場合はバックエンド側を修正
- `types/generated/`
  - 型定義ファイル群
  - DTOと1対1対応

## 再生成コマンド
```bash
npm run generate:api
```

## API呼び出しパターン
### データ取得（Read）
- カスタムSWRフックを作成
- `hooks/use[EntityName].ts` に配置
- キャッシュキーは `/api/[resource]` 形式

### データ変更（CUD）
- 生成されたAxios関数を直接使用
- フォーム状態と統合
- 成功後に `mutate()` でキャッシュ更新
```

</div>

---

# ありがとうございました

<div class="highlight">
皆さんのAI協働開発プロジェクトの成功を応援しています！
</div>

## 本日のポイント

1. **Single Source of Truth** - DTOを唯一の型定義源とする
2. **エラー型設計** - RFC 7807準拠の統一エラー型
3. **Orval最適化** - バンドルサイズ20-30%削減、70-79%効率化
4. **パーツ提供の思想** - AI開発の効率化と柔軟性の両立

## 参考記事
- [AIと爆速開発！Next.js×Nest.js型定義同期](https://tech-lab.sios.jp/archives/49157)
- [Orval SWRの自動生成をやめた理由](https://tech-lab.sios.jp/archives/49591)

**質問があればお気軽にどうぞ！**
