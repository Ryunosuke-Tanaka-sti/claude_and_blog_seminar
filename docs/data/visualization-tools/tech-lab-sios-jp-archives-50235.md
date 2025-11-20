---
title: "図解作成が驚くほど楽に！Claude SkillでSVG自動生成 | SIOS Tech. Lab"
url: https://tech-lab.sios.jp/archives/50235
image: https://tech-lab.sios.jp/wp-content/uploads/2025/11/61a38a6871225b3aa66256ea8abd9d05.png
extracted_at: 2025-11-19T12:49:21.292Z
---

# 図解作成が驚くほど楽に！Claude SkillでSVG自動生成 | SIOS Tech. Lab

**目次**

-   [1はじめに](#hajimeni)
    -   [1.1作ってみて感じたこと](#zuottemite_ganjitakoto)
-   [2この記事で伝えたいこと](#kono_ji_shide_yunetaikoto)
-   [3🎯 Claude Code Skill とは？](#Claude_Code_Skill_toha)
-   [4SVG 図解自動生成 Skill の実装](#SVG_tu_jie_zi_dong_sheng_cheng_Skill_no_shi_zhuang)
    -   [4.1なぜ SVG を選んだのか？](#naze_SVG_wo_xuanndanoka)
    -   [4.2📊 図解デザインの基本原則](#tu_jiedezainno_ji_ben_yuan_ze)
    -   [4.3Skill ファイルの構成](#Skill_fairuno_gou_cheng)
    -   [4.4実装のポイント](#shi_zhuangnopointo)
-   [5実運用で遭遇する問題点](#shi_yun_yongde_zao_yusuru_wen_ti_dian)
    -   [5.1問題1: 文字列幅の不一致](#wen_ti1_wen_zi_lie_funo_bu_yi_zhi)
    -   [5.2問題2: 要素の重なり](#wen_ti2_yao_suno_zhongnari)
    -   [5.3問題3: カスタム矢印の生成](#wen_ti3_kasutamu_shi_yinno_sheng_cheng)
    -   [5.4問題4: 配置のバラつき](#wen_ti4_pei_zhinobaratsuki)
-   [6修正ワークフロー](#xiu_zhengwakufuro)
-   [7生成例：Before → After 比較](#sheng_cheng_liBefore_After_bi_jiao)
    -   [7.1例1: 3層アーキテクチャ図](#li1_3cengakitekucha_tu)
        -   [7.1.1ステップ1: 初回プロンプト](#suteppu1_chu_huipuronputo)
        -   [7.1.2ステップ2: オリジナル生成結果](#suteppu2_orijinaru_sheng_cheng_jie_guo)
        -   [7.1.3ステップ3: 修正プロンプト](#suteppu3_xiu_zhengpuronputo)
        -   [7.1.4ステップ4: 修正後の結果](#suteppu4_xiu_zheng_houno_jie_guo)
    -   [7.2例2: ユーザー認証フロー](#li2_yuza_ren_zhengfuro)
        -   [7.2.1ステップ1: 初回プロンプト](#suteppu1_chu_huipuronputo1)
        -   [7.2.2ステップ2: オリジナル生成結果](#suteppu2_orijinaru_sheng_cheng_jie_guo1)
        -   [7.2.3ステップ3: 修正プロンプト](#suteppu3_xiu_zhengpuronputo1)
        -   [7.2.4ステップ4: 修正後の結果](#suteppu4_xiu_zheng_houno_jie_guo1)
    -   [7.3例3: Before/After 比較図](#li3_BeforeAfter_bi_jiao_tu)
        -   [7.3.1ステップ1: 初回プロンプト](#suteppu1_chu_huipuronputo2)
        -   [7.3.2ステップ2: オリジナル生成結果](#suteppu2_orijinaru_sheng_cheng_jie_guo2)
        -   [7.3.3ステップ3: 修正プロンプト](#suteppu3_xiu_zhengpuronputo2)
        -   [7.3.4ステップ4: 修正後の結果](#suteppu4_xiu_zheng_houno_jie_guo2)
-   [8Mermaid.js との使い分け](#Mermaidjs_tono_shii_fenke)
    -   [8.1具体的な使い分け](#ju_ti_dena_shii_fenke)
    -   [8.2僕の実践的な使い分け基準](#puno_shi_jian_dena_shii_fenke_ji_zhun)
-   [9まとめ](#matome)
    -   [9.1よくある修正内容](#yokuaru_xiu_zheng_nei_rong)
    -   [9.2この記事で得られる3つのメリット](#kono_ji_shide_derareru3tsunomeritto)
    -   [9.3次回以降の技術解説シリーズ](#ci_hui_yi_jiangno_ji_shu_jie_shuoshirizu)
-   [10参考リンク](#can_kaorinku)
    -   [10.1Claude Code](#Claude_Code)
    -   [10.2Material Design & Icons](#Material_Design_Icons)
    -   [10.3アクセシビリティ](#akuseshibiriti)
    -   [10.4デザインパターン](#dezainpatan)

## はじめに

ども！Claude Code を執筆に贅沢活用している龍ちゃんです。気づいたら3年でブログを200本書いていて、そろそろブログの本数をカウントするのを取りやめですね（笑）。

最近は週に5本くらいブログを書くことが習慣づいているんですが、これだけブログを書いてると、だんだん図を作るのが億劫になってしまうんですよね。Claude Code のおかげで Mermaid での図解作成はすごく短縮できました（参考：[ClaudeでMermaid図作成を自動化！2時間→5分の劇的時短術【Live Editor活用】](https://tech-lab.sios.jp/archives/48411)）。

今月は社内でそういう環境を提供する活動を始めていまして、その過程で「今まで SVG で作ることを諦めていたけど、もうちょっと頑張ってみようかな」ってところでスキル化したりしてます。

**正直に言うと、完璧に動くものはまだできてないんですよね。** でも、比較的質の高い図を作れるようになったので、その方法を共有します。

### 作ってみて感じたこと

**完璧なものを一発で作ることは不可能**でした。ライトなブログなら そのまま使えますが、ちゃんとした図を作るなら Figma などの専用ツールが必要です。

それでも、**図解作成時間を67%削減**（45分 → 15分）できたので、方法と課題・解決策を共有します。

## この記事で伝えたいこと

**完璧なものは絶対一発で作れません。** でも、現状の Skill を共有するので、一緒にベストプラクティスを模索していきましょう！

**この記事で扱う内容**:

-   SVG 図解自動生成 Skill の実装
-   **実運用で遭遇した問題点と対処法**（重要！）
-   Mermaid.js との使い分け

## 🎯 Claude Code Skill とは？

`.claude/skills/` ディレクトリに **Markdown 形式のプロンプトファイル**を配置することで、Claude がタスクを自動実行できる機能です。

**Skill のメリット**:

-   一度作成すれば繰り返し使える
-   キーワードで自動トリガー
-   チーム全体で共有可能

> **📝 Note**:
> 
> -   SVG 図解生成 Skill の完全版は [Gist で公開中](https://gist.github.com/Ryunosuke-Tanaka-sti/721fc925eac69fa9f19f478e000454d2)
> -   Skill の作り方について詳しくは [Claude Code Skillの登録と実践！プロジェクト固有の処理を自動化する方法](https://tech-lab.sios.jp/archives/50154) を参照してください

## SVG 図解自動生成 Skill の実装

### なぜ SVG を選んだのか？

一番の理由はFigmaで後から人力編集できるって点ですね。

アプローチ

用途

**Mermaid.js**

システム図（クラス図、シーケンス図）→ 高精度で素早く生成

**SVG 直接生成**

**概念図、ビジュアル重視の図解** → デザインの完全制御が可能

**HTML + CSS**

インタラクティブな図解

**結論**: デザインの自由度とアクセシビリティを重視し、SVG 直接生成を選択しました。Mermaid だと無機質になるケースで SVG が活躍します。

### 📊 図解デザインの基本原則

**正直に言うと、僕はデザイナーではないのでデザインパターンやコントラストの知識はないんですよね。** そこで、いったん Claude に調査を依頼して、それを Skill に取り込むという手法を採用しています。

以下は Claude に調査させて得られたデザインパターンです：

-   **1\. C4 Model（階層化）**
    -   **Context**: システム全体の概念図
    -   **Container**: サービス間の相互作用
    -   **Component**: 個別コンポーネントの詳細
    -   **Code**: クラス図・シーケンス図（Mermaid が得意）
-   **2\. 60-30-10 ルール（色使い）**
    -   60%: 背景、30%: 矩形、10%: アクセント（矢印）
-   **3\. 視覚的ヒエラルキーの7原則**
    -   Size / Color / Contrast / Alignment / Repetition / Proximity / **Whitespace（padding 50px の根拠）**

**ポイント**: デザインの専門知識がなくても、Claude に「効果的な図解デザインのベストプラクティスを調査して」と依頼すれば、これらの原則を教えてくれます。それを Skill のプロンプトに組み込むことで、質の高い図解が生成できるようになるんですよね。

### Skill ファイルの構成

`.claude/skills/diagram-generator-svg.md` を作成し、以下の要素を含めます：

**主要な指示内容**:

1.  **Material Icons の統一使用**（desktop\_windows、settings、storage など）
2.  **WCAG Level AA 準拠**（コントラスト比 4.5:1）
3.  **レイアウトガイドライン**（padding 50px、font-size 16-32px）
4.  **アクセシビリティ対応**（`<title>` と `<desc>` 要素）

SVG 図解生成 Skill の完全版は [Gist で公開中](https://gist.github.com/Ryunosuke-Tanaka-sti/721fc925eac69fa9f19f478e000454d2)

### 実装のポイント

これだけ設定していてもがっつり無視してきたりするので、きれずに根気よく会話していきましょう。

**1\. Material Icons の統一使用**

Skill のプロンプトで「Material Icons を使用」と指示しても、Claude は時々カスタム矢印（`<path>` + `marker-end`）を生成してしまいます。これを防ぐため、以下を明記：

これを書いていても無視しますよｗｗ

3\. \*\*Layout Guidelines\*\*
   - Arrows should use Material Icons (arrow\_downward, arrow\_forward)
   - DO NOT use custom \`&lt;marker>\` or \`&lt;marker-end>\`

**2\. アクセシビリティ対応**

WCAG Level AA 準拠のため、コントラスト比を明示：

2\. \*\*Accessibility (WCAG Level AA)\*\*
   - Color contrast ratio ≥ 4.5:1
   - Text color on background must meet WCAG AA standards

**3\. 配置の明確化**

要素間の余白を明示的に指定：

   - Use consistent spacing (50px padding between elements)
   - Text should not overflow rectangles

## 実運用で遭遇する問題点

ここからが重要です。実際に Skill を使ってみると、**プロンプト通りに生成されないことが多々あります**。以下、僕が実際に遭遇した問題と対処法です。

### 問題1: 文字列幅の不一致

**症状**: 説明文（例: “UI・ユーザーインターフェース (React, Vue.js, Angular)”）が矩形からはみ出す

**原因**: Claude が文字列の実際の表示幅を正確に計算できない

**対処法**:

&lt;!-- Before: font-size="18" だと長い -->
&lt;text font-size="18">UI・ユーザーインターフェース (React, Vue.js, Angular)&lt;/text>

&lt;!-- After: font-size="16" に縮小 -->
&lt;text font-size="16">UI・ユーザーインターフェース (React, Vue.js, Angular)&lt;/text>

僕の場合、最初に生成されたSVGを見て「あ、これ文字はみ出てるな」って気づいたら、すぐにfont-sizeを調整するようにしています。

### 問題2: 要素の重なり

**症状**: 矢印と矩形が重なって見える

**原因**: padding が不十分（40px では足りない）

**対処法**:

&lt;!-- Before: padding 40px -->
&lt;rect y="80" height="140"/>
&lt;g transform="translate(620, 220)">  &lt;!-- 80 + 140 = 220 -->
  &lt;!-- Arrow -->
&lt;/g>
&lt;rect y="260" height="140"/>  &lt;!-- 220 + 40 = 260 -->

&lt;!-- After: padding 50px -->
&lt;rect y="80" height="140"/>
&lt;g transform="translate(620, 230)">  &lt;!-- 80 + 140 + 10 = 230 -->
  &lt;!-- Arrow -->
&lt;/g>
&lt;rect y="270" height="140"/>  &lt;!-- 230 + 40 = 270 -->

これは視認性の問題なんですが、40pxだと視覚的に「ちょっと詰まってるな」って感じがしたので、50pxにしたら見やすくなりました。

### 問題3: カスタム矢印の生成

**症状**: Material Icons を指示しても、`<path>` + `marker-end` のカスタム矢印を生成してしまう

**Claude が生成するコード（NG）**:

&lt;!-- NG: カスタム矢印 -->
&lt;path d="M 640 220 L 640 260"
      stroke="#424242" stroke-width="3"
      marker-end="url(#arrowhead)"/>

&lt;defs>
  &lt;marker id="arrowhead" markerWidth="10" markerHeight="10">
    &lt;polygon points="0 0, 10 5, 0 10" fill="#424242"/>
  &lt;/marker>
&lt;/defs>

**対処法**: Material Icons の `arrow_downward` を直接指定

&lt;!-- OK: Material Icons -->
&lt;g transform="translate(620, 230)">
  &lt;path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
        fill="#757575" transform="scale(1.5)"/>
&lt;/g>

これ、本当によくあるんですよね。プロンプトに明記してても無視されるので、生成後に手動で置き換えるのが確実です。

### 問題4: 配置のバラつき

**症状**: 矩形の高さや幅、要素間の距離が統一されていない

**対処法**: プロンプトで数値を明示

\## Layout Specifications

- Rectangle width: 900px
- Rectangle height: 140px
- Padding between elements: 50px
- Icon size: 48px (Material Icons scale(2))
- Arrow size: 36px (Material Icons scale(1.5))

数値を具体的に指定しておくと、生成される図の一貫性が上がります。ただし、それでもズレることはあるので、最終的には目視確認が必要ですね。

## 修正ワークフロー

実際の図解作成は以下のフローで進めます：

1.  **Skill で初回生成**（所要時間: 5分）
    -   プロンプトを渡して SVG を生成
    -   構造は正しいが、細かい問題がある状態
2.  **手動修正**（所要時間: 10分）
    -   文字列のはみ出しをチェック → font-size 調整
    -   要素の重なりをチェック → padding 調整
    -   カスタム矢印をチェック → Material Icons に置換
    -   配置のバラつきをチェック → 数値を統一
3.  **ブラウザで確認**
    -   SVG ファイルを VScode で開いて視覚確認
    -   問題があれば 2 に戻る

**合計所要時間: 15分**（従来の45分から67%削減！）

僕の場合、Figmaで一から作ると構造を考えるところから始まって45分くらいかかってたんですが、Skillで構造を生成してもらえるだけで圧倒的に楽になりましたね。

## 生成例：Before → After 比較

実際の図解生成プロセスを、**初回プロンプト → オリジナル画像 → 修正プロンプト → 修正後画像**の流れで紹介します。

### 例1: 3層アーキテクチャ図

#### ステップ1: 初回プロンプト

SVG図解を生成してください。

タイトル: 3層アーキテクチャ
内容: Presentation Layer、Business Logic Layer、Data Access Layerの3層構造を示す図

各層に以下の情報を含めてください:
- Presentation Layer: desktop\_windows アイコン、説明「UI・ユーザーインターフェース (React, Vue.js, Angular)」
- Business Logic Layer: settings アイコン、説明「ビジネスロジック (Services, Use Cases, Domain Logic)」
- Data Access Layer: storage アイコン、説明「データアクセス (Repository, ORM, Database Queries)」

各層を矢印で接続してください。

#### ステップ2: オリジナル生成結果

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/svg-generator-layered-architecture.svg)

**問題点**:

-   ❌ 説明文の font-size が大きすぎる（18px）
-   ❌ 矢印が `<path>` + `marker-end` のカスタム実装
-   ❌ padding が不十分（40px）で要素が詰まって見える

このとき僕は「あー、やっぱり文字はみ出てるし、矢印も微妙だな」って思いました。でも構造自体は正しいので、修正するだけで済むのが楽なんですよね。

#### ステップ3: 修正プロンプト

Claude に以下を指示：

以下の修正を適用してください：

1. 説明文の font-size を 18px → 16px に縮小
2. 矢印を Material Icons \`arrow\_downward\` に置換
3. padding を 40px → 50px に拡大して余白を確保

#### ステップ4: 修正後の結果

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/svg-generator-layered-architecture-1.svg)

**改善点**:

-   ✅ 説明文が矩形内に余裕を持って収まる
-   ✅ Material Icons で統一されたデザイン
-   ✅ 適切な余白で視認性が向上

これで見た目がかなりすっきりしました。僕的にはこのレベルなら公開用として十分使えると思います。

---

### 例2: ユーザー認証フロー

#### ステップ1: 初回プロンプト

SVG図解を生成してください。

タイトル: ユーザー認証フロー
内容: ログインから認証情報検証、セッション確立までのプロセスフロー

以下のステップを含めてください:
1. 開始（楕円形、緑色）
2. 認証情報入力（矩形、青色）
3. 認証情報検証（矩形、青色）
4. セッション確立（矩形、青色）
5. 完了（楕円形、赤色）

各ステップを矢印で接続してください。

#### ステップ2: オリジナル生成結果

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/svg-generator-user-auth-flow.svg)

**問題点**:

-   ❌ 全4箇所の矢印がカスタム実装（`marker-end` 使用）
-   ❌ 矢印とステップの重なりが見える
-   ❌ ステップ間の padding がバラバラ

フロー図って矢印が命なんですが、カスタム矢印だと統一感がなくなるんですよね。

#### ステップ3: 修正プロンプト

以下の修正を適用してください：

1. 全4箇所の矢印を Material Icons \`arrow\_downward\` に置換
2. ステップ間の padding を 50px に統一
3. 矢印とステップの位置を調整して重なりを解消

#### ステップ4: 修正後の結果

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/svg-generator-user-auth-flow-1.svg)

**改善点**:

-   ✅ Material Icons で統一された矢印
-   ✅ 各ステップ間の余白が均一
-   ✅ すっきりとした視覚的な流れ

これでフローが追いやすくなりました。技術ブログの図解としては十分なクオリティだと思います。

---

### 例3: Before/After 比較図

#### ステップ1: 初回プロンプト

SVG図解を生成してください。

タイトル: 図解作成の時短効果比較
内容: 手動作成とSkill生成の作業時間・効率を比較するBefore/After図

Before側（左側、赤色）:
- 作業時間: 45分
- ツール: Figma / PowerPoint
- 課題: 時間がかかる

After側（右側、緑色）:
- 作業時間: 15分
- ツール: Claude Code Skill
- 内訳: 生成5分 + 修正10分
- 効果バッジ: 67% 時短！

BeforeからAfterへ横向き矢印を配置してください。

#### ステップ2: オリジナル生成結果

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/svg-generator-before-after-comparison.svg)

**問題点**:

-   ❌ 横向き矢印がカスタム実装（`<path>` + `marker-end`）
-   ❌ Before/After の横にアイコン（警告・チェックマーク）があり、「作業時間」と重なる
-   ❌ 「作業時間」と数値（45分・15分）の間隔が狭い
-   ❌ 矢印の位置が中央からずれている

このときは「うーん、情報詰め込みすぎて見づらいな」って感じでした。

#### ステップ3: 修正プロンプト

Claude に以下を指示：

以下の修正を適用してください：

1. 横向き矢印を Material Icons \`arrow\_forward\` に置換
2. Before/After の横のアイコンを削除してテキストを中央配置
3. 「作業時間」と数値の間隔を 30px → 40px に拡大
4. 矢印を Before/After セクション全体の中央（y=368付近）に配置

#### ステップ4: 修正後の結果

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/svg-generator-before-after-comparison-1.svg)

**改善点**:

-   ✅ Material Icons で統一された横向き矢印
-   ✅ Before/After テキストがすっきりと中央配置
-   ✅ 「作業時間」と数値の間に適切な余白
-   ✅ 矢印が視覚的に中央に配置され、バランスが向上

これで見やすくなりました。Before/After図は情報量が多いので、余白をしっかり取るのが大事ですね。

## Mermaid.js との使い分け

僕が以前書いた記事「[ClaudeでMermaid図作成を自動化！2時間→5分の劇的時短術【Live Editor活用】](https://tech-lab.sios.jp/archives/48411)」で紹介している Mermaid.js は、**システムチックな内容**を表現する際に結構高い精度で図を作ってくれる最高なツールです。

一方で、**概念的な話**になると Mermaid だと無機質になってしまうケースがあるんですよね。そこで SVG 直接生成の出番です。

### 具体的な使い分け

用途

推奨アプローチ

理由

例

**システム図**

**Mermaid.js**

記法が簡単、高精度

クラス図、シーケンス図、ER図

**概念図**

**SVG 直接生成**

ビジュアルで魅せられる

アーキテクチャ概念図、比較図

**データフロー**

Mermaid.js

専用記法で効率的

パイプライン、処理フロー

**デザイン重視**

SVG 直接生成

色・レイアウトの完全制御

ブランディング重視の図解

**Material Icons**

SVG 直接生成

Mermaid は非対応

Google Cloud アイコン使用

### 僕の実践的な使い分け基準

**開発フェーズ別**:

-   📝 **記事の下書き段階**: Mermaid.js（速さ重視、素早くイメージ共有）
-   🎨 **公開用の図解**: SVG 直接生成（品質重視、ビジュアルで差別化）

**内容の性質別**:

-   🔧 **技術的な関係性**: Mermaid.js（クラス継承、API 呼び出し順序など）
-   💡 **コンセプト・アイデア**: SVG 直接生成（3層アーキテクチャの概念、Before/After など）

**結論**: Mermaid と SVG は競合ではなく**補完関係**。両方使いこなすことで、技術ブログの図解表現力が大幅に向上します。

僕の場合、システム図はMermaidでさくっと作って、ビジュアルで魅せたい図はSVGで作る、みたいな使い分けをしていますね。

## まとめ

Claude Code Skill を使った SVG 図解自動生成により、**図解作成時間を67%削減**できました！ただし、完璧な図解が一発で生成されるわけではなく、以下のような修正が必要になることが多いですね：

### よくある修正内容

1.  font-size の調整（18px → 16px）
2.  padding の拡大（40px → 50px）
3.  カスタム矢印を Material Icons に置換
4.  配置の微調整

それでも、Figma で一から作るより圧倒的に速いです。僕の場合、図解作成が億劫で記事執筆が進まない…ということがなくなりました。

### この記事で得られる3つのメリット

✅ **時短効果**: 45分 → 15分（67%削減）  
✅ **再現性**: Skill をコピーすればチーム全員が同じ品質で図解作成可能  
✅ **継続的改善**: 修正プロンプトを蓄積してベストプラクティスを共有できる

### 次回以降の技術解説シリーズ

今回は SVG 図解の自動生成に焦点を当てましたが、今後は以下の内容を解説していきます！

1.  **HTML 図解自動生成**（Tailwind CSS 使用）
2.  **SVG → PNG 変換自動化**（CairoSVG）
3.  **HTML → PNG 変換自動化**（Playwright）

ブログやコンテンツを定期的に発信している方は、ぜひ参考にしてみてください！質問や感想は、コメント欄でお待ちしております。

## 参考リンク

### Claude Code

-   [Claude Code 公式ドキュメント](https://code.claude.com/docs)
-   [ClaudeでMermaid図作成を自動化！2時間→5分の劇的時短術【Live Editor活用】](https://tech-lab.sios.jp/archives/48411)

### Material Design & Icons

-   [Material Icons](https://fonts.google.com/icons)
-   [Material Symbols（推奨）](https://developers.google.com/fonts/docs/material_icons)
-   [Google Cloud Icons](https://cloud.google.com/icons)

### アクセシビリティ

-   [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa)

### デザインパターン

-   [C4 Model – Software Architecture](https://www.educative.io/blog/software-architecture-diagramming-and-patterns)
-   [Visual Hierarchy Guide](https://www.interaction-design.org/literature/topics/visual-hierarchy)
-   [UI Color Palette Best Practices](https://www.interaction-design.org/literature/article/ui-color-palette)

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-50235)[役に立たなかった](#afb-post-50235)  
  
0人がこの投稿は役に立ったと言っています。