---
title: "Claude Code Skills 実装ガイド：ローカルツールをスムーズに統合する方法"
url: https://tech-lab.sios.jp/archives/50154
image: https://tech-lab.sios.jp/wp-content/uploads/2025/11/59040ac8de596dc10cc5c94654fc9d72.jpg
extracted_at: 2025-11-19T12:51:37.878Z
---

# Claude Code Skills 実装ガイド：ローカルツールをスムーズに統合する方法

**目次**

-   [1はじめに](#hajimeni)
    -   [1.1記事の位置づけ](#ji_shino_wei_zhidzuke)
-   [2📚 この記事で学べること](#kono_ji_shide_xueberukoto)
    -   [2.1🎯 主要なポイント](#zhu_yaonapointo)
    -   [2.2💡 実践的なテクニック](#shi_jian_denatekunikku)
-   [3📋 前提条件](#qian_ti_tiao_jian)
    -   [3.1必要な知識](#bi_yaona_zhi_shi)
    -   [3.2あると理解が深まる知識](#aruto_li_jiega_shenmaru_zhi_shi)
    -   [3.3本記事で扱わないこと](#ben_ji_shide_xiwanaikoto)
-   [4🔄 Before / After: Skill 登録の効果](#Before_After_Skill_deng_luno_xiao_guo)
    -   [4.1Before: CLAUDE.md にツール説明を記載](#Before_CLAUDEmd_nitsuru_shuo_mingwo_ji_zai)
    -   [4.2After: Skill ファイルに登録](#After_Skill_fairuni_deng_lu)
    -   [4.3体感の違い](#ti_ganno_weii)
    -   [4.4技術的な違い：Progressive Loading](#ji_shu_dena_weiiProgressive_Loading)
        -   [4.4.1CLAUDE.md のコンテキスト管理](#CLAUDEmd_nokontekisuto_guan_li)
        -   [4.4.2Skills のコンテキスト管理](#Skills_nokontekisuto_guan_li)
        -   [4.4.3トークン消費の比較](#tokun_xiao_feino_bi_jiao)
-   [5🛠️ 実装例: blog-scraper の Skill 登録](#shi_zhuang_li_blog-scraper_no_Skill_deng_lu)
    -   [5.1ツールの概要](#tsuruno_gai_yao)
    -   [5.2実行方法（uv workspace）](#shi_xing_fang_fa_uv_workspace)
        -   [5.2.1ルートディレクトリから実行](#rutodirekutorikara_shi_xing)
        -   [5.2.2コマンド例](#komando_li)
    -   [5.3出力例](#chu_li_li)
-   [6📐 Skill ファイルの構造と設計](#Skill_fairuno_gou_zaoto_she_ji)
    -   [6.1YAML Frontmatter（メタデータ）](#YAML_Frontmattermetadeta)
        -   [6.1.1必須フィールド](#bi_xufirudo)
        -   [6.1.2任意フィールド](#ren_yifirudo)
    -   [6.2必須セクション](#bi_xusekushon)
        -   [6.2.11\. When to Use（トリガー定義）](#1_When_to_Usetoriga_ding_yi)
        -   [6.2.22\. Commands（実行コマンド）](#2_Commands_shi_xingkomando)
        -   [6.2.33\. Output Interpretation（出力解釈）](#3_Output_Interpretation_chu_li_jie_shi)
        -   [6.2.44\. Response to User（報告フォーマット）](#4_Response_to_User_bao_gaofomatto)
    -   [6.3オプションセクション](#opushonsekushon)
        -   [6.3.15\. Options（オプション説明）](#5_Optionsopushon_shuo_ming)
        -   [6.3.26\. Important Notes（注意事項）](#6_Important_Notes_zhu_yi_shi_xiang)
-   [7🚀 実装のステップ](#shi_zhuangnosuteppu)
    -   [7.1Step 1: Skill ディレクトリの作成](#Step_1_Skill_direkutorino_zuo_cheng)
    -   [7.2Step 2: ファイル構造の選択](#Step_2_fairu_gou_zaono_xuan_ze)
        -   [7.2.1パターンA: シンプル（単一ファイル）](#patanA_shinpuru_dan_yifairu)
        -   [7.2.2パターンB: ディレクトリ構造（公式推奨）](#patanB_direkutori_gou_zao_gong_shi_tui_jiang)
    -   [7.3Step 3: Skill ファイルの作成](#Step_3_Skill_fairuno_zuo_cheng)
    -   [7.4Step 4: Skill の記述](#Step_4_Skill_no_ji_shu)
        -   [7.4.1実際の作成フロー](#shi_jino_zuo_chengfuro)
    -   [7.5Step 5: テスト](#Step_5_tesuto)
    -   [7.6Step 6: 改善](#Step_6_gai_shan)
-   [8🔍 MCP との比較](#MCP_tono_bi_jiao)
    -   [8.1MCP (Model Context Protocol) Server](#MCP_Model_Context_Protocol_Server)
    -   [8.2Skill](#Skill)
    -   [8.3スラッシュコマンド](#surasshukomando)
    -   [8.4比較表](#bi_jiao_biao)
-   [9✨ ベストプラクティス](#besutopurakutisu)
    -   [9.1公式推奨事項](#gong_shi_tui_jiang_shi_xiang)
        -   [9.1.1SKILL.md は500行以下に保つ](#SKILLmd_ha500xing_yi_xiani_baotsu)
        -   [9.1.2Progressive Disclosure を活用](#Progressive_Disclosure_wo_huo_yong)
        -   [9.1.3全モデルでテスト](#quanmoderudetesuto)
        -   [9.1.4ファイルパスは Forward slash を使用](#fairupasuha_Forward_slash_wo_shi_yong)
    -   [9.21\. トリガーワードを明確にする](#1_torigawadowo_ming_quenisuru)
    -   [9.32\. 実際に動作するコマンドを記載](#2_shi_jini_dong_zuosurukomandowo_ji_zai)
    -   [9.43\. 出力の解釈方法を具体的に](#3_chu_lino_jie_shi_fang_fawo_ju_ti_deni)
    -   [9.54\. エラーハンドリングを含める](#4_erahandoringuwo_hanmeru)
    -   [9.65\. ユーザーへの報告形式を統一](#5_yuzaheno_bao_gao_xing_shiwo_tong_yi)
-   [10⚠️ セキュリティ上の注意](#sekyuriti_shangno_zhu_yi)
    -   [10.11\. 信頼できるソースからのみインストール](#1_xin_laidekirusosukaranomiinsutoru)
    -   [10.22\. プロンプトインジェクションのリスク](#2_puronputoinjekushonnorisuku)
    -   [10.33\. 実行前の確認を推奨](#3_shi_xing_qianno_que_renwo_tui_jiang)
    -   [10.44\. プロジェクト固有の制約](#4_purojekuto_gu_youno_zhi_yue)
-   [11❓ よくある課題と解決法](#yokuaru_ke_tito_jie_jue_fa)
    -   [11.1課題 1: Skill が認識されない](#ke_ti_1_Skill_ga_ren_shisarenai)
    -   [11.2課題 2: コマンドが実行されない](#ke_ti_2_komandoga_shi_xingsarenai)
    -   [11.3課題 3: 出力の解釈が間違っている](#ke_ti_3_chu_lino_jie_shiga_jian_weitteiru)
-   [12📝 まとめ](#matome)
    -   [12.1CLAUDE.md vs Skill の結論](#CLAUDEmd_vs_Skill_no_jie_lun)
    -   [12.2推奨ユースケース](#tui_jiangyusukesu)
    -   [12.3次のステップ](#cinosuteppu)
-   [13📚 参考リンク](#can_kaorinku)
    -   [13.1公式ドキュメント](#gong_shidokyumento)
    -   [13.2関連記事](#guan_lian_ji_shi)

## はじめに

ども！先週はいろいろなブログを記述していたら10本も投稿していた龍ちゃんです。執筆速度が爆速になっているのですが、Claude Code と協業するようになったのが要因ですね。それらに関しては「[【2025 年版】検証 → 記事化で知見を資産化！Claude Code×RAG もどきで AI 技術ブログ執筆を効率化](https://tech-lab.sios.jp/archives/50103)」でまとめています。今回は、そちらのブログで触れていた情報を収集するツールの呼び出しを Claude Code の Skill 登録してスムーズに呼び出せるようになったのでその話を共有していこうと思います。

皆さん、プロジェクト固有の便利なツールやスクリプト、**Claude Code に使ってもらえてますか？**

僕も以前はこんな悩みを抱えていました：

-   **CLAUDE.md にツールの使い方を詳細に書いても、Claude Code が使ってくれない**
-   **「〇〇ツールを使って」と明示的に指示しないと実行されない**
-   **ツール説明が CLAUDE.md に埋もれて、Claude Code が見つけられない**

特に困ったのが、**プロジェクトが成長するにつれて CLAUDE.md がどんどん長くなり、気づいたら Claude Code がツール説明を無視するようになっていた**こと。最初は1,000文字程度だった CLAUDE.md が、開発ワークフローやアーキテクチャ情報を追加していくうちに8,000文字を超えてしまい、その中に埋もれたツール説明を Claude Code が見つけられなくなってしまったんですよね。

ブログ記事をスクレイピングするツールを作ったのに、毎回「blog-scraper を使って」と明示しないと実行されない。「記事を取得して」と言うだけでは、Claude Code が適切なツールを選択してくれない…。これ、なんとかならないかなぁと思っていたわけです。

そこで試したのが、**`.claude/skills/` ディレクトリに Skill ファイルを登録する方法**です。この仕組みにより、以下の成果を得られました：

✅ **トリガーワードで自動認識**（「記事を取得して」→ 自動的に blog-scraper を実行）  
✅ **CLAUDE.md の肥大化を防止**（ツール説明を専用ファイルに分離）  
✅ **一貫した出力報告**（Response フォーマットを定義）

この記事では、**Pythonスクリプトを Claude Code の Skill として登録し、スムーズに呼び出す方法**を、実際のプロジェクト例とともに解説していきます。

### 記事の位置づけ

この記事は、「[【2025 年版】検証 → 記事化で知見を資産化！Claude Code×RAG もどきで AI 技術ブログ執筆を効率化](https://tech-lab.sios.jp/archives/50103)」で紹介した **RAG もどき（ブログ HTML 抽出ツール）** を、より効率的に Claude に使ってもらうための実践編です。

なお、**Claude Skills は 2025年10月16日に Anthropic から正式に発表された新機能**です。本記事では、この新機能を実際のプロジェクトで活用した経験をもとに、実践的な登録方法と活用テクニックを解説します。

**公式ドキュメント**: [https://code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills)

## 📚 この記事で学べること

この記事を読むことで、以下の知識とスキルが得られます：

### 🎯 主要なポイント

1.  **CLAUDE.md vs Skill の比較**  
    ツール説明を CLAUDE.md に書く方法と Skill 化の違い
2.  **Skill ファイルの構造**  
    Claude が理解しやすい Skill ファイルの書き方
3.  **実装例: blog-scraper**  
    Python スクリプトを Skill として登録する具体例
4.  **MCP との比較**  
    MCP、Skill、スラッシュコマンドの使い分け

### 💡 実践的なテクニック

-   `.claude/skills/` ディレクトリの活用方法
-   “When to Use” によるトリガー定義
-   出力の解釈方法と報告フォーマットの定義
-   Markdown のコードブロックネスト問題の回避

## 📋 前提条件

### 必要な知識

-   **Claude Code の基本的な使用経験**
-   プロジェクト固有のツール・スクリプトを持っている
-   CLAUDE.md の基本的な理解

### あると理解が深まる知識

-   **RAG もどきシステムの概念**  
    以下の記事を参照：  
    [【2025 年版】検証 → 記事化で知見を資産化！Claude Code×RAG もどきで AI 技術ブログ執筆を効率化](https://tech-lab.sios.jp/archives/50103)

### 本記事で扱わないこと

❌ MCP Server の詳細な実装方法  
❌ Python スクリプトの基礎  
❌ uv パッケージマネージャーの詳細

本記事は、**プロジェクト固有のツールを Claude Code の Skill として登録する方法**に焦点を当てています。

## 🔄 Before / After: Skill 登録の効果

まずは、Skill 登録前後の違いを見てみましょう。

### Before: CLAUDE.md にツール説明を記載

**別リポジトリでの例**：TypeScript で作成した `fetch-blog-html.ts` ツール

CLAUDE.md に詳細な使用方法を記載していました（約8,000文字）：

````
# CLAUDE.md - Docs ツールガイド

## ツール一覧

### fetch-blog-html.ts

**目的**: SIOS Tech Lab ブログから HTML を取得し、調査ドキュメントと比較検証するためのツール

**機能**:
- ブログ記事の HTML を取得
- OGP 情報（タイトル、URL、画像）を抽出
- 不要な要素・属性を削除して圧縮
- Claude 用のトークン数を推定・表示

## セットアップ

```bash
cd /home/node/dev/docs
npm install
```

## 使用方法

### 方法1: npm script を使用（推奨）

```bash
cd /home/node/dev/docs
URL="https://tech-lab.sios.jp/archives/XXXXX" npm run fetch-blog
```

### 方法2: 直接実行

```bash
cd /home/node/dev/docs/tools
URL="https://tech-lab.sios.jp/archives/XXXXX" npx ts-node fetch-blog-html.ts
```
````

**問題点**:

❌ **呼び出しの不確実性**: Claude Code が毎回 CLAUDE.md を参照するとは限らない  
❌ **コンテキスト埋もれ**: CLAUDE.md が長くなると、ツール説明が埋もれる  
❌ **明示的な指示が必要**: 「fetch-blog-html.ts を使って」と明示しないと使われない

### After: Skill ファイルに登録

**現リポジトリでの例**：Python で作成した `blog-scraper` ツール

`.claude/skills/blog-scraper.md`（約2,000文字）：

````
# Blog Scraper Skill

SIOS Tech Lab のブログ記事をスクレイピングして、トークン数を削減した形式で保存します。

## When to Use

以下の場合にこのスキルを使用してください：

- ユーザーが SIOS Tech Lab のブログ記事の URL を提供し、その内容を保存したい場合
- ユーザーが「ブログをスクレイピングして」「記事を取得して」などと依頼した場合
- 複数の記事を一括で取得したい場合

## Commands

### 単一 URL の取得

```bash
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper [URL]
```

例：

```bash
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper https://tech-lab.sios.jp/archives/48173
```

## Response to User

### 成功時

```
✅ ブログ記事のスクレイピングが完了しました。

【記事情報】
- タイトル: [記事タイトル]
- トークン削減: [元のトークン数] → [削減後のトークン数] ([削減率]%削減)
- 保存先: docs/data/blog/tech-lab-sios-jp-archives-[記事ID].html
- ファイルサイズ: [サイズ] bytes
```
````

**改善点**:

✅ **自動認識**: トリガーワード（「記事を取得して」）で自動的にスキルを使用  
✅ **専用スペース**: `.claude/skills/` という専用ディレクトリで管理  
✅ **構造化**: Claude が理解しやすいセクション構造  
✅ **プロアクティブ**: ユーザーがツール名を知らなくても適切に使用される

### 体感の違い

**シナリオ**: ユーザーが「https://tech-lab.sios.jp/archives/48173 の記事を取得して」と依頼

**Before（CLAUDE.md）**:

1.  CLAUDE.md を読み込む（必ずとは限らない）
2.  ツール説明を見つける
3.  使用方法を理解する
4.  コマンドを組み立てる
5.  実行

→ **問題**: ツール名を明示しないと使われない可能性  
→ **失敗時**: fetchでページ全体を取得する

**After（Skill）**:

1.  `.claude/skills/blog-scraper.md` を参照（優先的に読み込まれる）
2.  “When to Use” で「記事を取得して」がトリガーと確認
3.  “Commands” から適切なコマンドを選択
4.  実行
5.  “Output Interpretation” に従って出力を解釈
6.  “Response to User” のフォーマットでユーザーに報告

→ **改善**: トリガーワードで自動認識、一貫した報告

### 技術的な違い：Progressive Loading

**なぜ Skill がスムーズなのか？** その答えは **Progressive Loading（段階的読み込み）** という仕組みにあります。

#### CLAUDE.md のコンテキスト管理

```
プロジェクト開始時
↓
CLAUDE.md 全文（8,000文字 = 約2,000トークン）を読み込み
↓
常にコンテキストウィンドウに存在
↓
他の情報が追加されると、相対的に優先度が下がる
↓
ツール説明が埋もれる可能性
```

**問題点**:

-   8,000文字の CLAUDE.md を常時読み込むため、コンテキストを圧迫
-   ツール説明が長文の中に埋もれて、Claude Code が見逃す可能性

#### Skills のコンテキスト管理

Skills は **3段階の段階的読み込み** を採用：

**レベル1: Metadata のみ（起動時）**

```
プロジェクト開始時
↓
全 Skills の name + description のみ読み込み（各30-50トークン）
↓
10個の Skill でも約500トークンのみ
```

**レベル2: SKILL.md 本文（必要時）**

```
ユーザーリクエストと description がマッチ
↓
該当 Skill の SKILL.md 全文を読み込み
↓
詳細な指示を取得
```

**レベル3: サポートファイル（さらに必要時）**

```
SKILL.md に "see REFERENCE.md for details" などの参照
↓
必要な追加ファイルを読み込み
```

#### トークン消費の比較

方式

起動時のトークン消費

実行時

**CLAUDE.md**

約2,000トークン（全文）

常時存在

**Skills**

約500トークン（10 Skills のメタデータ）

必要な Skill のみ読み込み

**これが「体感が良くなる」技術的な理由**:

1.  **コンテキストウィンドウの効率的な使用**: 必要な情報だけを段階的に読み込む
2.  **確実な発見**: description が必ず読み込まれるため、Claude Code がトリガーを見逃さない
3.  **柔軟な拡張**: Skills を増やしても、起動時のトークン消費は最小限

**注記**：Skill がトリガーされると、SKILL.md 本文が読み込まれます。  
ただし、使用しない Skill は読み込まれないため、コンテキストウィンドウを効率的に使用できます。

## 🛠️ 実装例: blog-scraper の Skill 登録

実際に登録している `blog-scraper` ツールを例に、Skill ファイルの構造を解説します。

### ツールの概要

**目的**: SIOS Tech Lab のブログ記事をスクレイピングし、Claude AI 向けにトークン数を削減して保存

**言語**: Python 3.12+  
**パッケージ管理**: uv (workspace 機能使用)  
**CLI フレームワーク**: Click

**主要機能**:

1.  **トークン削減**: 平均 87.4% 削減
    -   元ページ全体: 26,811 トークン
    -   圧縮後: 3,390 トークン
2.  **robots.txt 自動確認**: 礼儀正しいスクレイピング
3.  **レート制限**: 最低 1 秒間隔でリクエスト
4.  **複数 URL 対応**: バッチ処理とプログレスバー表示

### 実行方法（uv workspace）

#### ルートディレクトリから実行

```
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper [URL]
```

#### コマンド例

```
# 単一 URL
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper https://tech-lab.sios.jp/archives/48173

# 複数 URL
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper \
  https://tech-lab.sios.jp/archives/48173 \
  uv + Ruff + mypyで構築する超軽量Python開発環境 – イメージサイズ削減・型安全性確保を実現

# URL ファイル
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper --url-file urls.txt
```

### 出力例

```
🚀 Blog Scraper 起動
📁 出力先: docs/data/blog
📝 処理対象: 1 件のURL

🤖 robots.txt確認中...
✅ robots.txt: 許可

📄 処理中: https://tech-lab.sios.jp/archives/48173
  🔄 HTML取得中...
  📋 タイトル: PCの環境構築を迅速かつ簡単に！dotfilesで設定管理を始めよう | SIOS Tech. Lab
  🔧 コンテンツ圧縮中...
  📊 トークン削減: 26,811 → 3,390 (87.4%削減)
  ✅ 保存完了: 14078 bytes

==================================================
📊 処理結果サマリー
  成功: 1
  スキップ: 0
  エラー: 0
  合計: 1
==================================================
🎉 すべての処理が完了しました
```

## 📐 Skill ファイルの構造と設計

Skill ファイルは、Claude Code が理解しやすいように構造化されています。

### YAML Frontmatter（メタデータ）

Skill ファイルの先頭には、YAML frontmatter でメタデータを記述します。

#### 必須フィールド

**name（Skill 名）**:

-   **制約**: 小文字、数字、ハイフン（`-`）のみ
-   **最大長**: 64文字
-   **推奨形式**: Gerund form（動名詞形）
-   良い例: `processing-pdfs`, `analyzing-spreadsheets`, `blog-scraping`
-   許容範囲: `blog-scraper`

**description（説明）**:

-   **制約**: 最大 **1024文字**
-   **記述スタイル**: 第三人称
-   **内容**:
-   Skill が何をするか（What）
-   いつ使うべきか（When）
-   **重要**: Claude Code がこの情報をもとに Skill を発見する

**良い例**:

```
---
name: blog-scraper
description: "SIOS Tech Lab のブログ記事をスクレイピングして、トークン数を削減した形式で保存します。Use when the user provides a blog URL and wants to save its content."
---
```

**悪い例**:

```
---
name: BlogScraper  # 大文字を含む（NG）
description: "Helps with blogs"  # 何をするか、いつ使うかが不明確
---
```

#### 任意フィールド

**version**: バージョン管理（例: `1.0.0`）  
**dependencies**: 必要なパッケージ（例: `python>=3.8`）  
**allowed-tools**: 使用を制限するツール（例: `[Bash, Read, Write]`）

### 必須セクション

#### 1\. When to Use（トリガー定義）

Claude Code がこのスキルを使うべき状況を明示：

```
## When to Use

以下の場合にこのスキルを使用してください：

- ユーザーが SIOS Tech Lab のブログ記事の URL を提供し、その内容を保存したい場合
- ユーザーが「ブログをスクレイピングして」「記事を取得して」などと依頼した場合
- 複数の記事を一括で取得したい場合
```

**設計ポイント**:

-   具体的なトリガーワードを列挙
-   ユーザーの依頼パターンを網羅

#### 2\. Commands（実行コマンド）

実際に動作するコマンドを記載：

````
## Commands

### 単一 URL の取得

```bash
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper [URL]
```

例：

```bash
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper https://tech-lab.sios.jp/archives/48173
```
````

**設計ポイント**:

-   プロジェクト固有のパス指定（`--package`）
-   実際に動作する具体例
-   複数のユースケースを網羅

#### 3\. Output Interpretation（出力解釈）

コマンド実行結果の解釈方法を説明：

```
## Output Interpretation

### 成功時の出力例

[実際の出力を貼り付け]

この出力から以下の情報をユーザーに報告してください：
- タイトル（「📋 タイトル:」の後の文字列）
- トークン削減率（「📊 トークン削減:」の後のパーセンテージ）
- 保存ファイルサイズ
- 保存先パス
```

**設計ポイント**:

-   実際の出力例を記載
-   どの情報を抽出するか明示
-   出力フォーマットの変化に対応

#### 4\. Response to User（報告フォーマット）

Claude Code がユーザーに報告する際のフォーマット：

````
## Response to User

### 成功時

```
✅ ブログ記事のスクレイピングが完了しました。

【記事情報】
- タイトル: [記事タイトル]
- トークン削減: [元のトークン数] → [削減後のトークン数] ([削減率]%削減)
- 保存先: docs/data/blog/tech-lab-sios-jp-archives-[記事ID].html
- ファイルサイズ: [サイズ] bytes
```
````

**設計ポイント**:

-   一貫性のある報告形式
-   ユーザーが知りたい情報を網羅
-   視覚的に分かりやすいフォーマット

### オプションセクション

#### 5\. Options（オプション説明）

```
## Options

- `--force`: 既存ファイルを上書き
- `--output [PATH]`: 出力ディレクトリを指定
- `--timeout [SECONDS]`: タイムアウト時間
- `--quiet`: 詳細メッセージを非表示
```

#### 6\. Important Notes（注意事項）

```
## Important Notes

1. **URL バリデーション**: `https://tech-lab.sios.jp/archives/` で始まる URL のみ受け付けます
2. **レート制限**: 最低1秒間隔でリクエストが送信されるため、複数URLの処理には時間がかかります
3. **robots.txt**: 自動的に確認され、禁止されている場合は処理を中断します
```

## 🚀 実装のステップ

### Step 1: Skill ディレクトリの作成

```
mkdir -p .claude/skills
```

### Step 2: ファイル構造の選択

Skills のファイル構造には **2つのパターン** があります。

#### パターンA: シンプル（単一ファイル）

```
.claude/skills/
└── blog-scraper.md
```

**特徴**:

-   シンプルなツールに最適
-   ファイル1つで完結
-   サポートファイルが不要な場合に推奨

**本記事の採用パターン**: blog-scraper はシンプルなツールのため、このパターンを採用

#### パターンB: ディレクトリ構造（公式推奨）

```
.claude/skills/
└── blog-scraper/
    ├── SKILL.md（必須）
    ├── REFERENCE.md（任意）
    ├── examples/（任意）
    └── scripts/（任意）
```

**特徴**:

-   複雑な Skill に最適
-   サポートファイルを整理できる
-   Progressive Loading を最大限活用

**推奨ケース**:

-   詳細なリファレンスを含む Skill
-   複数のスクリプトやテンプレートを含む Skill
-   段階的に情報を提供したい場合

**公式の記載**: “Both approaches work identically.”（両方のアプローチが同じように動作する）

**どちらを選ぶべきか**:

-   シンプルなツール（本記事の blog-scraper）→ パターンA
-   複雑なツール（PDF処理、Excel操作など）→ パターンB

### Step 3: Skill ファイルの作成

パターンAの場合: `.claude/skills/blog-scraper.md` を作成  
パターンBの場合: `.claude/skills/blog-scraper/SKILL.md` を作成

### Step 4: Skill の記述

**実践的なアプローチ**: Claude Code に作成を依頼する

実は、Skill ファイルの作成は**Claude Code に依頼するのが一番効率的**です。僕も基本的に Claude Code に作成してもらっています。

#### 実際の作成フロー

**ポイント**: 最初から Skill ファイルを書こうとしない。まず動かして、成功してから Skill 化する。

**ステップ1: やってほしいことを詳細に説明**

```
SIOS Tech Lab のブログ記事（https://tech-lab.sios.jp/archives/XXXXX）を
スクレイピングして、以下の処理を行う Python スクリプトを作成してください：

1. 記事のメインコンテンツだけを抽出（広告やナビゲーションは除外）
2. トークン数を削減（不要な HTML タグやスタイル情報を削除）
3. docs/data/blog/ ディレクトリに保存
4. robots.txt を確認して、許可されている場合のみスクレイピング
5. レート制限を設けて、礼儀正しくアクセス

【要件】
- uv workspace の scraper パッケージとして実装
- コマンドライン引数で URL を受け取る
- 複数 URL の一括処理にも対応
- プログレスバーで進捗を表示
```

**ステップ2: Claude Code が実装して実行**

Claude Code がスクリプトを作成し、実際に実行してくれます。この時点で動作確認をして、問題があれば修正を依頼します。

**ステップ3: 成功した内容を参考に Skill 化を依頼**

実行が成功したら、その結果を使って Skill ファイルを作成してもらいます：

```
この blog-scraper ツールがうまく動作しました！
以下の実行結果を参考に、.claude/skills/blog-scraper.md を作成してください。

【実行結果】
$ uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper https://tech-lab.sios.jp/archives/48173

🚀 Blog Scraper 起動
📁 出力先: docs/data/blog
📝 処理対象: 1 件のURL

🤖 robots.txt確認中...
✅ robots.txt: 許可

📄 処理中: https://tech-lab.sios.jp/archives/48173
  🔄 HTML取得中...
  📋 タイトル: PCの環境構築を迅速かつ簡単に！dotfilesで設定管理を始めよう | SIOS Tech. Lab
  🔧 コンテンツ圧縮中...
  📊 トークン削減: 26,811 → 3,390 (87.4%削減)
  ✅ 保存完了: 14078 bytes

【トリガーワード例】
- 「ブログをスクレイピングして」
- 「記事を取得して」
- 「この URL の記事を保存して」

【必要なセクション】
- When to Use: いつこのツールを使うべきか
- Commands: 実行コマンドの例
- Output Interpretation: 出力の見方
- Response to User: ユーザーへの報告形式
- Important Notes: 注意事項（robots.txt、レート制限など）
```

**なぜこのフローが効果的か**:

1.  **動作確認済み**: Skill 化する前に、ツール自体が動作することを確認できる
2.  **具体的な例**: 実際の出力を見ながら Skill ファイルを書けるので、正確な記述ができる
3.  **トリガーワードの自然な発見**: 実際に使ってみて「こう言えば呼び出せそう」というワードが見つかる
4.  **反復改善**: 一度 Skill 化してから、使ってみて「ここはもっと詳しく」という調整がしやすい

**作成後の調整ポイント**:

1.  トリガーワードが十分か確認（実際に使ってみて追加）
2.  エラーケースを追加（robots.txt で禁止されている場合など）
3.  よくある使い方を Example Workflow に追加

**Skill ファイルに含めるべきセクション**（参考）:

1.  タイトルと説明
2.  When to Use（トリガー定義）
3.  Commands（実行コマンド）
4.  Options（オプション説明）
5.  Output Interpretation（出力解釈）
6.  Response to User（報告フォーマット）
7.  Important Notes（注意事項）
8.  Example Workflow（使用例）

### Step 5: テスト

1.  新しいチャットを開始
2.  トリガーワードで依頼
3.  動作確認

### Step 6: 改善

-   実際の動作を見て Skill ファイルを調整
-   コマンド例の追加
-   エラーケースの追加

## 🔍 MCP との比較

### MCP (Model Context Protocol) Server

**メリット**:

-   Claude Desktop に完全統合
-   自動的にツールを認識
-   引数の自動補完
-   型安全性が高い

**デメリット**:

-   実装が複雑（Python の mcp ライブラリ、サーバー起動）
-   設定ファイル（`claude_desktop_config.json`）の編集が必要
-   デバッグが難しい
-   プロジェクトごとの設定が煩雑

### Skill

**メリット**:

-   **実装が簡単**（Markdown ファイル 1 つ）
-   設定ファイル不要
-   すぐに使える
-   デバッグしやすい（ファイルを編集するだけ）
-   プロジェクト固有のツールに最適

**デメリット**:

-   Claude が手動で Bash ツールを実行する形式
-   MCP ほどの自動化はない

### スラッシュコマンド

**メリット**:

-   実装が簡単
-   ユーザーが明示的に制御

**デメリット**:

-   ユーザーが `/command-name` で明示的に呼び出す必要がある
-   自動認識されない

### 比較表

項目

MCP Server

Skill

スラッシュコマンド

実装難易度

高

低

低

自動認識

○

△

×

設定ファイル

必要

不要

不要

適用範囲

グローバル

プロジェクト

プロジェクト

デバッグ容易性

低

高

高

推奨ケース

外部データ接続

手続き的知識

ワークフロー

**結論**: MCP と Skill は補完的な関係にあります。外部システムとの統合には MCP、プロジェクト内部の CLI ツールには Skill が適しています。

## ✨ ベストプラクティス

### 公式推奨事項

#### SKILL.md は500行以下に保つ

**理由**: コンテキストウィンドウはシステムプロンプト、会話履歴、他の Skills で共有されます。

**対策**: 詳細な情報は REFERENCE.md などのサポートファイルに分離し、Progressive Loading を活用します。

#### Progressive Disclosure を活用

**構造例**:

```
.claude/skills/
└── complex-skill/
    ├── SKILL.md（概要と主要な指示）
    ├── REFERENCE.md（詳細なリファレンス）
    ├── examples/（使用例）
    └── scripts/（実行可能なユーティリティ）
```

SKILL.md から `see REFERENCE.md for details` のように参照することで、必要な時だけ詳細情報を読み込めます。

#### 全モデルでテスト

**推奨**: Haiku、Sonnet、Opus の全モデルで動作確認

**理由**: モデルによって Skill の理解度が異なる場合があるため、主要なモデルで動作を確認しておくことで、より安定した Skill を提供できます。

#### ファイルパスは Forward slash を使用

**Windows でも**:

-   ✅ `reference/guide.md`
-   ❌ `reference\guide.md`

**理由**: クロスプラットフォームでの互換性を確保

### 1\. トリガーワードを明確にする

**良い例**:

```
## When to Use

- ユーザーが「記事を取得して」「スクレイピングして」と依頼した場合
- ユーザーが SIOS Tech Lab の URL を提供した場合
```

**悪い例**:

```
## When to Use

- 必要に応じて使用してください
```

### 2\. 実際に動作するコマンドを記載

**良い例**:

```
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper https://tech-lab.sios.jp/archives/48173
```

**悪い例**:

```
blog-scraper [URL]  # パスや実行方法が不明確
```

### 3\. 出力の解釈方法を具体的に

**良い例**:

```
この出力から以下の情報をユーザーに報告してください：
- タイトル（「📋 タイトル:」の後の文字列）
- トークン削減率（「📊 トークン削減:」の後のパーセンテージ）
```

**悪い例**:

```
出力を確認してユーザーに伝えてください
```

### 4\. エラーハンドリングを含める

````
### エラー時の出力例

```
❌ HTTP エラー 404: https://tech-lab.sios.jp/archives/12345
```

対処法：URL が正しいか確認してください。記事が削除されている可能性があります。
````

### 5\. ユーザーへの報告形式を統一

フォーマットを定義することで、一貫性のある体験を提供：

````
## Response to User

### 成功時

```
✅ [ツール名]の実行が完了しました。

【結果】
- 項目1: [値]
- 項目2: [値]
```
````

## ⚠️ セキュリティ上の注意

Skills は強力な機能ですが、適切に使用しないとセキュリティリスクがあります。

### 1\. 信頼できるソースからのみインストール

-   **信頼できないソースからの Skill は実行前に必ず内容を確認してください**
-   Skill ファイルは Claude Code に実行権限を与えるため、悪意のあるコマンドが含まれている可能性があります
-   GitHub など公開されている Skill を使用する場合は、作成者の信頼性を確認しましょう
-   基本的に自作するのが良いと思います！

### 2\. プロンプトインジェクションのリスク

Skills はユーザー入力に基づいて動作するため、以下のリスクがあります：

**リスク例**:

-   ユーザーが提供した URL や入力が、意図しないコマンドを実行する可能性
-   Skill の出力を悪用して、Claude Code に誤った指示を与える可能性

**対策**:

-   Skill 内で外部入力を扱う場合は、適切なバリデーションを実装
-   コマンド実行前に、実行内容をユーザーに確認する仕組みを検討
-   機密情報を含むプロジェクトでは、特に注意が必要

### 3\. 実行前の確認を推奨

-   Skill が実行するコマンドを理解してから使用してください
-   特に、ファイルシステムへの書き込みやネットワークアクセスを伴う Skill は慎重に
-   本記事の blog-scraper も、robots.txt の確認やレート制限など、礼儀正しい実装を心がけています

### 4\. プロジェクト固有の制約

-   機密情報を扱うプロジェクトでは、Skill の使用を制限することを検討
-   チーム開発では、Skill のレビュープロセスを確立することを推奨
-   `.gitignore` で Skill ディレクトリを除外する場合は、チームメンバーへの共有方法を検討

## ❓ よくある課題と解決法

### 課題 1: Skill が認識されない

**原因**:

-   ファイルパスが間違っている
-   Markdown の構文エラー

**解決方法**:

```
# ファイルパスを確認
ls -la .claude/skills/blog-scraper.md

# Markdown の構文チェック
cat .claude/skills/blog-scraper.md
```

### 課題 2: コマンドが実行されない

**原因**:

-   コマンド例が間違っている
-   実行環境の違い（ディレクトリ、パスなど）

**解決方法**:

```
# 手動でテスト
uv run --package sios-tech-lab-analytics-ga4-scraper blog-scraper https://tech-lab.sios.jp/archives/48173
```

### 課題 3: 出力の解釈が間違っている

**原因**:

-   出力フォーマットの変更
-   解釈方法の説明が不明確

**解決方法**:

-   実際の出力例を Skill に追加
-   どの部分を抽出すべきか明記

## 📝 まとめ

この記事では、**Python スクリプトを Claude Code の Skill として登録し、スムーズに呼び出す方法**を解説しました。

### CLAUDE.md vs Skill の結論

観点

CLAUDE.md

Skill

トリガー明確性

△ 不明確

○ “When to Use”で明示

参照優先度

△ 他の情報に埋もれる

○ 専用ディレクトリで優先

構造化

△ 自由形式

○ セクション構造

出力解釈

△ 推測ベース

○ 明示的に指示

報告フォーマット

△ 不統一

○ 定義済み

デバッグ

△ 長文の編集

○ 独立ファイル

実装難易度

○ 簡単

○ 簡単

**体感の改善理由**:

1.  **Progressive Loading**: メタデータのみ読み込み（30-50トークン）→ 必要時に詳細読み込み
2.  **トリガー認識**: description が必ず読み込まれるため、Claude Code が確実に発見
3.  **コンテキスト効率**: 10個の Skills でも約500トークンのみ（CLAUDE.md は2,000トークン）
4.  **構造化情報**: セクション分けで Claude Code が段階的に理解
5.  **一貫性**: 報告フォーマット定義で毎回同じ品質

### 推奨ユースケース

**Skill が適している**:

-   プロジェクト固有の CLI ツール
-   Python スクリプト、シェルスクリプト
-   リポジトリ内のツール
-   手続き的な知識の提供

**CLAUDE.md が適している**:

-   プロジェクト全体の開発ガイドライン
-   開発ワークフローの説明
-   アーキテクチャ情報
-   Skill として切り出せない一般的な説明

**MCP が適している**:

-   外部データソースとの接続
-   複数のプロジェクトで使用するツール
-   公開するツール
-   リアルタイムデータアクセス

### 次のステップ

1.  既存の CLAUDE.md 内のツール説明を Skill に移行
2.  新しいツールを作成したら Skill ファイルも作成
3.  Skill ファイルを継続的に改善（実際の使用経験に基づく）

---

## 📚 参考リンク

### 公式ドキュメント

-   **[Claude Skills 公式発表](https://www.anthropic.com/news/skills)**:
-   **[Claude Code Skills ドキュメント](https://code.claude.com/docs/en/skills)**:
-   [**カスタム Skill 作成ガイド**:](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
-   **[Skill ベストプラクティス](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)**:
-   **[公式 Skills リポジトリ](https://github.com/anthropics/skills)**:
-   **[エンジニアリングブログ](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)**:

### 関連記事

-   **RAG もどきシステム**: [【2025 年版】検証 → 記事化で知見を資産化！Claude Code×RAG もどきで AI 技術ブログ執筆を効率化](https://tech-lab.sios.jp/archives/50103)

---

ここまで読んでいただき、ありがとうございました！

Skill 登録を実践することで、プロジェクト固有のツールが Claude Code によってスムーズに使われるようになり、開発効率が劇的に向上します。ぜひ、この記事を参考に、あなたのプロジェクトでも実践してみてください。

質問や感想は、コメント欄でお待ちしております。また、Twitter のほうもよろしくお願いします！

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-50154)[役に立たなかった](#afb-post-50154)  
  
0人がこの投稿は役に立ったと言っています。