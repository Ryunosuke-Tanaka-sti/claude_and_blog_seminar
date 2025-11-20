---
title: "Orval SWRの自動生成をやめた理由 – SWRの本質を見失っていた話 | SIOS Tech. Lab"
url: https://tech-lab.sios.jp/archives/49591
image: https://tech-lab.sios.jp/wp-content/uploads/2025/10/0eb63956b89e0ba8a7cc157b84089e72.png
extracted_at: 2025-11-19T12:51:34.705Z
---

# Orval SWRの自動生成をやめた理由 – SWRの本質を見失っていた話 | SIOS Tech. Lab

**目次**

-   [1初めに](#chumeni)
-   [2TL;DR](#TLDR)
-   [3問題の発見：便利すぎる自動生成の罠](#wen_tino_fa_jian_bian_lisugiru_zi_dong_sheng_chengno_min)
-   [4SWRの本質を見つめ直す](#SWRno_ben_zhiwo_jiantsume_zhisu)
-   [5Before/After: Orval設定の変更](#BeforeAfter_Orval_she_dingno_bian_geng)
    -   [5.1Before（旧設定）](#Before_jiu_she_ding)
    -   [5.2After（新設定）](#After_xin_she_ding)
-   [6自動生成の3つの問題](#zi_dong_sheng_chengno3tsuno_wen_ti)
    -   [6.11\. 不要なオーバーヘッド](#1_bu_yaonaobaheddo)
    -   [6.22\. バンドルサイズの肥大化](#2_bandorusaizuno_fei_da_hua)
    -   [6.33\. コンポーネント設計の硬直化](#3_konponento_she_jino_ying_zhi_hua)
-   [7解決策：適材適所のアプローチ](#jie_jue_ce_shi_cai_shi_suonoapurochi)
    -   [7.1パターン1: データ取得（カスタムSWRフック）](#patan1_deta_qu_de_kasutamuSWRfukku)
    -   [7.2パターン2: mutation（直接Axios呼び出し）](#patan2_mutation_zhi_jieAxios_hubi_chushi)
-   [8移行中に発見したバグ](#yi_xing_zhongni_fa_jianshitabagu)
-   [9移行結果：数字で見る効果](#yi_xing_jie_guo_shu_zide_jianru_xiao_guo)
    -   [9.1対象範囲と効果](#dui_xiang_fan_tongto_xiao_guo)
-   [10AI開発を効率化する「パーツ提供」の考え方](#AI_kai_fawo_xiao_lu_huasurupatsu_ti_gongno_kaoe_fang)
-   [11まとめ：適材適所が長期的な保守性を生む](#matome_shi_cai_shi_suoga_zhang_qi_dena_bao_shou_xingwo_shengmu)
-   [12参考リソース](#can_kaorisosu)

## 初めに

ども！今月はAI開発にどっぷりな毎日な龍ちゃんです。今回は「[**AIと爆速開発！Next.js×Nest.js型定義同期の自動生成パイプライン構築術**](https://tech-lab.sios.jp/archives/49157)」で開発効率を上げたんですが、そこで起きた問題について原因究明と解決策を模索したので解説していこうと思います。

## TL;DR

Orvalで全APIエンドポイントにSWRフックを自動生成していたんですが、**バンドルサイズの肥大化**と**不要なオーバーヘッド**が問題になってしまいました。

**解決策**: `client: "axios-functions"` に変更して、Axios関数のみを自動生成。SWRは必要な箇所のみカスタムフック実装する方針に切り替えました。

**結果**: 47ファイルの移行（4.2時間）で、バンドルサイズを20-30%削減できました！

---

## 問題の発見：便利すぎる自動生成の罠

最初はOrvalで全APIエンドポイントにSWRフックを自動生成する設定にしていました。便利だと思っていたんですよね。型安全だし、統一感もあるし。

でも2ヶ月ほど経った頃、ふと気づいたんです。バンドルサイズはどんどん肥大化していくし、mutation処理は無駄にSWRを経由しているし、コードは複雑になっていく一方。**何かがおかしい。**

そこで改めて考え直してみました。SWRって、そもそも何のためのツールだったっけ？と。

---

## SWRの本質を見つめ直す

SWRは**データ取得（Read）のために設計**されたライブラリです。名前の由来である「stale-while-revalidate」という戦略が示す通り、以下のような特徴があります：

-   キャッシュ戦略による高速な表示
-   自動再検証（フォーカス時、再接続時など）
-   複数コンポーネント間でのデータ共有

これって、まさにCRUDのRead（データ取得）に最適化された設計なんですよね。

一方で、**CUD（Create/Update/Delete）はどうでしょうか？**`useSWRMutation` というフックも用意されていますが、よく考えてみると一回限りのmutationにキャッシュ戦略は不要です。フォーム状態との統合も煩雑になりがちでした。

それなのに、全エンドポイント分のSWRフックを自動生成していたら、本質的には不要なコードが大量に生まれてしまっていたんです。

---

## Before/After: Orval設定の変更

それでは、具体的にどう変更したのか見ていきましょう。

### Before（旧設定）

```
output:
  mode: "split"   # ❌ ラッパー関数が生成される
  client: "swr"   # ❌ SWRフック自動生成
  # ...
```

**問題点**: 全エンドポイント分のSWRフックが生成され、バンドル肥大化。mutationにも不要なSWRオーバーヘッドが発生していました。

### After（新設定）

```
output:
  mode: "single"             # ✅ 直接エクスポート
  client: "axios-functions"  # ✅ Axios関数のみ生成
  # ...
```

**改善点**: Axios関数のみを生成し、SWRは必要な箇所のみ手動で作成。バンドルサイズを20-30%削減できました。

シンプルですよね。でも、この変更が大きな効果を生んだんです。

---

## 自動生成の3つの問題

実際に移行作業を進めながら、自動生成のどこが問題だったのか明確になってきました。

### 1\. 不要なオーバーヘッド

例えば、投稿を作成する処理を考えてみてください。これって一回限りのアクションですよね。キャッシュも再検証も不要なのに、SWRの状態管理オーバーヘッドが動いている。これは明らかに無駄でした。

### 2\. バンドルサイズの肥大化

数字で見ると、問題の大きさがよくわかります：

項目

Before

After

改善

自動生成フック数

41個

0個

完全削除

バンドルサイズ

100%

70-80%

**20-30%削減**

コード行数

~2030行

~800行

**約60%削減**

全エンドポイント分のSWRフックが生成されて、使わないものも含めて全部バンドルに入ってしまっていたんですね。

### 3\. コンポーネント設計の硬直化

これが一番厄介でした。SWRの状態（`isMutating`, `error`）とフォームの状態（`isSubmitting`, `validationErrors`）が分裂してしまって、同期が複雑化していたんです。

実際にフォームを実装していると、「あれ、どっちのエラー状態を見ればいいんだっけ？」みたいなことが頻発していました。

---

## 解決策：適材適所のアプローチ

そこで、シンプルな方針に切り替えました：

```
✅ Read（GET） → カスタムSWRフック
✅ CUD（POST/PUT/DELETE） → 直接Axios呼び出し
```

それぞれ見ていきましょう。

### パターン1: データ取得（カスタムSWRフック）

データ取得には、SWRの恩恵を最大限活用します。

```
// hooks/useSeriesDrafts.ts
import useSWR from "swr";
import { seriesDraftsControllerFindAll } from "@/lib/api/generated";

/
  シリーズ下書き一覧を取得するカスタムフック
  SWRのキャッシュ・再検証・データ共有の恩恵を受けられる
 /
export const useSeriesDraftsControllerFindAll = () => {
  return useSWR("/api/series-drafts", () => seriesDraftsControllerFindAll());
};

// コンポーネントでの使用
const { data, error, isLoading } = useSeriesDraftsControllerFindAll();
```

SWRのキャッシュ戦略により、複数のコンポーネントで同じデータを効率的に共有できます。フォーカス時の自動再検証なども自動で行われるので、常に新鮮なデータを表示できるんですよね。

### パターン2: mutation（直接Axios呼び出し）

一方、データの作成・更新・削除は直接Axiosを呼び出します。

```
import { useState } from "react";
import { mutate } from "swr";
import { seriesDraftsControllerCreate } from "@/lib/api/generated";

const [isCreating, setIsCreating] = useState(false);

/
  シリーズ下書きを作成する処理
  SWRのオーバーヘッドなしで、シンプルに実装できる
 /
const handleCreate = async (data) => {
  setIsCreating(true);
  try {
    await seriesDraftsControllerCreate(data);
    // 作成後、SWRキャッシュを更新して一覧を再取得
    mutate("/api/series-drafts");
  } finally {
    setIsCreating(false);
  }
};
```

このアプローチなら、不要なオーバーヘッドを回避できて、フォーム状態との統合も容易になります。必要に応じて `mutate()` でSWRキャッシュを更新すれば、一覧表示も自動的に最新化されます。

シンプルでわかりやすいですよね。

---

## 移行中に発見したバグ

実は移行作業中に、思わぬバグも見つかりました。

**axiosInstance と axiosClient の混同**: 3つのファイルで `axiosClient` をAxiosインスタンスとして誤使用していたんです。

```
// ❌ Before（バグ）
import { axiosClient } from "@/lib/axiosClient";
await axiosClient.get("/.auth/me"); // TypeError!

// ✅ After（修正）
import { axiosInstance } from "@/lib/axiosClient";
await axiosInstance.get("/.auth/me");
```

**教訓**: `axiosClient` はOrval mutator関数として使うもので、直接HTTP呼び出しには `axiosInstance` を使用する必要があります。

命名が似ていると、こういう混同が起きやすいんですよね。移行作業のおかげで、潜在的なバグを早期発見できたのは副次的な効果でした。

---

## 移行結果：数字で見る効果

実際の移行結果をまとめてみます。

### 対象範囲と効果

-   **47ファイル移行完了**（実装時間: 4.2時間、推定14-20時間 → 21-30%効率化）
-   **バンドルサイズ20-30%削減**（自動生成フック: 41個 → 0個）
-   **カスタムフック**: 9個を必要箇所のみ作成
-   **コード行数**: ~2030行 → ~800行（約60%削減）

当初は14-20時間かかると見積もっていたんですが、4.2時間で完了できました。Axiosの関数がパーツとして提供されていたおかげで、AIに実装を任せる際もスムーズに進められたんです。

---

## AI開発を効率化する「パーツ提供」の考え方

今回の経験で実感したのが、**AI開発を効率化する鍵は「パーツを提供する」という考え方**だということです。

shadcn/uiが成功しているのも同じ理由ではないでしょうか。コンポーネントをコピペして、必要に応じてカスタマイズできる。全部を自動生成するのではなく、パーツを提供する。

Axiosのインターフェース部分をパーツとして切り出しておけば、そこに処理を書かせるだけでOK。このアプローチによって、開発効率が飛躍的に向上しました。

フロントエンドとバックエンドの型の齟齬もなくなりましたし、手が止まることも減りました。すっきりとしたコードで実装できるようになったんです。

---

## まとめ：適材適所が長期的な保守性を生む

SWRは素晴らしいツールです。でも、すべてのAPI呼び出しに必要なわけではありません。

**適材適所のアプローチ**:

-   **データ取得（Read）**: SWRの恩恵を最大限活用
-   **mutation（CUD）**: シンプルにAxiosで十分

「便利だから」という理由で全てを自動生成すると、不要な複雑さとバンドル肥大化を招いてしまいます。

Axiosでパーツのみを提供し、SWRは必要な箇所に手動で適用する。この「適材適所」のアプローチが、長期的な保守性と柔軟性を生むんですね。

皆さんも、もし自動生成で「何か複雑になってきたな」と感じたら、一度立ち止まって考えてみてください。本質的に必要なものは何か、ツールの設計思想に沿った使い方ができているか。そこを見直すことで、より良い設計にたどり着けるはずです。

今回の知識を活かして、ぜひ皆さんのプロジェクトでも最適なアプローチを見つけてみてください！

---

## 参考リソース

-   [Orval](https://orval.dev/) – OpenAPI to TypeScript
-   [SWR](https://swr.vercel.app/) – React Hooks for Data Fetching
-   [包括的な実装検証ドキュメント](https://www.notion.so/research/swr-custom-hooks-migration/README.md)

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-49591)[役に立たなかった](#afb-post-49591)  
  
0人がこの投稿は役に立ったと言っています。