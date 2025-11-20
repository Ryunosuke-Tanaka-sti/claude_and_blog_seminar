---
title: "Claude Code: 公式MCPを補完するSkills設計パターン | SIOS Tech. Lab"
url: https://tech-lab.sios.jp/archives/50214
image: https://tech-lab.sios.jp/wp-content/uploads/2025/11/81e74f9d9aadc0df03d171b04ad87e8e.png
extracted_at: 2025-11-19T12:58:48.477Z
---

# Claude Code: 公式MCPを補完するSkills設計パターン | SIOS Tech. Lab

**目次**

-   [1はじめに](#hajimeni)
-   [2TL;DR](#TLDR)
-   [3こんな人に読んでほしい](#konna_renni_dundehoshii)
-   [4公式MCPをSkillsで補完する汎用パターンの発見](#gong_shiMCPwoSkillsde_bu_wansuru_fan_yongpatanno_fa_jian)
-   [5システム利用者による技術選択](#shisutemu_li_yong_zheniyoru_ji_shu_xuan_ze)
    -   [5.1選択肢A：利用者が複数（社内共有レベル）→ アプリ化](#xuan_ze_zhiA_li_yong_zhega_fu_shu_she_nei_gong_youreberu_apuri_hua)
    -   [5.2選択肢B：利用者が個人〜チーム → 小さいワークフロー](#xuan_ze_zhiB_li_yong_zhega_ge_renchimu_xiaosaiwakufuro)
-   [6判断：個人開発 → Skills採用](#pan_duan_ge_ren_kai_fa_Skills_cai_yong)
-   [7さらなる選択：公式MCP vs 自作MCP vs Skill](#saranaru_xuan_ze_gong_shiMCP_vs_zi_zuoMCP_vs_Skill)
    -   [7.1比較表（2025年版）](#bi_jiao_biao_2025nian_ban)
    -   [7.2判断プロセス（2025年版）](#pan_duanpurosesu_2025nian_ban)
-   [8実装例：Supabase公式MCPを補完【700行、30+コマンド】](#shi_zhuang_liSupabase_gong_shiMCPwo_bu_wan_700xing30komando)
    -   [8.1汎用的な実装アプローチ（3ステップ）](#fan_yong_dena_shi_zhuangapurochi3suteppu)
-   [9成果：UI開発工数の大幅削減](#cheng_guoUI_kai_fa_gong_shuno_da_fu_xue_jian)
    -   [9.1選択肢A：アプリ化（社内共有レベル）- 一般的な工数](#xuan_ze_zhiAapuri_hua_she_nei_gong_youreberu-_yi_ban_dena_gong_shu)
    -   [9.2選択肢B：Skills化（個人〜チーム）- 実測例](#xuan_ze_zhiBSkills_hua_ge_renchimu-_shi_ce_li)
    -   [9.3削減効果の比較](#xue_jian_xiao_guono_bi_jiao)
-   [10汎用性：公式MCPを補完する展開](#fan_yong_xing_gong_shiMCPwo_bu_wansuru_zhan_kai)
    -   [10.1補完パターンの適用例](#bu_wanpatanno_shi_yong_li)
    -   [10.2実装パターンは全て同じ](#shi_zhuangpatanha_quante_tongji)
-   [11まとめ](#matome)
    -   [11.1核心的な発見](#he_xin_dena_fa_jian)
    -   [11.2既存ブログとの違い](#ji_cunburogutono_weii)
    -   [11.3今すぐできること](#jinsugudekirukoto)
-   [12参考リンク](#can_kaorinku)
    -   [12.1公式ドキュメント](#gong_shidokyumento)
    -   [12.2関連ブログ](#guan_lianburogu)

## はじめに

ども！Claude Codeにべったりな龍ちゃんです。

2025年、Claude CodeのMCP対応が進み、GitHub、Slack、Supabase、Firebase等、多くのサービスで**公式MCPサーバー**が利用可能になりました。

しかし実際のプロジェクトでは、**公式MCPだけでは不十分なケース**が多々あります：

-   **カスタムビジネスロジック**: 重複検出、データ検証、複数テーブル統合、マイグレーション処理
-   **トークン最適化**: MCPは4サーバーで55.7k (27.9%)消費（※1）
-   **独自要件**: 社内システム固有の処理、セキュリティ要件

本記事では、**公式MCPを基盤として、不足部分をSkillsで補完する**汎用的なパターンを、Supabaseの実例（700行Skill、30+コマンド）で解説します。しかも、**フロントエンド開発を一切スキップ**して実現できました。

※1: 実測データによると、MCPサーバーは大量のトークンを消費する傾向があります。  
よく使ってたMCPはNotionだったんですけど、こいつトークンバカ食いするんですよね。

普通、カスタムビジネスロジックを人間が使えるようにしようと思ったら、Reactでフロントエンド開発して、デザインシステム作って、UX設計して…って、2〜3週間は覚悟しますよね？（AIを活用することで開発の工数を抑えてもそれでも大変！）

でも、こう考えれば良いと気づいたんです：

1.  **公式SDK/APIをラップして自作Clientを作成**（カスタムビジネスロジック実装）
2.  **自作ClientをCLIツールでラップ**
3.  **CLIツールの使い方をSkillsとして定義**
4.  **Claude Codeが「UIとして機能」する**

**この汎用的なパターンを使えば、公式MCPで不十分な場合でも、カスタムビジネスロジックをClaude Codeと統合できます。**

Supabase、Firebase、社内API等…全て同じ4層構造（公式SDK → 自作Client → CLI → Skill）のアプローチです。この発想で、全てが変わりました。

## TL;DR

この記事で分かること：

-   **公式MCPを補完する3つのユースケース**（2025年版）
    1.  **カスタムビジネスロジック**: 重複検出、データ検証、複数テーブル統合（700行Skillの実例）
    2.  **トークン最適化**: MCP 55.7k (27.9%) vs Skills Progressive Disclosure
    3.  **独自要件**: 社内システム、セキュリティ要件、レガシーシステム
-   **汎用的な補完パターン**: 公式SDK → 自作Client → CLI → Skill の4層構造
    -   **対象**: 公式MCPでカバーされないカスタムロジック
    -   **実装例**: Supabase（公式MCP + 700行Skill）
-   **利用者数による技術選択**の判断基準
    -   社内共有レベル: アプリ化（Streamable HTTP/WebSocket + Function Calling/MCP自作）
    -   個人〜チーム: Claude Code + Skills
-   **実装パターン**: 短時間で完成
    -   Step 1: カスタムビジネスロジックを自作Clientに実装
    -   Step 2: CLI化（Click等）
    -   Step 3: Skill登録（Markdown）
-   **アプリ化をスキップ**することで工数を大幅削減
    -   アプリ化（一般的見積）: 128-192時間（16-24日）
    -   Skills化（実測例）: 数時間〜1日
    -   **削減の理由**: UI開発をスキップし、Claude Codeを操作インターフェースとして活用
-   **MCP vs Skillの判断基準**を実例で解説

**重要な前提条件:**

-   対象サービスのAPI/SDKが存在する
-   Python等のプログラミング基本知識
-   Claude Codeの基本操作を理解している

## こんな人に読んでほしい

✅ **公式MCPでは不十分なカスタムビジネスロジック**を実装したい開発者  
✅ **データ検証、重複検出、複数テーブル統合**等の独自処理が必要な人  
✅ **社内APIやレガシーシステム**をClaude Code対応したい開発者  
✅ **MCPのトークン消費を最適化**したい人（4サーバーで27.9%消費に悩んでいる）  
✅ **個人〜チームレベル**でツールを使いたい人（大規模なアプリ化は不要）  
✅ ビジネスロジックが固まっていない段階で、**小さく検証しながら開発**したい人  
✅ リモートMCP vs 自作MCP vs Skillで迷っている人

## 公式MCPをSkillsで補完する汎用パターンの発見

ある日、私はこんな課題に直面しました：

**課題**:

-   Supabaseに**公式MCPサーバーが存在する**が、カスタムビジネスロジック（重複検出、データ検証、複数テーブル統合）は提供されない
-   でも、フロントエンド開発で専用UIを作るのは時間がかかりすぎる
-   自作MCPサーバーを立てるのもインフラ管理が面倒

**まず確認すべきこと（2025年版）**:

1.  **公式MCPサーバーで十分か？**
    -   GitHub、Slack、Notion、Supabase、Firebase等は公開MCPサーバーが存在
    -   → **基本操作なら公式MCP使用（2024年11月のMCP発表以降、リモートMCPサーバーが順次展開）**
    -   参考: [MCP Servers Directory](https://github.com/modelcontextprotocol/servers)
2.  **公式MCPで不十分な場合**:
    -   **カスタムビジネスロジック**: 重複検出、データ検証、複数テーブル統合、マイグレーション
    -   **トークン最適化**: MCP 4サーバーで55.7k (27.9%)消費を回避したい
    -   **独自要件**: 社内API、レガシーシステム、セキュリティ要件
    -   → **本記事の汎用パターン（Skillsで補完）**

**発見した汎用パターン**（公式MCPを補完する場合）:

1.  **公式SDK/APIをラップして自作Clientを作成**（カスタムビジネスロジック実装）
2.  **自作ClientをCLIツールでラップ**
3.  **Skillsとして使い方を定義**

→ **この3ステップで公式MCPを補完し、カスタムロジックをClaude Codeと統合可能**

**今回の実例：Supabase公式MCPを700行Skillで補完**:

-   公式Supabase MCPでは提供されないカスタムロジックを実装
-   Supabase Python SDK（公式）をラップして自作Supabase Clientを作成
-   重複検出（find-duplicates）、データマイグレーション（merge –dry-run）、統計分析（stats）等を実装
-   別プロジェクトでの知見を活かして関数ベースのインターフェースで実装
-   自作ClientをCLIツールでラップ
-   Skillsとして提供（700行、30+コマンド）

-   ✅ フロントエンド開発なし
-   ✅ MCPサーバー構築なし
-   ✅ 短時間で運用開始

**読者への問いかけ**: あなたが実装したいカスタムビジネスロジック、ありませんか？この汎用パターンなら、公式MCPを補完できます。

## システム利用者による技術選択

さて、外部サービスやシステムに人間がアクセスできるようにするには、どんな選択肢があるでしょうか？

これは、Supabaseだけでなく、GitHub、Slack、AWS、社内API…あらゆるサービスとの接続で共通する判断です。

### 選択肢A：利用者が複数（社内共有レベル）→ アプリ化

**想定シナリオ**: 複数チームで使う、社内の共通ツールにする

**技術スタック**:

-   フロントエンド：React等でWebアプリ開発
-   バックエンド：Streamable HTTP/WebSocket + Function Calling or MCP
-   デプロイ：Azure/AWS等

*※MCP仕様では2025年3月にSSEトランスポートが非推奨化され、Streamable HTTPに置き換えられました。*

**開発工数（一般的な見積もり）**: 16-24日（128-192時間）

*※フルスタックWebアプリケーション開発（React + MCP統合）の一般的な工数。プロジェクトの複雑性により変動します。*

-   要件定義: 2-3日
-   UI設計・フロントエンド開発: 10-13日（デザインシステム構築含む）
-   バックエンド統合: 2-3日
-   テスト・デバッグ: 2-3日

**問題点**:

-   ⚠️ **時間がかかる**: 16-24日の開発期間
-   ⚠️ **柔軟性がない**: UIを作った後のビジネスロジック変更が大変
-   ビジネスロジックを変更 → UIも変更 → 再設計・再実装
-   小さい単位での試行錯誤ができない
-   使いながら要件を整理する、ということができない

### 選択肢B：利用者が個人〜チーム → 小さいワークフロー

**想定シナリオ**: 自分だけ、またはチーム内での共有（Skillsファイル共有）

**技術スタック**:

-   CLI：Click等でコマンドラインツール作成
-   Skills：Claude Code Skillsで使い方を定義
-   共有：`.claude/skills/`ディレクトリを共有

**開発工数**: 数時間〜1日

**利点**:

-   ✅ **即座に使い始められる**
-   ✅ **ビジネスロジックだけを柔軟に変更**できる
-   ✅ 小さく試行錯誤、使いながら要件を整理

## 判断：個人開発 → Skills採用

私の状況はこうでした：

**判断基準**:

-   利用者：**自分だけ**
-   要件：**まだ固まっていない**（使いながら整理したい）
-   ビジネスロジック：**頻繁に変更**する可能性
-   デモ：操作を見せたいが、フロントエンド開発は避けたい

→ **選択肢B（Claude Code + Skills）を採用**

特に、**ビジネスロジックが固まっていない段階でUIに投資するリスク**を避けたかったんです。

## さらなる選択：公式MCP vs 自作MCP vs Skill

選択肢B（Claude Code + ワークフロー）の中でも、実は技術選択肢が**3つ**あります（2025年版）：

1.  **公式MCP (Remote MCP)**: 既存の公開MCPサーバーを利用（2024年11月〜順次展開）
2.  **自作MCP (Model Context Protocol)**: 自分でMCPサーバーを実装
3.  **Skill**: Claude Code専用のツール統合（Markdownファイル）

**公式MCPサーバーが存在し、基本操作で十分な場合は、公式MCPが最も簡単です。**本記事のパターンは、公式MCPで不十分な場合（カスタムビジネスロジック、トークン最適化等）の選択です。

### 比較表（2025年版）

項目

公式MCP

自作MCP

Skill

**前提条件**

公開MCPサーバーが存在

MCPサーバーを自作

公式MCPで不十分 or MCPが存在しない

実装難易度

**最低（OAuth認証のみ）**

高（Pythonライブラリ、サーバー起動）

低（Markdown 1ファイル）

学習コスト

最低

高

低

所要時間

**数分**

1-2日

数時間

対応環境

Claude Desktop統合

Claude Desktop統合

Claude Code専用

型安全性

高

高

–

デバッグ

易

難

易

適用範囲

公開MCPがあるサービスの基本操作

外部システム連携

カスタムビジネスロジック、プロジェクト固有ツール

**運用コスト**

**$0（リモート）**

**高（サーバー稼働）**

**$0（ローカル）**

**トークン消費**

**多い（※）**

**多い（※）**

**少ない（Progressive Disclosure）**

**（※）MCPのトークン消費問題**: 4つのMCPサーバーで**55.7k トークン（27.9%）**消費という実測例が報告されています。1つのMCPサーバーにつき10-20個のツール定義があるが、実際に使うのは1-2個だけという無駄が発生します。SkillsはProgressive Disclosure（段階的開示）により、この問題を回避できます。起動時にスキルの名前と説明のみを読み込み、必要に応じて完全な内容を段階的にロードします。

### 判断プロセス（2025年版）

**ステップ1: 公式MCPサーバーの確認**  
→ Supabase公式MCPサーバーが存在（https://mcp.supabase.com/mcp）、基本CRUDは対応可能

**ステップ2: 公式MCPで十分か？**  
→ カスタムロジック（find-duplicates、merge –dry-run、stats、validate）は公式MCPにない → 不十分

**ステップ3: 自作MCP vs Skill**  
→ 使用者1人、ビジネスロジック検証、スピード重視、運用コスト$0 → **Skill採用**

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/part1-decision-flowchart.svg)

## 実装例：Supabase公式MCPを補完【700行、30+コマンド】

それでは、公式MCPを補完する汎用パターンを具体例で見てみましょう。

**今回の実装対象**: Supabase（公式MCP + カスタムビジネスロジック）  
**所要時間**: 数時間〜1日（実測値の一例として参考）  
**公式MCPの状況**: 基本CRUD操作は公式MCPサーバー（https://mcp.supabase.com/mcp）で対応可能  
**Skillで補完する内容**: 重複検出（find-duplicates）、データマイグレーション（merge –dry-run）、統計分析（stats）、整合性チェック（validate）等  
**成果物**: 5テーブル、30+コマンド、約700行Skill

### 汎用的な実装アプローチ（3ステップ）

**Step 1: 自作ServiceClient作成**

-   公式SDK/APIをラップして、カスタムビジネスロジックを実装
-   例: Supabase Python SDK → 自作Supabase Client（重複検出、統計分析等）
-   他サービス: PyGitHub/slack-sdk/boto3等をラップ

**Step 2: CLI作成**

-   自作ClientをClick等でCLIツール化
-   例: `db posts list`、`db hashtags merge --to ID --from IDs`
-   レイヤー構造: Skill → CLI → 自作Client → 公式SDK → 外部サービス

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/part1-4-layer-architecture-1.svg)

**Step 3: Skill登録**

-   Markdownファイルでコマンド使用方法を定義
-   Progressive Disclosure（段階的開示）で効率化：起動時にスキル名と説明のみ読み込み
-   例: `.claude/skills/x-posts-manager.md`（700行）

**なぜClientレイヤーを作るのか？**

-   公式SDKを直接使わず、自作Clientを挟むことで：
-   カスタムビジネスロジックをカプセル化
-   プロジェクト固有の処理を統一的に管理
-   関数ベースのインターフェース等の独自実装を追加可能

**詳しい実装方法**は、[Claude Code Skills 実装ガイド](https://tech-lab.sios.jp/archives/50154)を参照してください。

## 成果：UI開発工数の大幅削減

選択肢A vs 選択肢Bを比較してみましょう。

### 選択肢A：アプリ化（社内共有レベル）- 一般的な工数

要件定義（2-3日） → UI設計（3-5日） → フロントエンド開発（7-10日）
→ バックエンド統合（2-3日） → テスト（2-3日）
└─────────────── 16-24日（128-192時間） ──────────────┘

*※フルスタックWebアプリケーション開発の一般的な工数見積もり*

### 選択肢B：Skills化（個人〜チーム）- 実測例

CLI実装 → Skill化 → テスト
└──────── 数時間〜1日 ────────┘

*※プロジェクトの複雑性により変動。Supabaseプロジェクトでは約8時間（1日）の実測例あり*

### 削減効果の比較

項目

選択肢A（アプリ化）※一般的見積

選択肢B（Skills化）※実測例

削減内容

**開発時間**

128-192時間

数時間〜1日

**UI開発をスキップ**

**工数**

16-24人日

0.5-1人日

**大幅削減**

フロントエンド開発

7-10日

**0日**

**スキップ**

UI設計

3-5日

**0日**

**スキップ**

運用開始

16-24日後

**即日〜1日**

**迅速な立ち上げ**

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/part1-before-after-comparison.svg)

**削減の理由:**

-   ✅ React等のフロントエンド開発をスキップ
-   ✅ デザインシステム構築が不要
-   ✅ UX設計・テストが不要
-   ✅ Claude Codeが「人間が使うUI」として機能

**得られた柔軟性:**

-   🔄 ビジネスロジックだけを変更できる（UIの再設計不要）
-   🔄 小さい単位で試行錯誤できる
-   🔄 使いながら要件を整理できる

**重要:** この削減は「AIツールによる開発速度向上」ではなく、**「UI開発というアプローチ自体を変えたこと」**による効果です。

フロントエンド開発をスキップして、短時間で運用開始できるんです。そして、後から自由に改善できる柔軟性も手に入れました。

## 汎用性：公式MCPを補完する展開

この汎用パターンの最大の価値は、**公式MCPが存在するサービスでも、カスタムビジネスロジックで補完できる**ことです。

### 補完パターンの適用例

**公開MCPが存在するサービス**（カスタムロジックで補完）:

-   **Supabase**: 基本CRUD（公式MCP）+ 重複検出・統計分析・整合性チェック（Skill）
-   **Firebase**: Firestore基本操作（公式MCP）+ 複数コレクション横断・セキュリティルール検証（Skill）
-   **GitHub**: Issue/PR操作（公式MCP）+ カスタムラベル付け・複数リポジトリ横断分析（Skill）
-   **Slack**: メッセージ送信（公式MCP）+ メッセージ集計分析・カスタム通知ロジック（Skill）

**公開MCPが存在しないサービス**（Skillで全て実装）:

-   社内API、レガシーシステム、管理ツール、独自開発サービス

**補完が必要な4つの理由**:

1.  カスタムビジネスロジック（公式MCPで提供されない独自処理）
2.  トークン最適化（MCP 55.7k消費を回避）
3.  セキュリティ要件（社内ネットワーク内でのみ動作）
4.  小さく検証（ビジネスロジック固まっていない段階での試行錯誤）

**参考**: [MCP Servers Directory](https://github.com/modelcontextprotocol/servers)で公式MCPサーバーの有無を確認できます

### 実装パターンは全て同じ

どのサービスでも：

1.  **公式SDK/APIをラップ** → 自作ServiceClient作成（ビジネスロジック実装）
2.  **CLI化** → 自作ClientをClick等でラップ
3.  **Skill登録** → Markdownで使い方定義

→ **Claude Codeから操作可能に**

**レイヤー構造の利点**:

-   **公式SDK**: サービス通信の実装を提供（変更不要）
-   **自作Client**: プロジェクト固有のビジネスロジックを実装
-   **CLI**: コマンドラインインターフェースを提供
-   **Skill**: Claude Codeとの統合を提供

フロントエンド開発をスキップしつつ、あらゆるサービスをClaude Code経由で操作できるようになります。しかも、自作Clientレイヤーでビジネスロジックをカプセル化できるため、柔軟性も高いです。これは、個人開発〜チームレベルの開発において、強力なアプローチです。

## まとめ

今回は、**公式MCPを補完するSkills活用パターン**を紹介しました。

### 核心的な発見

✅ **2025年版の判断フロー**:

1.  公式MCPで十分か確認 → 基本操作なら公式MCP使用（最も簡単）
2.  公式MCPで不十分な場合 → 本記事の補完パターン（Skillsで拡張）

✅ **3つの補完ユースケース**:

-   **カスタムビジネスロジック**: 重複検出、データ検証、複数テーブル統合
-   **トークン最適化**: MCP 55.7k (27.9%)消費を回避
-   **独自要件**: 社内システム、セキュリティ要件

✅ **汎用的な補完パターン**: 公式SDK → 自作Client → CLI → Skill の4層構造

✅ **レイヤーの役割**:

-   公式SDK: サービス通信を提供
-   自作Client: カスタムビジネスロジックをカプセル化（関数ベースのインターフェース等）
-   CLI: コマンドラインインターフェース提供
-   Skill: Claude Code統合、Progressive Disclosure（段階的開示）

✅ **実装例（Supabase）**: 公式MCP + 700行Skill、フロントエンド開発なし

-   公式MCP: 基本CRUD操作
-   Skill: find-duplicates、merge –dry-run、stats、validate等
-   実装時間: 数時間〜1日（実測例として参考）

✅ **Skillの優位性**:

-   Progressive Disclosure（段階的開示）により**トークン消費を大幅削減**（MCP: 55.7k vs Skill: 起動時は名前と説明のみ）
-   運用コスト $0（ローカル完結）
-   実装時間 数時間〜1日（自作MCP: 1-2日）

✅ **UI開発工数削減**: アプリ化（一般的見積: 128-192時間）→ Skills化（実測例: 数時間〜1日）

✅ **柔軟性**: UIがないので、ビジネスロジックだけを小さく検証・変更できる

### 既存ブログとの違い

以前書いた[Claude Code Skills 実装ガイド](https://tech-lab.sios.jp/archives/50154)では、「**Skillの作り方（How to）**」を解説しました。

今回は、**「公式MCPを補完する汎用パターン（What you can achieve）」**と**「Skillに至った経緯（Why & 判断プロセス）」**を中心に語りました。

### 今すぐできること

1.  **実装したいカスタムビジネスロジックを明確にする**: 重複検出、データ検証、複数テーブル統合、統計分析…等
2.  **公式MCPサーバーの有無と機能を確認**:
    -   [MCP Servers Directory](https://github.com/modelcontextprotocol/servers)で検索
    -   **公式MCPで十分** → 公式MCP使用（最も簡単）
    -   **公式MCPで不十分** → 次のステップへ（カスタムロジック補完）
    -   **MCPがない** → 次のステップへ（全て実装）
3.  **SDK/APIを確認**: 対象サービスのPython SDK、REST APIドキュメントをチェック
4.  **4層構造で実装**（数時間〜1日目安）:
    -   **公式SDK**: 既存のライブラリを利用（Supabase SDK、firebase-admin等）
    -   **自作Client**: 公式SDKをラップしてカスタムビジネスロジック実装
    -   **CLI**: 自作ClientをClickでラップ
    -   **Skill**: Markdownで使い方定義（Progressive Disclosure対応）
5.  **公式MCP vs 自作MCP vs Skillで迷っている人**: この記事の判断フローを参考に
6.  **フロントエンド開発を避けたい人**: Skills化で即座に運用開始

**この汎用パターンを覚えておけば、公式MCPを補完し、カスタムビジネスロジックをClaude Codeと統合できます。**

皆さんも、実装したいカスタムロジックがあったら、まず公式MCPサーバーの有無と機能を確認し、不十分ならこの補完パターンを試してみてください！

## 参考リンク

### 公式ドキュメント

-   [Claude Code 公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/overview)
-   [MCP (Model Context Protocol) 公式ドキュメント](https://modelcontextprotocol.io/)
-   [MCP Servers Directory](https://github.com/modelcontextprotocol/servers) – 公式MCPサーバー一覧
-   [Anthropic Skills 公式発表](https://www.anthropic.com/news/skills)
-   [Supabase 公式ドキュメント](https://supabase.com/docs)
-   [Supabase MCP Server](https://mcp.supabase.com/mcp)
-   [Python Click 公式ドキュメント](https://click.palletsprojects.com/) – CLIツール作成ライブラリ
-   [uv 公式ドキュメント](https://docs.astral.sh/uv/) – Pythonパッケージマネージャー

### 関連ブログ

-   **[Claude Code Skills 実装ガイド：ローカルツールをスムーズに統合する方法](https://tech-lab.sios.jp/archives/50154)**
    -   本記事で説明した「Skill化」の詳細実装方法
    -   Skillファイルの構造、YAML frontmatter、ベストプラクティス
-   **[【2025年版】検証 → 記事化で知見を資産化！Claude Code×RAGもどきでAI技術ブログ執筆を効率化](https://tech-lab.sios.jp/archives/50103)**
    -   「RAGもどき」のアイデアの原点
    -   Claude Codeを活用したブログ執筆ワークフロー
-   **[AI協業開発環境の構築術｜モノレポでビルド時間を大幅短縮するCLAUDE.md活用法](https://tech-lab.sios.jp/archives/50109)**
    -   開発環境のセットアップ（モノレポ、uv、devcontainer）
    -   本記事のプロジェクト構成の基礎

質問や感想は、コメント欄でお待ちしております！

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-50214)[役に立たなかった](#afb-post-50214)  
  
0人がこの投稿は役に立ったと言っています。