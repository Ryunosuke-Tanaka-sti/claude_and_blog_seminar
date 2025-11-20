---
title: "HTMLでブログ記事を保存してる奴、全員Markdownにしろ。AIが読みにくいでしょうが！"
url: https://tech-lab.sios.jp/archives/50175
image: https://tech-lab.sios.jp/wp-content/uploads/2025/11/3a67c18fbad477f0337789857ea1391e.png
extracted_at: 2025-11-19T12:47:05.756Z
---

# HTMLでブログ記事を保存してる奴、全員Markdownにしろ。AIが読みにくいでしょうが！

**目次**

-   [1📌 5秒でわかる：この記事の内容](#5miaodewakarukono_ji_shino_nei_rong)
    -   [1.1📚 関連記事：より深く理解するために](#guan_lian_ji_shiyori_shenku_li_jiesurutameni)
    -   [1.2⚠️ 法的注意：必ずお読みください](#fa_de_zhu_yi_bizuo_dumikudasai)
-   [2はじめに](#hajimeni)
-   [3⚠️ 重要：本記事の対象範囲と法的注意事項](#zhong_yao_ben_ji_shino_dui_xiang_fan_tongto_fa_de_zhu_yi_shi_xiang)
    -   [3.1本記事の実装について](#ben_ji_shino_shi_zhuangnitsuite)
    -   [3.2他サイトへの適用時の法的注意](#tasaitoheno_shi_yong_shino_fa_de_zhu_yi)
-   [4概要](#gai_yao)
    -   [4.1新たな課題](#xintana_ke_ti)
    -   [4.2解決策：Markdown変換](#jie_jue_ceMarkdown_bian_huan)
    -   [4.3この記事で学べること](#kono_ji_shide_xueberukoto)
    -   [4.4リポジトリ](#ripojitori)
-   [5HTMLの限界：なぜMarkdownが必要だったのか](#HTMLno_xian_jienazeMarkdownga_bi_yaodattanoka)
    -   [5.1既存実装の振り返り](#ji_cun_shi_zhuangno_zhenri_fanri)
    -   [5.2新たに発見した課題](#xintani_fa_jianshita_ke_ti)
    -   [5.3具体例で見るHTMLの冗長性](#ju_ti_lide_jianruHTMLno_rong_zhang_xing)
-   [6解決策：Markdown変換への移行](#jie_jue_ceMarkdown_bian_huanheno_yi_xing)
    -   [6.1なぜ最初はHTMLタグを残していたのか？](#naze_zui_chuhaHTMLtaguwo_canshiteitanoka)
    -   [6.2なぜMarkdownなのか？](#nazeMarkdownnanoka)
    -   [6.3Markdownの実例](#Markdownno_shi_li)
-   [7実装の詳細](#shi_zhuangno_xiang_xi)
    -   [7.1処理フロー全体像](#chu_lifuro_quan_ti_xiang)
    -   [7.2ContentCompressor（既存実装）](#ContentCompressor_ji_cun_shi_zhuang)
    -   [7.3ライブラリ選定：6つの候補から選んだ理由](#raiburari_xuan_ding6tsuno_hou_bukara_xuannda_li_you)
    -   [7.4BlogMarkdownConverterのカスタマイズ](#BlogMarkdownConverternokasutamaizu)
    -   [7.5完全な処理フロー](#wan_quanna_chu_lifuro)
-   [8実測データで見る効果](#shi_cedetade_jianru_xiao_guo)
    -   [8.1測定方法](#ce_ding_fang_fa)
    -   [8.23記事の詳細データ](#3ji_shino_xiang_xideta)
        -   [8.2.1記事1: tech-lab-sios-jp-archives-50103（完全な削減データ）](#ji_shi1_tech-lab-sios-jp-archives-50103wan_quanna_xue_jiandeta)
        -   [8.2.2記事2: tech-lab-sios-jp-archives-50109](#ji_shi2_tech-lab-sios-jp-archives-50109)
        -   [8.2.3記事3: tech-lab-sios-jp-archives-50142](#ji_shi3_tech-lab-sios-jp-archives-50142)
    -   [8.3平均削減率](#ping_jun_xue_jian_lu)
    -   [8.4トークン削減の要因分析](#tokun_xue_jianno_yao_yin_fen_xi)
-   [9累積効果：生HTMLからの完全な削減](#lei_ji_xiao_guo_shengHTMLkarano_wan_quanna_xue_jian)
    -   [9.1トークン削減の全体像](#tokun_xue_jianno_quan_ti_xiang)
    -   [9.2各フェーズの詳細](#gefezuno_xiang_xi)
    -   [9.3可読性の向上](#ke_du_xingno_xiang_shang)
-   [10実践：今すぐ試せる](#shi_jian_jinsugu_shiseru)
    -   [10.1⚠️ 実行前の確認事項](#shi_xing_qianno_que_ren_shi_xiang)
    -   [10.2サンプルコードの入手](#sanpurukodono_ru_shou)
    -   [10.3スクレイパーの実行](#sukureipano_shi_xing)
    -   [10.4カスタマイズ（他サイト適用時）](#kasutamaizu_tasaito_shi_yong_shi)
    -   [10.5実行オプション](#shi_xingopushon)
-   [11まとめ](#matome)
    -   [11.1本記事のポイント](#ben_ji_shinopointo)
    -   [11.2Before/After 比較](#BeforeAfter_bi_jiao)
    -   [11.3次のステップ](#cinosuteppu)
-   [12参考リンク](#can_kaorinku)
    -   [12.1学術論文](#xue_shu_lun_wen)
    -   [12.2公式ドキュメント](#gong_shidokyumento)
    -   [12.3リポジトリ](#ripojitori1)
-   [13おわりに](#owarini)
    -   [13.1最後に重要なお願い](#zui_houni_zhong_yaonao_yuani)

## 📌 5秒でわかる：この記事の内容

> **タイトルは挑発的ですが、真面目な技術記事です。**

**やったこと**：

-   ブログ記事のHTML→Markdown変換を実装
-   トークン削減率：平均**20.7%**（3記事で実測）
-   既存実装と組み合わせて累積**65%削減**を達成

**得られるもの**：

-   markdownifyライブラリを使った実装方法（コード付き）
-   段階的なトークン削減の実測データ
-   WordPressブログのスクレイピングからMarkdown化まで

**対象読者**：

-   AIを活用したブログ執筆をしている人
-   RAG（もどき）システムを構築したい人
-   トークン削減に興味がある技術者

### 📚 関連記事：より深く理解するために

この記事は「AI活用ブログ執筆ワークフロー」シリーズの一部です。以下の記事を読むと、さらに理解が深まります。

**必読**：

-   **[検証→記事化ワークフロー](https://tech-lab.sios.jp/archives/50103)**  
    → 「RAGもどき」のアイデアを初めて紹介した記事。本記事はこのアイデアの実装編です。

**あわせて読みたい**：

-   **[Claude Code Skills 実装ガイド](https://tech-lab.sios.jp/archives/50154)**  
    → 今回の実装をClaude Code Skillとして統合する方法を解説。
-   **[3フェーズ開発](https://tech-lab.sios.jp/archives/49140)**  
    → AI活用開発ワークフローの基礎。検証→実装→記事化の流れ。
-   **[仕様書アレルギー克服](https://tech-lab.sios.jp/archives/49148)**  
    → AI活用で仕様書作成を効率化する方法。ワークフローの土台。

### ⚠️ 法的注意：必ずお読みください

この記事の実装は**SIOS Tech Lab専用**です。他サイトへの適用には、必ず事前の許可取得が必要です。無断スクレイピングは法的リスクがあります。詳細は本文の「⚠️ 重要：本記事の対象範囲と法的注意事項」をご確認ください。

## はじめに

ども！記念すべき200本一本前のブログを執筆している龍ちゃんです。最近はブログの執筆が爆速になっているのですが、やはり検証リポジトリに執筆環境を統合したのが影響が大きかったと思います。執筆からレビューまで贅沢にClaude Codeを活用させてもらっています。

今回は、[執筆環境を作成する際に「RAGもどき」システム](https://tech-lab.sios.jp/archives/50103)を作っているのですが、そちらの実践編です。「RAGもどき」というのは、ベクトルストアなんて贅沢なものは人間の頭で代用して、ファイルベースでファイルをローカルに管理するという人力の仕組みですｗ。

**「RAGもどき」について**

ちなみに、この「RAGもどき」という表現ですが、実は**RAGの定義からすると「もどき」じゃない**んです。

**RAGの本質とは？**

**原典論文**：Lewis et al. (2020) “[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)” (NeurIPS 2020)

この論文では、RAGを「**パラメトリック（事前訓練済みseq2seqモデル）と非パラメトリック（検索可能な外部知識）メモリを組み合わせる**」汎用的なアプローチと定義しています。

**重要なポイント**：

-   ✅ ベクトルストアは**必須要件ではない**（知らなかった！）
-   ✅ 論文中ではWikipediaの密集ベクトルインデックスを使用していますが、これは一例
-   ✅ **検索可能な外部知識源であれば、どのような形式でも良い**

つまり、ファイルシステム上のMarkdownファイル群も、立派な「検索可能な外部知識源」なんです。

**本記事のアプローチ**：

-   📁 **ローカルファイルベース**: Claude Codeのコンテキストにブログ記事（.mdファイル）を含める
-   🧠 **人間が選択**: AIの自動検索ではなく、自分（執筆者）が関連記事を手動で選択
-   🎯 **小規模に最適**: 数十〜数百件のブログ記事セットに向いている
-   ✨ **高精度**: 自分が書いた記事は自分が一番の専門家！的確な選択が可能

**厳密に言えば**：

RAGシステムの「Retrieval（検索・取得）」部分を人間が担当している形です。医療や法律などの専門分野では、専門家が知識ベースを手動でキュレーション（厳選）してからRAGシステムに組み込むアプローチが取られており、本記事のアプローチはその簡易版と言えます。

**本記事での呼び方**：

親しみやすさを重視して「RAGもどき」という表現を使っていますが、技術的には立派なRAGアプローチです。でも「もどき」って書いていると、RAGに詳しい人が気になって読んでくれるかな…とか、親しみやすさが出るかな…と思って…..

ブログの取得に関してをスクリプト化して、Claude CodeのSkillとして登録することでURLを投げるだけでローカルに投稿済みのブログを取得する仕組みの実装についてトークン圧縮・可読性の観点から解説していきます。

## ⚠️ 重要：本記事の対象範囲と法的注意事項

### 本記事の実装について

この記事は**SIOS Tech Lab（https://tech-lab.sios.jp）のブログ記事**を対象としたHTML→Markdown変換の実装例です。

**対象読者**：

-   SIOS Tech Labの記事を扱う方（社内利用）
-   WordPressベースのブログをスクレイピングしたい方
-   同様のHTML構造を持つサイトを扱う方

**この実装の前提**：

-   WordPressベースのブログサイト
-   メインコンテンツが`section.entry-content`に格納されている
-   OGPメタタグが適切に設定されている

**注意**: CSSセレクタやHTML構造は他サイトでは異なる可能性があります。適宜カスタマイズが必要です。

### 他サイトへの適用時の法的注意

この記事の実装を**他サイト**に適用する際は、以下の点に十分注意してください。

**法的リスク**：

-   無断スクレイピングは**利用規約違反**や**不正アクセス禁止法違反**に該当する可能性があります
-   最悪の場合、**民事訴訟**や**刑事告訴**のリスクがあります
-   「技術的に可能」≠「法的に許可されている」

**必ず実施すべきこと**：

1.  **利用規約の確認**
    -   robots.txtの確認（スクレイピング禁止の記載がないか）
    -   サイトの利用規約を熟読
    -   自動アクセスが明示的に禁止されていないか確認
2.  **許可の取得**
    -   サイト運営者に事前に連絡
    -   スクレイピングの目的を説明
    -   書面またはメールでの許可を取得（証拠として保存）
3.  **負荷への配慮**
    -   アクセス頻度を制限（リクエスト間隔を設ける）
    -   サーバーに負荷をかけない
    -   深夜帯など、アクセスが少ない時間帯に実行

**安全なスクレイピング対象**：

-   ✅ 自社サイト（許可不要）
-   ✅ 明示的に許可されているサイト（API提供など）
-   ✅ パブリックドメインのデータ

**危険なスクレイピング対象**：

-   ❌ 利用規約で禁止されているサイト
-   ❌ robots.txtで禁止されているページ
-   ❌ 会員制サイト（ログインが必要な情報）
-   ❌ 営業秘密や個人情報を含むデータ

**免責事項**：  
本記事の実装を使用したことによる法的トラブルについて、著者およびSIOS Technologyは一切の責任を負いません。ご自身の責任において、適切な許可を得た上で使用してください。

## 概要

[以前の記事](https://tech-lab.sios.jp/archives/50103)でRAGもどきシステムのアイデアを紹介しました。既存のブログ記事をAIに読み込ませることで、記事の重複チェックや文体・構成の一貫性を保つという仕組みです。

実はその後、HTML形式でブログ記事を保存する実装は密かに動いていました。ヘッダーやフッター、サイドバーを除去して、メインコンテンツだけを抽出するシンプルな処理です。ページ全体から見ると50-60%のトークン削減を実現していて、それなりに機能していました。

しかし、使い続けるうちに新たな問題が見えてきました。

### 新たな課題

**HTMLで保存してもトークンがまだ多い**

特に長い記事（10,000トークン以上）では、HTMLタグ（`<div>`, `<p>`, `<section>`）がトークンを消費し続けていました。例えば9,470トークンの記事では、まだ削減の余地がありそうでした。

**可読性の問題**

HTMLタグが邪魔で、可読性が低い状態でした。人間が読むのが辛い状態です。

### 解決策：Markdown変換

そこで、**HTML → Markdown変換**を実装することにしました。

処理フローは以下の通りです：

```
生HTML（ページ全体）
    ↓ ContentCompressor（既存実装）
抽出HTML（記事本文のみ）
    ↓ HtmlToMarkdownConverter（今回実装）← NEW
Markdown（最終形態）
```

**削減効果**:

-   抽出HTML → Markdown: **20.7%削減**（今回実装）
-   生HTML → Markdown: **累積64.9%削減**（全体）
-   構造保持＋可読性向上

### この記事で学べること

1.  **処理フロー全体像**：生HTML → 抽出HTML → Markdown
2.  **実測データ**：3記事で見る削減効果（段階別）
3.  **実装方法**：markdownifyライブラリとカスタマイズ
4.  **累積効果**：既存実装との組み合わせで65%削減

### リポジトリ

-   **サンプルコード（公開リポジトリ）**: [uv-single-devcontainer/examples/blog-scraper](https://github.com/Ryunosuke-Tanaka-sti/uv-single-devcontianer/tree/main/examples/blog-scraper)
-   すぐに試せる完全なサンプルコード
-   uvを使った開発環境テンプレート
-   README付きで使い方も簡単

## HTMLの限界：なぜMarkdownが必要だったのか

### 既存実装の振り返り

まず、既存のHTML抽出処理について軽く説明します。

**RAGもどきのアイデア**として、既存ブログ記事をAIに読み込ませる仕組みを考えていました。記事の重複チェック、文体・構成の一貫性確保が目的です。記事50103では**アイデアのみ紹介**していましたが、実装詳細は未公開でした。

**実は既に実装していた**んです。HTML形式でブログ記事を保存するシステムです：

-   ヘッダー・フッター・サイドバーを除去
-   メインコンテンツ（`section.entry-content`）のみ抽出
-   CSS装飾や不要な属性を削除
-   **トークン削減率**: 50-60%（ページ全体から）

**シンプルな実装内容**:

```
# CSSセレクタでメインコンテンツを抽出
target = soup.select_one("section.entry-content")

# 不要なタグを削除
for tag_name in ["script", "style", "noscript"]:
    for tag in target.find_all(tag_name):
        tag.decompose()

# 属性を削除（href/alt/srcは保持）
self._remove_attributes(target)
```

これだけのシンプルな処理ですが、それなりに機能していました。

### 新たに発見した課題

しかし、長い記事での問題が見えてきました（10,000トークン以上）：

**1\. トークン数がまだ多い**

HTMLタグ（`<div>`, `<p>`, `<section>`）がトークンを消費していました。例えば9,470トークンの記事では、まだ削減の余地がありました。

**2\. 可読性の問題**

HTMLタグで可読性が下がっていました。AIが構造を理解しづらく、人間が読むのも辛い状態です。

### 具体例で見るHTMLの冗長性

同じ内容をHTMLとMarkdownで比較してみましょう。

**HTML（30トークン）**:

```
<section>
  <h2>見出し</h2>
  <p>これは段落です。</p>
  <ul>
    <li>項目1</li>
    <li>項目2</li>
  </ul>
</section>
```

**Markdown（20トークン）**:

```
## 見出し

これは段落です。

* 項目1
* 項目2
```

**削減率**: 33%

HTMLタグの除去だけで、これだけトークンを削減できます。

## 解決策：Markdown変換への移行

### なぜ最初はHTMLタグを残していたのか？

実は、HTMLタグを残していたのには理由がありました。

**構造情報の保持が目的**でした。`<h2>`, `<ul>`, `<section>` などのタグは、単なる装飾ではなく、文章の構造を表す重要な情報です。これを完全に削除してしまうと、AIが記事の階層構造を理解しづらくなる可能性がありました。

「見出しはどれか」「リストはどこか」「どの段落がどのセクションに属するか」といった情報は、AIが記事を理解する上で重要なんですよね。

でも、問題がありました：

-   ❌ HTMLタグがトークンを消費し続ける
-   ❌ 可読性が低い
-   ❌ 人間が読むには辛い

そこで考えたのが、**Markdownへの変換**です。

### なぜMarkdownなのか？

Markdownなら、当初の「構造を保持したい」という意図を守りつつ、トークン削減と可読性向上の両立ができます。

理由は4つあります：

1.  構造を保持  
    見出し（H1-H6）、リスト、テーブル、コードブロック、リンク、画像など、必要な構造要素をすべて保持できます。HTMLタグの構造情報をそのまま引き継げるんです。
2.  可読性が高い  
    プレーンテキストに近く、AIも人間も読みやすい形式です。GitHubでのレビューも容易です。
3.  トークン数が少ない  
    タグが不要で、`##`、`*`、`-`等の記号のみで表現できます。属性も不要です。
4.  YAML frontmatter対応  
    メタデータを構造化して保存できます（title, url, image）。`converted_at`でバージョン管理も可能です。

つまり、こういうことです：

✅ 構造情報は保持（`##`, `###`, `*`, `-`で表現）  
✅ トークン数は大幅削減（HTMLタグが不要）  
✅ 可読性も向上（プレーンテキストに近い）

**構造を残したい**という当初の意図を守りつつ、トークン削減と可読性向上の両立を実現できたわけです。

### Markdownの実例

実際の出力例を見てみましょう。

**YAML frontmatter**:

```
---
title: "記事タイトル"
url: https://tech-lab.sios.jp/archives/50103
image: https://...
converted_at: 2025-11-11T06:13:55
---

# 記事本文...
```

メタデータが構造化され、記事本文はMarkdown形式で保存されます。

## 実装の詳細

### 処理フロー全体像

まず、処理フロー全体を把握しましょう。

**3段階のトークン削減**:

```
📄 生HTML（ページ全体）
    ↓ ① ContentCompressor（メインコンテンツ抽出）
📄 抽出HTML（記事本文のみ）
    ↓ ② HtmlToMarkdownConverter（Markdown変換）
📝 Markdown（最終形態）
```

**各段階の役割**:

1.  **ContentCompressor**: 不要な要素を削除
    -   ヘッダー、フッター、サイドバー除去
    -   script/style/noscript削除
    -   不要な属性削除（href/alt/srcは保持）
    -   セレクタ: `section.entry-content`
2.  **HtmlToMarkdownConverter**: Markdown変換
    -   HTMLタグ → Markdown記法
    -   長いalt属性の簡略化
    -   YAML frontmatter追加

**トークン削減効果**:

-   生HTML → 抽出HTML: **50-60%削減**（既存実装）
-   抽出HTML → Markdown: **20.7%削減**（今回実装）
-   **累積削減率**: 約**65%**（生HTML → Markdown）

### ContentCompressor（既存実装）

**SIOS Tech Lab特有の実装**です。以下のHTML構造に依存しています：

```
# SIOS Tech LabのHTML構造に特化したセレクタ
target = soup.select_one("section.entry-content")  # ← Tech Lab固有

# script/style/noscript削除
for tag_name in ["script", "style", "noscript"]:
    for tag in target.find_all(tag_name):
        tag.decompose()

# 不要な属性削除（href, alt, srcは保持）
self._remove_attributes(target)
```

**これだけのシンプルな処理**:

-   ヘッダー・フッター・サイドバー除去
-   CSS装飾の削除
-   55.7%のトークン削減（35,420 → 15,680トークン）

**他サイトへの適用時の注意**：

-   `section.entry-content`は**SIOS Tech Lab特有**のセレクタです
-   あなたのサイトに合わせて変更してください：

```
  # 例: 別のWordPressテーマの場合
  target = soup.select_one("article .post-content")
  target = soup.select_one("div.entry-body")
```

**問題点**:

-   HTMLタグが残っている（`<div>`, `<p>`, `<section>`）
-   可読性が低い
-   さらなる削減の余地あり

→ ここで**Markdown変換**の出番です。

### ライブラリ選定：6つの候補から選んだ理由

HTML→Markdown変換のために、6つのライブラリを比較しました。

**比較したライブラリ**:

-   html2text
-   **markdownify** ⭐（採用）
-   html-to-markdown
-   trafilatura
-   html2md
-   Pandoc

**markdownify採用理由**:

1.  **BeautifulSoup統合**: 既存のHTMLパース処理を活用できる
2.  **カスタマイズ可能**: MarkdownConverterクラスを継承して独自の変換ロジックを実装できる
3.  **高品質な変換**: テーブル、リスト、見出しを適切に処理
4.  **アクティブなメンテナンス**: 継続的に更新されている

### BlogMarkdownConverterのカスタマイズ

markdownifyの`MarkdownConverter`を継承して、**SIOS Tech Labのブログ記事用**にカスタマイズしました。

**実装のポイント**:

```
class BlogMarkdownConverter(MarkdownConverter):
    def convert_div(self, el, text, *args, **kwargs):
        """div タグはテキストのみ抽出"""
        return text

    def convert_img(self, el, text, *args, **kwargs):
        """長いalt属性（100文字以上）は簡略化

        SIOS Tech Lab特有の問題：
        - WordPressのMermaidプラグインがalt属性に図のコード全体を格納
        - 例: alt="graph TD; A-->B; C-->D; ..."（数百〜数千文字）
        - これをそのままMarkdownに変換するとトークンを大量消費
        """
        alt = el.get("alt", "")
        src = el.get("src", "")

        if len(alt) > 100:
            return f"![image]({src})"  # 簡略化

        return super().convert_img(el, text, *args, **kwargs)
```

**カスタマイズ内容**:

-   `div`/`span`: テキストのみ抽出（タグを除去）
-   `img`: 長いalt属性を`![image]`に簡略化（**Mermaid図対応** ← Tech Lab固有）

長いalt属性の簡略化は、WordPressのMermaidプラグインがalt属性に図のコード全体を格納する問題に対応したものです。100文字以上のalt属性は`![image]`として簡略化することで、可読性を保っています。

**他サイトへの適用**：  
あなたのサイトでMermaid図を使っていない場合、この処理は不要かもしれません。サイトの特性に合わせてカスタマイズしてください。

### 完全な処理フロー

実装の詳細ステップを見ていきましょう。

**1\. HTML取得**（BlogScraper）

```
soup = scraper.fetch_html(url)
original_html = str(soup)  # 生HTML（ページ全体）
```

**2\. メタデータ抽出**（OGPタグから）

```
metadata = extract_metadata_from_html(original_html)
# title, url, image を抽出
```

**3\. コンテンツ抽出**（ContentCompressor）

```
extracted_element = compressor.extract_content(soup)
extracted_html = str(extracted_element)  # 記事本文のみ
```

**4\. 空白圧縮**

```
compressed_html = compressor.compress_whitespace(extracted_html)
```

**5\. Markdown変換**（HtmlToMarkdownConverter）← NEW

```
markdown_content = converter.convert(compressed_html, metadata)
# YAML frontmatter + Markdown本文
```

**6\. トークン数計算**

```
markdown_tokens = estimator.estimate_tokens(markdown_content)
# 削減率を計算
```

**7\. Markdown保存**（.mdファイル）

```
markdown_path.write_text(markdown_content, encoding="utf-8")
```

**トークン削減の流れ**:

```
35,420トークン（生HTML）
    ↓ ContentCompressor（-55.7%）
15,680トークン（抽出HTML）
    ↓ HtmlToMarkdownConverter（-20.7%）
12,440トークン（Markdown）
    ↓ 累積削減率: 64.9%
```

## 実測データで見る効果

### 測定方法

実際の効果を測定するため、3件のSIOS Tech Labブログ記事で検証しました。

**対象記事**:

-   tech-lab-sios-jp-archives-50103
-   tech-lab-sios-jp-archives-50109
-   tech-lab-sios-jp-archives-50142

**測定対象**:

-   **生HTML**: ページ全体（ヘッダー、フッター、サイドバー含む）
-   **抽出HTML**: ContentCompressorで抽出した記事本文のみ
-   **Markdown**: HtmlToMarkdownConverterで変換後

**測定指標**:

-   トークン数（tiktoken相当のTokenEstimator）
-   ファイルサイズ（UTF-8バイト数）
-   削減率（各段階での削減効果）

### 3記事の詳細データ

#### 記事1: tech-lab-sios-jp-archives-50103（完全な削減データ）

この記事では、生HTMLからの完全な削減プロセスを測定しました。

**段階的な削減**:

段階

トークン数

削減量

削減率

生HTML（ページ全体）

35,420

–

–

↓ ContentCompressor

15,680

19,740

**55.7%**

↓ HtmlToMarkdownConverter

12,440

3,240

**20.7%**

**累積削減**

–

**22,980**

**64.9%**

**HTML → Markdown のみの比較**:

指標

抽出HTML

Markdown

削減量

削減率

トークン数

9,470

7,529

1,941

**20.5%**

ファイルサイズ

36,690 bytes

28,934 bytes

7,756 bytes

21.1%

**Note**: 抽出HTMLトークン数は、記事本文のHTMLファイルとして保存したもの（メタデータコメント含む）

#### 記事2: tech-lab-sios-jp-archives-50109

指標

抽出HTML

Markdown

削減量

削減率

トークン数

13,730

11,171

2,559

**18.6%**

ファイルサイズ

54,152 bytes

43,938 bytes

10,214 bytes

18.9%

#### 記事3: tech-lab-sios-jp-archives-50142

指標

抽出HTML

Markdown

削減量

削減率

トークン数

6,850

5,268

1,582

**23.1%**

ファイルサイズ

27,252 bytes

20,942 bytes

6,310 bytes

23.2%

### 平均削減率

3記事の集計結果です。

指標

平均値

測定ファイル数

3

平均 抽出HTML トークン数

10,017

平均 Markdown トークン数

7,989

**平均トークン削減率**

**20.7%**

**平均ファイルサイズ削減率**

**21.1%**

### トークン削減の要因分析

なぜこれだけのトークン削減が実現できたのか、要因を分析します。

**主な要因**:

**1\. HTML構造タグの除去**（最大の要因）

`<div>`, `<span>`, `<section>` → テキストのみ抽出します。CSSクラス、ID、その他の属性が完全に除去されます。

**2\. Markdownの簡潔な記法**

-   `<strong>` → `**`
-   `<em>` → `*`
-   `<a href="...">` → `(url)`

**3\. 空白・改行の最適化**

複数の連続する空白が単一のスペースに圧縮されます。

**4\. スクリプト・スタイルタグの除去**

`<script>`, `<style>`, `<noscript>` が削除されます。

## 累積効果：生HTMLからの完全な削減

### トークン削減の全体像

既存実装と今回の実装を組み合わせることで、生HTMLから約65%のトークン削減を実現しました。

**3段階の削減プロセス**:

```
📄 生HTML（ページ全体）: 35,420トークン
    ↓
    ContentCompressor
    ↓
📄 抽出HTML（記事本文）: 15,680トークン  ← 55.7%削減
    ↓
    HtmlToMarkdownConverter
    ↓
📝 Markdown（最終形態）: 12,440トークン  ← さらに20.7%削減
```

**累積削減効果**:

-   削減量: 22,980トークン
-   **累積削減率: 64.9%**

### 各フェーズの詳細

**フェーズ1: ContentCompressor（既存実装）**

-   **処理内容**:
    -   CSSセレクタでメインコンテンツ抽出
    -   ヘッダー、フッター、サイドバー除去
    -   script/style/noscript削除
    -   不要な属性削除
-   **実装**: シンプルな抽出処理（数行のコード）
-   **削減率**: 55.7%
-   **削減量**: 19,740トークン
-   **例**: 35,420 → 15,680トークン
-   **課題**: HTMLタグが残り、可読性が低い

**フェーズ2: HtmlToMarkdownConverter（今回実装）← 本題**

-   **処理内容**:
    -   HTMLタグ → Markdown記法
    -   構造タグ（div/span）除去
    -   属性削除
    -   長いalt属性簡略化（Mermaid図対応）
    -   YAML frontmatter追加
-   **実装**: markdownifyライブラリ＋カスタマイズ
-   **削減率**: 20.7%
-   **削減量**: 3,240トークン
-   **例**: 15,680 → 12,440トークン
-   **メリット**: トークン削減＋可読性向上

**相乗効果**:

-   シンプルな既存実装（フェーズ1）
-   高度なMarkdown変換（フェーズ2）← 今回の焦点
-   **組み合わせで65%削減を実現**

### 可読性の向上

トークン削減だけでなく、可読性も大幅に向上しました。

**HTML形式**（可読性：60点）:

```
<section>
  <h2>見出し</h2>
  <p>これは段落です。<strong>強調テキスト</strong>があります。</p>
  <ul>
    <li>項目1</li>
    <li>項目2</li>
  </ul>
</section>
```

**Markdown形式**（可読性：90点）:

```
## 見出し

これは段落です。**強調テキスト**があります。

* 項目1
* 項目2
```

**評価ポイント**:

-   **AIにとって**: 構造が明確で理解しやすい
-   **人間にとって**: プレーンテキストに近く読みやすい
-   **GitHubレビュー**: diffが見やすい

## 実践：今すぐ試せる

### ⚠️ 実行前の確認事項

**この実装を実行する前に**：

1.  **SIOS Tech Labの記事をスクレイピングする場合**：
    -   外部の方は事前に許可を取得してください
    -   社内利用の場合も、用途を明確にしてください
2.  **他サイトをスクレイピングする場合**：
    -   必ず利用規約とrobots.txtを確認
    -   サイト運営者の許可を取得
    -   無断実行は絶対にしないでください
3.  **負荷への配慮**：
    -   大量の記事を一度に取得しない
    -   リクエスト間隔を設ける（例: 1秒以上）
    -   サーバーに負荷をかけないよう注意

**重要**: スクレイピングは「できる」ことと「やって良い」ことは別です。必ず法的・倫理的な確認を行ってください。

---

実際にブログスクレイパーを試してみましょう。

### サンプルコードの入手

**重要**: このサンプルコードは**SIOS Tech Lab専用**です。他サイトへの適用には、必ず事前の許可取得とカスタマイズが必要です。

完全なサンプルコードをGitHubで公開しています。

**GitHubリポジトリ**:[https://github.com/Ryunosuke-Tanaka-sti/uv-single-devcontianer](https://github.com/Ryunosuke-Tanaka-sti/uv-single-devcontianer)

**クローン方法**:

```
git clone https://github.com/Ryunosuke-Tanaka-sti/uv-single-devcontianer.git
cd uv-single-devcontianer/examples/blog-scraper
```

### スクレイパーの実行

**セットアップ**:

```
# 依存関係をインストール
uv sync
```

**実行例**:

```
# 単一URLをスクレイプ
uv run blog-scraper https://tech-lab.sios.jp/archives/48173

# 複数URLを一度にスクレイプ
uv run blog-scraper \
  https://tech-lab.sios.jp/archives/48173 \
  https://tech-lab.sios.jp/archives/50103
```

**出力ファイル**:

```
output/tech-lab-sios-jp-archives-48173.md
output/tech-lab-sios-jp-archives-50103.md
```

**確認方法**:

```
cat output/tech-lab-sios-jp-archives-48173.md | head -20
```

### カスタマイズ（他サイト適用時）

**他サイトに適用する場合のカスタマイズ方法**：

**1\. CSSセレクタの変更**：

`src/blog_scraper/content_compressor.py`を開き、以下を変更：

```
# SIOS Tech Lab用（デフォルト）
target = soup.select_one("section.entry-content")

# あなたのサイト用に変更
target = soup.select_one("あなたのサイトのセレクタ")
```

**セレクタの見つけ方**：

1.  ブログ記事ページをブラウザで開く
2.  開発者ツール（F12）を開く
3.  記事本文をインスペクト
4.  メインコンテンツを囲む要素のセレクタをコピー

**2\. robots.txtの確認**：

```
# 対象サイトのrobots.txtを確認
curl https://example.com/robots.txt
```

**3\. メタデータ抽出の調整**（必要に応じて）：

`src/blog_scraper/metadata_extractor.py`でOGPタグ以外のメタデータソースを追加可能。

---

### 実行オプション

さまざまなオプションが利用可能です。

**出力先を変更**:

```
uv run blog-scraper --output ./my-articles https://tech-lab.sios.jp/archives/48173
```

**既存ファイルを上書き**:

```
uv run blog-scraper --force https://tech-lab.sios.jp/archives/48173
```

**URLリストファイルから一括取得**:

```
# urls.txt に1行ずつURLを記載
uv run blog-scraper --url-file urls.txt
```

## まとめ

### 本記事のポイント

✅ **HTML→Markdown変換で実現したこと**:

-   トークン削減率：平均20.7%
-   ファイルサイズ削減率：平均21.1%
-   可読性：60点 → 90点（主観）

✅ **既存実装との累積効果**:

-   フェーズ1（コンテンツ抽出）: 55.7%削減
-   フェーズ2（Markdown変換）: 20.7%削減
-   **累積削減率**: 約65%

✅ **実装のポイント**:

-   markdownifyライブラリ採用
-   BlogMarkdownConverterカスタマイズ
-   YAML frontmatter対応

⚠️ **重要な注意事項**:

-   **この実装はSIOS Tech Lab特化です**
-   他サイトへの適用には**必ず許可が必要**です
-   無断スクレイピングは法的リスクがあります
-   技術的に可能でも、倫理的・法的に問題がないか必ず確認してください

### Before/After 比較

指標

Before（抽出HTML）

After（Markdown）

改善

トークン数

10,017

7,989

20.7%削減

可読性

60点

90点

50%向上

ファイル形式

.html

.md

構造化

メタデータ

コメント

YAML frontmatter

明確化

### 次のステップ

今回の実装で、ブログ記事のトークン数を大幅に削減し、可読性も向上させることができました。

**SIOS Tech Lab以外のサイトへの適用**：

1.  CSSセレクタの特定（開発者ツールで確認）
2.  利用規約とrobots.txtの確認
3.  サイト運営者への許可申請
4.  `content_compressor.py`のカスタマイズ
5.  テスト実行とトークン削減率の測定

**さらなる改善の可能性**:

-   ベクトル検索の統合（真のRAG化）
-   セマンティック検索（類似記事の自動検出）
-   記事化の完全自動化（検証 → research-doc.md → article.md）

**関連記事**:

1.  [3フェーズ開発](https://tech-lab.sios.jp/archives/49140)
2.  [仕様書アレルギー克服](https://tech-lab.sios.jp/archives/49148)
3.  [検証→記事化ワークフロー](https://tech-lab.sios.jp/archives/50103) ← RAGもどきのアイデア
4.  [Claude Code Skills 実装ガイド](https://tech-lab.sios.jp/archives/50154) ← Skillとしての統合方法
5.  **本記事**: RAGもどき進化編（実装詳細）

## 参考リンク

### 学術論文

-   Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., … & Kiela, D. (2020). “[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)“. In *Advances in Neural Information Processing Systems* (NeurIPS 2020).
-   RAGの原典論文
-   ベクトルストアが必須でないことを示唆

### 公式ドキュメント

-   [Claude Code 公式ドキュメント](https://docs.claude.com/en/docs/claude-code/overview)
-   [markdownify GitHub](https://github.com/matthewwithanm/python-markdownify)
-   [BeautifulSoup4 ドキュメント](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
-   [Markdown 記法](https://www.markdownguide.org/)

### リポジトリ

-   **サンプルコード（公開リポジトリ）**: [uv-single-devcontainer/examples/blog-scraper](https://github.com/Ryunosuke-Tanaka-sti/uv-single-devcontianer/tree/main/examples/blog-scraper)
-   すぐに試せる完全なサンプルコード
-   uvを使った開発環境テンプレート
-   README付きで使い方も簡単

## おわりに

ここまで読んでいただき、ありがとうございました！

HTML→Markdown変換により、RAGもどきシステムがさらに進化しました。トークン20%削減＋可読性向上により、既存記事をAIに読み込ませる際の効率が大幅に改善されました。

既存のシンプルなHTML抽出処理と組み合わせることで、累積65%のトークン削減を実現しています。これにより、より多くの記事をコンテキストに含められるようになりました。

### 最後に重要なお願い

この記事の実装を試す際は、以下を必ず守ってください：

1.  **自社サイトまたは許可を得たサイトのみに適用**
2.  **無断スクレイピングは絶対にしない**
3.  **サーバーに負荷をかけない配慮**
4.  **法的・倫理的な問題がないか常に確認**

技術は便利ですが、使い方を誤ると大きなトラブルになります。責任を持って使用してください。

---

ぜひ、あなたのプロジェクト（**適切な許可を得た上で**）でも試してみてください。

質問や感想は、コメント欄でお待ちしております。また、Twitterのほうもよろしくお願いします！

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-50175)[役に立たなかった](#afb-post-50175)  
  
0人がこの投稿は役に立ったと言っています。