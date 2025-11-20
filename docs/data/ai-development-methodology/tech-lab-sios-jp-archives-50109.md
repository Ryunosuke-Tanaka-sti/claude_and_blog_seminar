---
title: "AI 協業開発環境の構築術｜モノレポでビルド時間を大幅短縮する CLAUDE.md 活用法"
url: https://tech-lab.sios.jp/archives/50109
image: https://tech-lab.sios.jp/wp-content/uploads/2025/11/286bcfe4e35ab99f122815f78e7c323e.png
extracted_at: 2025-11-19T12:49:13.051Z
---

# AI 協業開発環境の構築術｜モノレポでビルド時間を大幅短縮する CLAUDE.md 活用法

**目次**

-   [1はじめに](#hajimeni)
    -   [1.1記事の位置づけ](#ji_shino_wei_zhidzuke)
-   [2この記事で学べること](#kono_ji_shide_xueberukoto)
    -   [2.1🎯 主要なポイント](#zhu_yaonapointo)
    -   [2.2💡 実践的なテクニック](#shi_jian_denatekunikku)
-   [3前提条件](#qian_ti_tiao_jian)
    -   [3.1前提知識（あると望ましい）](#qian_ti_zhi_shi_aruto_wangmashii)
    -   [3.2本記事で扱わないこと](#ben_ji_shide_xiwanaikoto)
-   [4プロジェクト全体像](#purojekuto_quan_ti_xiang)
    -   [4.1モノレポ構成の 4 つのアプリケーション](#monorepo_gou_chengno_4_tsunoapurikeshon)
    -   [4.2ディレクトリ構造の全体像](#direkutori_gou_zaono_quan_ti_xiang)
    -   [4.3システム構成図](#shisutemu_gou_cheng_tu)
    -   [4.4なぜモノレポなのか？](#nazemonoreponanoka)
        -   [4.4.1✅ モノレポのメリット](#monoreponomeritto)
    -   [4.5AI 協業開発を支える設計思想](#AI_xie_ye_kai_fawo_zhieru_she_ji_si_xiang)
        -   [4.5.11\. 計画と実装の分離](#1_ji_huato_shi_zhuangno_fen_li)
        -   [4.5.22\. CLAUDE.md 階層構造](#2_CLAUDEmd_jie_ceng_gou_zao)
        -   [4.5.33\. Single Source of Truth（型安全パイプライン）](#3_Single_Source_of_Truth_xing_an_quanpaipurain)
-   [5CLAUDE.md 階層構造の設計](#CLAUDEmd_jie_ceng_gou_zaono_she_ji)
    -   [5.1CLAUDE.md とは？](#CLAUDEmd_toha)
    -   [5.29 つの CLAUDE.md ファイル](#9_tsuno_CLAUDEmd_fairu)
    -   [5.3コンテキスト継承パターン](#kontekisuto_ji_chengpatan)
    -   [5.4ルート CLAUDE.md の重要性](#ruto_CLAUDEmd_no_zhong_yao_xing)
        -   [5.4.1記載内容の例](#ji_zai_nei_rongno_li)
    -   [5.5CLAUDE.md 階層構造の効果](#CLAUDEmd_jie_ceng_gou_zaono_xiao_guo)
-   [6ドキュメント駆動型開発の実践（3 フェーズ →4 フェーズへの進化）](#dokyumento_qu_dong_xing_kai_fano_shi_jian_3_fezu_4_fezuheno_jin_hua)
    -   [6.13 フェーズ開発から 4 フェーズ開発への進化](#3_fezu_kai_fakara_4_fezu_kai_faheno_jin_hua)
    -   [6.2各フェーズの概要](#gefezuno_gai_yao)
        -   [6.2.1フェーズ 1: 計画 (/docs/features/)](#fezu_1_ji_hua_docsfeatures)
        -   [6.2.2フェーズ 2: 実装 (/application/)](#fezu_2_shi_zhuang_application)
        -   [6.2.3フェーズ 3: 研究記録 (/docs/research/)](#fezu_3_yan_jiu_ji_lu_docsresearch)
        -   [6.2.4フェーズ 4: 記事化 (/docs/article/)](#fezu_4_ji_shi_hua_docsarticle)
    -   [6.3このワークフローの効果](#konowakufurono_xiao_guo)
-   [7型安全な API 開発パイプライン](#xing_an_quanna_API_kai_fapaipurain)
    -   [7.1Single Source of Truth の原則](#Single_Source_of_Truth_no_yuan_ze)
    -   [7.2型安全パイプラインの効果](#xing_an_quanpaipurainno_xiao_guo)
-   [8モノレポ CI/CD パイプライン: paths フィルタの威力](#monorepo_CICD_paipurain_paths_firutano_wei_li)
    -   [8.14 つの独立したワークフロー](#4_tsuno_du_lishitawakufuro)
    -   [8.2paths フィルタによる最適化](#paths_firutaniyoru_zui_shi_hua)
        -   [8.2.1例: Frontend SWA Deploy](#li_Frontend_SWA_Deploy)
        -   [8.2.2Before/After 比較](#BeforeAfter_bi_jiao)
    -   [8.3並行デプロイの実現](#bing_xingdepuroino_shi_xian)
    -   [8.4CI/CD パイプラインの効果](#CICD_paipurainno_xiao_guo)
-   [9開発体験の変化（Before/After）](#kai_fa_ti_yanno_bian_hua_BeforeAfter)
    -   [9.1Before（モノレポ ×AI 環境導入前）](#Beforemonorepo_AI_huan_jing_dao_ru_qian)
        -   [9.1.1問題点](#wen_ti_dian)
    -   [9.2After（モノレポ ×AI 環境導入後）](#Aftermonorepo_AI_huan_jing_dao_ru_hou)
        -   [9.2.1改善点](#gai_shan_dian)
    -   [9.3定量的な効果](#ding_liang_dena_xiao_guo)
    -   [9.4龍ちゃんの所感](#longchanno_suo_gan)
-   [10まとめ](#matome)
    -   [10.1モノレポ ×AI 協業開発環境のポイント](#monorepo_AI_xie_ye_kai_fa_huan_jingnopointo)
    -   [10.2開発体験の変化](#kai_fa_ti_yanno_bian_hua)
    -   [10.3次のステップ](#cinosuteppu)
        -   [10.3.11\. CLAUDE.md を作成](#1_CLAUDEmd_wo_zuo_cheng)
        -   [10.3.22\. paths フィルタを導入](#2_paths_firutawo_dao_ru)
        -   [10.3.33\. 4 フェーズワークフローを実践](#3_4_fezuwakufurowo_shi_jian)
-   [11参考リンク](#can_kaorinku)
    -   [11.1関連記事（本サイト）](#guan_lian_ji_shi_bensaito)
        -   [11.1.1AI 協業開発手法シリーズ](#AI_xie_ye_kai_fa_shou_fashirizu)
        -   [11.1.2型安全パイプライン](#xing_an_quanpaipurain)
    -   [11.2公式ドキュメント](#gong_shidokyumento)

## はじめに

ども！最近は Claude Code ともに開発を進めて、with AI での生活にどっぷりだったのですが 2025 年も締めということで貯まった検証を一気に記事化している龍ちゃんです。検証がたまっていたので、11 月と 12 月は大量にブログを書く羽目になりそうですね。ゴリゴリ執筆する必要がありますね！

皆さん、AI（Claude Code 等）と一緒に開発してると、こんな悩みありませんか？

-   **「このプロジェクト、どういう構成になってるの？」と AI に毎回説明するのが面倒**
-   **ファイルが多すぎて AI が混乱して、的外れな提案をしてくる**
-   **モノレポにしたけど、全部のアプリが毎回ビルドされて時間がかかる**

僕も以前はこれらの課題に悩まされていました。特に、**プロジェクトが大きくなるほど、AI が全体像を把握しづらくなる**という問題が深刻でした。

そこで構築したのが、**CLAUDE.md 階層構造**を核としたモノレポ環境です。この環境により、以下の成果を得られました：

✅ **AI が自律的にプロジェクト構成を理解**（CLAUDE.md 階層構造）  
✅ **CI/CD ビルド時間 58%削減**（paths フィルタによる最適化）  
✅ **ドキュメントが自然に蓄積**（4 フェーズワークフロー: 計画 → 実装 → 研究記録 → 記事化）

**本記事で紹介する環境は、実際に稼働中のシステムで実践している内容です。** このモノレポで開発しているシステムの詳細については、[AI チャットで話すだけ!X 予約投稿を完全自動化するシステム構築術](https://tech-lab.sios.jp/archives/49981)で解説しています（リポジトリは非公開）。

この記事では、**モノレポ構成と AI 協業開発を最適化する環境設計**について、実際のプロジェクト構成とワークフローを交えながら解説していきます。

### 記事の位置づけ

**前提となる知識（先に読むべき記事）**:

本記事で紹介する 4 フェーズワークフローは、以下の記事で解説した 3 フェーズ開発を基盤に構築されています：

-   **3 フェーズ開発の基本を学ぶ**: [Claude Code 革命！3 フェーズ開発で効率的な開発：計画 → 実装 → 検証術](https://tech-lab.sios.jp/archives/49140)
    -   計画 → 実装 → 検証の 3 フェーズワークフロー
    -   /docs/ と /application/ のディレクトリ分離
    -   小規模システムを 30 分で実装する実例
-   **計画フェーズの詳細を学ぶ**: [AI 協働で仕様書アレルギー克服！開発時間を 1 週間 →2 日に短縮する実践法](https://tech-lab.sios.jp/archives/49148)
    -   CLAUDE.md による仕様書作成ルール
    -   AI との協働レビュープロセス
    -   開発時間を 1 週間 →2 日に短縮した実践法
-   **4 フェーズへの拡張を学ぶ**: [検証 → 記事化で知見を資産化！Claude Code×RAG もどきで AI 技術ブログ執筆を効率化](https://tech-lab.sios.jp/archives/50103)
    -   フェーズ 4（記事化）の追加による知見の資産化
    -   RAG もどきシステムでトークン数 50-60%削減
    -   文体補正システムで一貫した記事品質を実現
    -   記事執筆時間 50%削減、重複チェック 83%削減

**技術基盤**:

-   **型安全な API 開発を学ぶ**: [AI と爆速開発！Next.js×Nest.js 型定義同期の自動生成パイプライン構築術](https://tech-lab.sios.jp/archives/49157)
    -   Backend DTOs → OpenAPI → Frontend Types の自動生成
    -   Single Source of Truth による型ズレゼロの実現

## この記事で学べること

この記事を読むことで、以下の知識とスキルが得られます：

### 🎯 主要なポイント

1.  **モノレポ構成と AI 協業開発の相性**  
    なぜモノレポが AI 協業に適しているのか、実体験をもとに解説
2.  **CLAUDE.md 階層構造によるコンテキスト管理**  
    9 つの CLAUDE.md ファイルで AI に適切な情報を提供する設計
3.  **paths フィルタによる CI/CD 最適化**  
    変更されたアプリのみビルドすることでビルド時間 58%削減
4.  **4 フェーズワークフローによる知見の資産化**  
    計画 → 実装 → 研究記録 → 記事化のドキュメント駆動型開発

### 💡 実践的なテクニック

-   AI が理解しやすいディレクトリ構造と命名規則
-   GitHub Actions paths フィルタの活用
-   ドキュメント駆動型開発による知見の蓄積

## 前提条件

この記事は、**モノレポ構成と AI 協業開発環境の設計・アーキテクチャ**に焦点を当てています。

### 前提知識（あると望ましい）

-   **AI 開発ツールの使用経験**
    -   Claude Code、GitHub Copilot、Cursor 等の AI 開発支援ツールを使った開発経験
    -   AI にプロンプトを投げてコードを生成した経験
-   **モノレポの基礎知識**
    -   複数のアプリケーションを 1 つのリポジトリで管理する概念の理解
    -   （初めての方でも、記事を読み進めることで理解できます）

### 本記事で扱わないこと

❌ モノレポツール（Turborepo、Nx 等）の詳細比較  
❌ Azure 環境の詳細なセットアップ手順  
❌ 各フレームワーク（NestJS、Next.js 等）の実装詳細  
❌ 型安全パイプラインの実装詳細（[型安全パイプラインの記事](https://tech-lab.sios.jp/archives/49157)で解説）

**※本記事は構成と設計に焦点を当てており、実装の詳細は関連記事で解説しています。**

## プロジェクト全体像

まずは、実際のプロジェクト構成を見ていきましょう。

### モノレポ構成の 4 つのアプリケーション

このプロジェクトは、**4 つの独立したアプリケーション**をモノレポで管理しています。

アプリケーション

技術スタック

デプロイ先

GitHub Actions

**Frontend**

Next.js 15, React 19, TypeScript 5

Azure Static Web Apps

`frontend-swa-deploy.yml`

**Backend**

NestJS 11, Node.js 22, TypeScript 5

Azure Web Apps (Docker)

`backend-docker-build.yml`

**X Scheduler Functions**

Azure Functions v4, Node.js 22, TypeScript

Azure Functions

`deploy-x-scheduler-functions.yml`

**Blog Search MCP Functions**

Azure Functions v4, Node.js 22, MCP Protocol

Azure Functions

`deploy-blog-search-mcp-functions.yml`

### ディレクトリ構造の全体像

```
プロジェクトルート/
├── docs/                    # 計画・設計フェーズ（実装コードなし）
│   ├── CLAUDE.md            # 計画フェーズガイドライン
│   ├── project-core.md      # インフラ全体構成
│   ├── features/            # 新機能開発計画
│   ├── bugs/                # バグ調査・修正計画
│   ├── research/            # 実装検証結果・知見
│   ├── article/             # ブログ記事執筆用調査
│   │   └── CLAUDE.md        # 記事執筆ガイド
│   ├── tools/               # Docs専用ツール
│   │   └── CLAUDE.md        # ツール使用ガイド
│   └── api/                 # OpenAPI仕様
├── application/             # 実装フェーズ
│   ├── backend/             # NestJS APIサーバー
│   │   └── CLAUDE.md        # バックエンド開発ガイド
│   ├── frontend/            # Next.js フロントエンド
│   │   └── CLAUDE.md        # フロントエンド開発ガイド
│   ├── functions/           # X Scheduler
│   │   └── CLAUDE.md        # Functions開発ガイド
│   └── blog-search-mcp-functions/  # MCP Server
│       └── CLAUDE.md        # MCP Functions開発ガイド
├── infrastructure/          # IaCテンプレート
│   └── CLAUDE.md            # インフラ開発ガイド
├── CLAUDE.md                # ルートガイドライン（全体像）
└── .github/
    └── workflows/           # CI/CDパイプライン
        ├── frontend-swa-deploy.yml
        ├── backend-docker-build.yml
        ├── deploy-x-scheduler-functions.yml
        └── deploy-blog-search-mcp-functions.yml
```

### システム構成図

モノレポ全体の構成を視覚化するとこうなります：

![image](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/11/26f0c86218c7d1aa926995a496998cab.png?resize=880%2C495&ssl=1)

### なぜモノレポなのか？

モノレポ構成を採用した理由は、**AI 協業開発との相性の良さ**にあります。

#### ✅ モノレポのメリット

**1\. AI に 1 つのリポジトリで全体像を提供**

別リポジトリにすると、AI は各リポジトリのコンテキストを個別に理解する必要があります。モノレポなら、**ルートの CLAUDE.md で全体像を一度に提供**できます。

```
# 別リポジトリの場合（AIが混乱）
frontend-repo/ ← AIはこのリポジトリのコンテキストのみ
backend-repo/  ← 別のセッションで別のコンテキスト
functions-repo/ ← また別のコンテキスト

# モノレポの場合（AIが全体を把握）
monorepo/
├── CLAUDE.md ← 全体像をAIに提供
├── application/
│   ├── frontend/
│   ├── backend/
│   └── functions/
```

**2\. ディレクトリ構造の一貫性**

すべてのアプリケーションが同じルールに従うため、AI が理解しやすくなります。

```
# すべてのアプリケーションにそれぞれのCLAUDE.mdがある
/application/backend/CLAUDE.md
/application/frontend/CLAUDE.md
/application/functions/CLAUDE.md
/application/blog-search-mcp-functions/CLAUDE.md
```

**3\. コード共有が容易**

共通ライブラリ、型定義、ユーティリティ関数を複数のアプリで共有できます。

### AI 協業開発を支える設計思想

このモノレポ環境には、3 つの核となる設計思想があります。

#### 1\. 計画と実装の分離

`/docs/`（設計・仕様）と`/application/`（実装コード）を明確に分離しています。

**目的**:

-   AI に「計画フェーズ」と「実装フェーズ」を明確に区別させる
-   実装前に設計を固めることで、手戻りを減らす

```
/docs/features/my-new-feature/
├── README.md           # 機能概要
├── api-spec.md         # API設計（実装コードなし）
└── type-definition.md  # 型定義（実装コードなし）

/application/backend/src/my-new-feature/
├── my-new-feature.controller.ts  # 実装コード
├── my-new-feature.service.ts     # 実装コード
└── dto/                          # 実装された型定義
```

#### 2\. CLAUDE.md 階層構造

ルートで全体像、サブディレクトリで詳細ルールを提供します。

**目的**:

-   AI が必要な粒度でコンテキストを取得できる
-   各領域の専門的なルールを明確にする

```
/CLAUDE.md ← プロジェクト全体像
  ↓
/docs/CLAUDE.md ← 計画フェーズのルール
  ↓
/application/backend/CLAUDE.md ← バックエンド実装の詳細ルール
```

#### 3\. Single Source of Truth（型安全パイプライン）

Backend DTOs を唯一の真実とし、Frontend の型定義は自動生成します。

**詳細**: [AI と爆速開発！Next.js×Nest.js 型定義同期の自動生成パイプライン構築術](https://tech-lab.sios.jp/archives/49157)を参照

```
Backend DTOs (@ApiProperty)
  ↓
OpenAPI 仕様生成 (generate:openapi)
  ↓
Frontend 型定義生成 (generate:api with Orval)
  ↓
型安全なAPI呼び出し
```

これら 3 つの設計思想により、**AI との協業開発が劇的にスムーズ**になりました。

## CLAUDE.md 階層構造の設計

ここからは、AI 協業開発の核となる**CLAUDE.md 階層構造**について詳しく解説します。

### CLAUDE.md とは？

**CLAUDE.md**は、AI（Claude Code）にプロジェクトのコンテキストを提供するドキュメントです。

従来、AI に「このプロジェクトはどういう構成？」「どのルールに従えばいい？」と聞かれるたびに、手動で説明する必要がありました。CLAUDE.md を配置することで、**AI が自律的にガイドラインを読み、適切な判断をする**ようになります。

### 9 つの CLAUDE.md ファイル

このプロジェクトには、**合計 9 つの CLAUDE.md ファイル**が配置されています。

```
# すべてのCLAUDE.mdファイルを確認
$ find . -maxdepth 3 -name "CLAUDE.md" | sort

./CLAUDE.md
./application/backend/CLAUDE.md
./application/blog-search-mcp-functions/CLAUDE.md
./application/frontend/CLAUDE.md
./application/functions/CLAUDE.md
./docs/article/CLAUDE.md
./docs/CLAUDE.md
./docs/tools/CLAUDE.md
./infrastructure/CLAUDE.md
```

**各 CLAUDE.md の役割**:

ファイルパス

役割

主な内容

`/CLAUDE.md`

**ルートガイドライン**

プロジェクト全体像、ディレクトリ構造、4 フェーズワークフロー、共通開発コマンド

`/docs/CLAUDE.md`

**計画フェーズルール**

型定義、API 設計、データベース設計のルール（実装コード禁止）

`/docs/article/CLAUDE.md`

**記事執筆ガイド**

ブログ記事執筆の文体、構成、ドキュメント構造

`/docs/tools/CLAUDE.md`

**ツール使用ガイド**

Docs 専用ツール（ブログ HTML 抽出等）の使用方法

`/application/backend/CLAUDE.md`

**バックエンド開発ガイド**

NestJS 開発ルール、環境変数管理、テスト実行方法

`/application/frontend/CLAUDE.md`

**フロントエンド開発ガイド**

Next.js 開発ルール、インポートパス規則

`/application/functions/CLAUDE.md`

**X Scheduler 開発ガイド**

Azure Functions 開発ルール、Timer Trigger 設定

`/application/blog-search-mcp-functions/CLAUDE.md`

**MCP Functions 開発ガイド**

MCP Server 開発ルール、Supabase 連携

`/infrastructure/CLAUDE.md`

**インフラ開発ガイド**

Azure Bicep 開発ルール、デプロイ手順

### コンテキスト継承パターン

CLAUDE.md は、**階層的にコンテキストを継承**します。

![image](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/11/b7c22fa6963e7ee1943ea6da10fad98d.jpg?resize=880%2C585&ssl=1)

**継承の例**:

1.  **ルート CLAUDE.md**を読む → プロジェクト全体構成を理解
2.  **サブディレクトリの CLAUDE.md**を読む → 各領域の詳細ルールを理解
3.  AI が適切な判断を下す

**実際の動き**:

```
AI: 「ユーザーがフロントエンドの開発を依頼してきた」
↓
AI: 「まず /CLAUDE.md を読んで全体像を把握しよう」
↓
AI: 「次に /application/frontend/CLAUDE.md を読んで詳細ルールを確認」
↓
AI: 「インポートパスは @/* を使うべきだな」
AI: 「API型定義は自動生成されるから、手動で書いちゃダメだな」
↓
AI: 適切なコードを提案
```

### ルート CLAUDE.md の重要性

**ルート CLAUDE.md**（`/CLAUDE.md`）は、最も重要なドキュメントです。

#### 記載内容の例

```
# CLAUDE.md

## Project Architecture Overview

LINE LIFF AI Prompt Battle - An AI-powered game platform...

### Directory Structure & Responsibilities

/
├── docs/ # Planning & Design Phase
│ ├── features/ # Feature specifications
│ ├── bugs/ # Bug investigation & fix plans
│ ├── research/ # Implementation validation
│ └── article/ # Blog article research
├── application/
│ ├── backend/ # NestJS 11 API Server
│ ├── frontend/ # Next.js 15 App Router
│ ├── functions/ # Azure Functions
│ └── blog-search-mcp-functions/ # MCP Server
└── infrastructure/ # Azure Bicep IaC

**Workflow Pattern (4-Phase Workflow)**:

1. **計画フェーズ** - Plan in `/docs/`
2. **実装フェーズ** - Implement in `/application/`
3. **研究記録フェーズ** - Document findings in `/docs/research/`
4. **記事化フェーズ** - Gather materials in `/docs/article/`

## Common Development Commands

### Backend (NestJS)

npm run start:dev # Development with watch mode
npm run generate:openapi # Generate OpenAPI spec

### Frontend (Next.js)

npm run generate:api # Generate types from OpenAPI
npm run dev:full # generate:api + dev server

## Critical Import Path Rules

### Frontend: Use `@/*` Path Aliases

// ✅ CORRECT
import { Button } from '@/components/ui/button';

// ❌ WRONG
import { Button } from '../components/ui/button';
```

**ポイント**:

-   **プロジェクト全体構成**を一目で理解できる
-   **4 フェーズワークフロー**を明記
-   **共通開発コマンド**を記載
-   **インポートパス規則**等の重要ルールを記載

**※注**: 上記コード例は、実際のプロジェクト CLAUDE.md での記載例です。本記事では「4 フェーズワークフロー」または「ドキュメント駆動型開発」と呼称しています。

このルート CLAUDE.md があることで、AI は**初めてプロジェクトに触れた時でも、全体像を即座に理解**できます。

### CLAUDE.md 階層構造の効果

この階層構造により、以下の効果が得られました：

✅ **AI の理解速度が向上**  
ルート CLAUDE.md で全体像を把握し、サブディレクトリで詳細を理解

✅ **一貫性のあるコード生成**  
すべての開発者（人間も AI も）が同じルールに従う

✅ **手動説明の削減**  
「どういうプロジェクト？」と聞かれることがなくなった

✅ **オンボーディング時間の短縮**  
新しい AI セッション、新しい開発者が即座に理解できる

## ドキュメント駆動型開発の実践（3 フェーズ →4 フェーズへの進化）

Claude Code での開発を効率化するため、**計画 → 実装 → 研究記録 → 記事化の 4 フェーズワークフロー**を構築しました。

### 3 フェーズ開発から 4 フェーズ開発への進化

このワークフローは、**既存の 3 フェーズ開発を基盤に構築**されています：

**元々の 3 フェーズ開発**（[計画 → 実装 → 検証術](https://tech-lab.sios.jp/archives/49140)、[仕様書アレルギー克服](https://tech-lab.sios.jp/archives/49148)で解説）:

1.  **計画**: `/docs/` で仕様策定（実装コードは書かない）
2.  **実装**: `/application/` で実装
3.  **検証**: 計画と実装の差異を分析

**4 フェーズへの拡張**（[知見を資産化する記事](https://tech-lab.sios.jp/archives/50103)で詳細解説）:

-   **フェーズ 3 を「研究記録」として体系化**: 検証フェーズで得た知見を `/docs/research/` に記録
-   **フェーズ 4「記事化」を追加**: 研究記録を元に `/docs/article/` で記事執筆
-   **RAG もどきシステム**: 既存記事参照でトークン数 50-60%削減
-   **文体補正システム**: 一貫した記事品質を実現

![image](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/11/820942403bb694d3f8954c296e61935d-1.png?resize=880%2C280&ssl=1)

### 各フェーズの概要

#### フェーズ 1: 計画 (`/docs/features/`)

**目的**: 実装前の設計・仕様策定（実装コードは一切書かない）

**成果物**: 型定義、API 設計、データベース構造、アーキテクチャ設計

**効果**: 開発時間 1 週間 →2 日に短縮（[仕様書アレルギー克服の記事](https://tech-lab.sios.jp/archives/49148)で詳細解説）

**重要ルール**: CLAUDE.md で実装コード記述を禁止することで、AI が設計に集中

#### フェーズ 2: 実装 (`/application/`)

**目的**: 計画に基づいた実装

**実装順序**: Backend → Frontend → Functions

**効果**: 小規模システムで 30 分、中規模で 2 日程度（[3 フェーズ開発の記事](https://tech-lab.sios.jp/archives/49140)で実例紹介）

#### フェーズ 3: 研究記録 (`/docs/research/`)

**目的**: 実装完了後の知見・アーキテクチャ検証結果をドキュメント化

**記載内容**: 設計思想、アーキテクチャパターン、検証結果

**重要性**: 計画と実装の差異を分析し、仕様漏れを特定

**※補足**: [3 フェーズ開発の記事](https://tech-lab.sios.jp/archives/49140)で「検証フェーズ」として解説している内容を、このプロジェクトでは「研究記録フェーズ」として体系化しています。実装完了後に計画と実装の差異を分析し、知見として記録します。

#### フェーズ 4: 記事化 (`/docs/article/`)

**目的**: 技術ブログ執筆に必要な情報収集・調査、**知見の資産化**

**成果物**: `research-doc.md`（調査資料）、`no1-article.md`（記事本文）

**参照元**: `/docs/features/` + `/docs/research/` + `/application/`

**効率化ツール**（[知見を資産化する記事](https://tech-lab.sios.jp/archives/50103)で詳細解説）:

-   **RAG もどき**（fetch-blog-html.ts）: 既存記事参照でトークン数 50-60%削減
-   **文体補正**（writing-style-prompt.md）: 一貫した記事品質
-   **記事執筆時間 50%削減**: 調査資料から記事執筆までの自動化
-   **重複チェック 83%削減**: 既存記事との重複を自動検出

### このワークフローの効果

✅ **知見が自然に蓄積** – 実装と同時にドキュメントが作成される

✅ **記事化がスムーズ** – 計画 → 検証 → 実装コードを参照するだけ

✅ **手戻りが減少** – 計画フェーズで設計を固めることで、実装時の手戻りが減少

-   開発時間 1 週間 →2 日に短縮（計画フェーズの効果）

✅ **AI との協業が効率化** – 各フェーズで AI に明確な役割を与えられる

✅ **知見が資産化される** – フェーズ 4（記事化）により、開発知見が再利用可能なブログ記事として蓄積

-   既存記事との重複チェック 83%削減
-   技術ブログのライブラリが自然に形成される

## 型安全な API 開発パイプライン

Frontend と Backend の型ズレをゼロにする**型安全パイプライン**については、別記事で詳しく解説しています。

**詳細を学ぶ**: [AI と爆速開発！Next.js×Nest.js 型定義同期の自動生成パイプライン構築術](https://tech-lab.sios.jp/archives/49157)

### Single Source of Truth の原則

このプロジェクトでは、**Backend DTOs を唯一の真実**としています。

Frontend の型定義は、Backend から自動生成するため、**手動で型定義を同期する作業が不要**になります。

![image](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/11/2e261226e6375291d1a9ae30a0d90f86.png?resize=880%2C214&ssl=1)

### 型安全パイプラインの効果

✅ **型ズレゼロ** – Backend と Frontend の型が常に一致  
✅ **手動同期作業の撲滅** – 型定義を手動でコピー＆ペーストする必要がない  
✅ **リファクタリング時の安全性** – Backend の型を変更すると、Frontend でコンパイルエラーが出る  
✅ **開発速度向上** – 型定義を書く時間が不要になり、実装に集中できる

## モノレポ CI/CD パイプライン: paths フィルタの威力

次に、4 つのアプリケーションを並行デプロイする**最適化された CI/CD パイプライン**について解説します。

### 4 つの独立したワークフロー

このプロジェクトでは、**4 つの独立した GitHub Actions ワークフロー**を使用しています。

ワークフロー

トリガーパス

デプロイ先

ビルド時間（平均）

`frontend-swa-deploy.yml`

`application/frontend/**`

Azure Static Web Apps

3 分

`backend-docker-build.yml`

`application/backend/**`

GitHub Container Registry → Azure Web Apps

5 分

`deploy-x-scheduler-functions.yml`

`application/functions/**`

Azure Functions (X Scheduler)

2 分

`deploy-blog-search-mcp-functions.yml`

`application/blog-search-mcp-functions/**`

Azure Functions (MCP Server)

2 分

### paths フィルタによる最適化

**課題**: モノレポ全体をビルドすると、変更のないアプリもビルドされ時間がかかる

**解決策**: GitHub Actions の `paths` フィルタで、変更されたディレクトリのみをトリガー

#### 例: Frontend SWA Deploy

```
# .github/workflows/frontend-swa-deploy.yml
name: Frontend SWA Deploy

on:
  push:
    branches:
      - main
    paths:
      - "application/frontend/**"
      - ".github/workflows/frontend-swa-deploy.yml"
  workflow_dispatch:
```

**ポイント**:

-   `paths` フィルタで `application/frontend/**` のみをトリガー
-   Backend を変更しても、Frontend のワークフローは実行されない

#### Before/After 比較

**Before（paths フィルタなし）**

```
Backend を変更
↓
全ワークフロー実行（Frontend, Backend, Functions, MCP Functions）
↓
合計ビルド時間: 12分（3 + 5 + 2 + 2）
```

**After（paths フィルタあり）**

```
Backend を変更
↓
Backend ワークフローのみ実行
↓
合計ビルド時間: 5分（58%削減）
```

### 並行デプロイの実現

4 つのワークフローが**独立している**ため、複数のアプリを同時に変更した場合、**並行デプロイ**が実現されます。

```
Frontend と Backend を同時に変更
↓
frontend-swa-deploy.yml と backend-docker-build.yml が並行実行
↓
合計ビルド時間: 5分（逐次実行なら8分）
```

### CI/CD パイプラインの効果

✅ **ビルド時間 58%削減** – paths フィルタにより、変更のないアプリはビルドされない  
✅ **並行デプロイ** – 複数のアプリを同時に変更しても、並行実行で時間短縮  
✅ **安全なデプロイ** – 各アプリが独立しているため、Frontend のデプロイ失敗が Backend に影響しない

## 開発体験の変化（Before/After）

モノレポ ×AI 協業開発環境を導入する前後で、開発体験がどう変わったかを比較します。

### Before（モノレポ ×AI 環境導入前）

#### 問題点

❌ **AI に毎回プロジェクト構成を説明**

```
開発者: 「ユーザー管理機能を実装して」
AI: 「このプロジェクトはどういう構成ですか？」
開発者: 「Backendは...Frontendは...」（毎回説明）
```

❌ **CI/CD ビルド時間の増加**

```
Backend を変更
↓
全ワークフロー実行（Frontend, Backend, Functions）
↓
合計ビルド時間: 12分
```

❌ **ドキュメントが散らばって、どこに何があるかわからない**

```
計画ドキュメント: Notion
実装コメント: コード内
ブログ記事: 別リポジトリ

↓
情報が散らばって、どこに何があるかわからない
```

### After（モノレポ ×AI 環境導入後）

#### 改善点

✅ **AI が自律的にプロジェクト構成を理解**

```
開発者: 「ユーザー管理機能を実装して」
AI: 「/CLAUDE.md を確認します」
AI: 「/application/backend/CLAUDE.md を確認します」
AI: 「型安全パイプラインに従って実装します」
```

✅ **CI/CD ビルド時間 50%削減**

```
Backend を変更
↓
Backend ワークフローのみ実行（pathsフィルタ）
↓
合計ビルド時間: 5分（50%削減）
```

✅ **ドキュメントが自然に蓄積し、資産化される**

```
4フェーズワークフロー
計画 (/docs/features/)
  ↓
実装 (/application/)
  ↓
研究記録 (/docs/research/)
  ↓
記事化 (/docs/article/)
  ├─ RAGもどき（fetch-blog-html.ts）でトークン数50-60%削減
  └─ 文体補正（writing-style-prompt.md）で一貫した記事品質

↓
情報が整理され、知見が資産化される
技術ブログのライブラリが自然に形成される
```

### 定量的な効果

指標

Before

After

改善率

**初期説明時間**

10 分/セッション

ほぼ不要（CLAUDE.md で自律理解）

大幅削減

**CI/CD ビルド時間**

12 分

5 分

58%削減

**ドキュメントメンテナンス時間**

週 5 時間

週 2 時間

60%削減

**新機能開発スピード**

2 週間

1 週間

50%短縮

**記事執筆時間**

6-8 時間

3-4 時間

50%削減

**※測定条件**: 小規模〜中規模機能開発（バックエンド API エンドポイント 2-4 個、フロントエンド画面 1-2 個規模）での実測値です。プロジェクトの規模や複雑さによって効果は変動します。記事執筆時間は、調査資料作成から記事本文執筆までの合計時間です。

### 龍ちゃんの所感

**導入前の課題**:

プロジェクトが小さいうちは問題なかったんですが、いろんな検証を詰め込んでプロジェクトが大きくなってくると、**ドキュメントを編集するだけでビルドが走る**という問題が出てきました。適切にビルドを分割することで、不要な CI/CD の実行を抑える必要が出てきたんです。

また、フロントエンド・バックエンド・Functions（バッチ処理）という複数の構成でアプリを作っていたので、**API 連携やデータベース連携がスムーズに行える環境**が必要でした。例えば、バックエンドでデータベースに情報を入れて、それをバッチ処理で取得して実行するような連携ですね。

**AI 協業開発での気づき**:

AI と開発する上で、フロントエンドとバックエンドの型ズレを解消するためにも、**アプリケーション全体を AI に見える形で一つに集約する**ことがやはり大事だなと実感しました。これは自分の中でもすごく効果的でしたね。

**検証とブログ執筆の課題**:

自分の検証スタイルとして、「インプットを入れたらアウトプットを出す」というのが弊社の理念でもあり、このブログの意義でもあるので、検証とブログ執筆はセットで考えていました。

ただ、検証が終わった後に、別でブログを書くためのシステムを立ち上げて…というのが割と面倒になってきたんです。もう 3 年で 200 記事くらい書いているんですが、だんだん検証する内容も大きくなってきて、記事も長くなってきました。

**ソースコード参照の課題と解決策**:

記事を書く際に**ソースコードを参照することが増えて**きたんですが、参照するファイルが増えれば増えるほど、ブログを書く障壁がどんどん上がってきました。

そこで、**リポジトリから直接情報を吸い出してブログを書くシステム**（4 フェーズワークフロー、RAG もどき、文体補正）を構築したことで、ブログ執筆の効率化がさらに進んだと感じています（詳細は[検証 → 記事化で知見を資産化！Claude Code×RAG もどきで AI 技術ブログ執筆を効率化](https://tech-lab.sios.jp/archives/50103)を参照）。

## まとめ

この記事では、**モノレポ ×AI 協業開発環境**の構築術について解説しました。

### モノレポ ×AI 協業開発環境のポイント

✅ **CLAUDE.md 階層構造でコンテキスト管理**  
9 つの CLAUDE.md ファイルで、AI に適切な粒度の情報を提供

✅ **4 フェーズワークフロー（計画 → 実装 → 研究記録 → 記事化）**  
ドキュメント駆動型開発で、知見が自然に蓄積され、資産化される

-   3 フェーズ開発を基盤に、フェーズ 4（記事化）を追加
-   RAG もどき、文体補正による記事執筆効率化

✅ **型安全パイプライン（Backend DTOs → OpenAPI → Frontend Types）**  
Single Source of Truth で、型ズレゼロを実現（[型安全パイプラインの詳細記事](https://tech-lab.sios.jp/archives/49157)）

✅ **paths フィルタによる最適化 CI/CD**  
4 つの独立ワークフローで、ビルド時間 58%削減

### 開発体験の変化

Before

After

AI に毎回プロジェクト構成を説明

CLAUDE.md で自律的に理解

CI/CD ビルド時間 12 分

paths フィルタで 5 分（58%削減）

ドキュメントが散らばる

4 フェーズワークフローで自然に蓄積、資産化

記事執筆に時間がかかる

RAG もどき、文体補正で 50%削減

### 次のステップ

この記事を読んで、モノレポ ×AI 協業開発環境に興味を持った方は、以下のステップで実践してみてください：

#### 1\. CLAUDE.md を作成

まずは、プロジェクトルートに`CLAUDE.md`を作成し、プロジェクト全体像を記載します。

```
# CLAUDE.md

## Project Architecture Overview

（プロジェクトの概要）

### Directory Structure

（ディレクトリ構造）

## Workflow Pattern (4-Phase Workflow)

1. **計画フェーズ** - Plan in `/docs/`
2. **実装フェーズ** - Implement in `/application/`
3. **研究記録フェーズ** - Document findings in `/docs/research/`
4. **記事化フェーズ** - Gather materials in `/docs/article/`
```

#### 2\. paths フィルタを導入

GitHub Actions ワークフローに `paths` フィルタを追加します。

```
on:
  push:
    branches:
      - main
    paths:
      - "application/frontend/**"
```

#### 3\. 4 フェーズワークフローを実践

新機能開発時は、計画 → 実装 → 研究記録 → 記事化の 4 フェーズを順に進めます。

詳細は[3 フェーズ開発の基本を学ぶ記事](https://tech-lab.sios.jp/archives/49140)を参照してください。

## 参考リンク

### 関連記事（本サイト）

#### AI 協業開発手法シリーズ

-   [Claude Code 革命！3 フェーズ開発で効率的な開発：計画 → 実装 → 検証術](https://tech-lab.sios.jp/archives/49140)
-   [AI 協働で仕様書アレルギー克服！開発時間を 1 週間 →2 日に短縮する実践法](https://tech-lab.sios.jp/archives/49148)
-   [検証 → 記事化で知見を資産化！Claude Code×RAG もどきで AI 技術ブログ執筆を効率化](https://tech-lab.sios.jp/archives/50103)

#### 型安全パイプライン

-   [AI と爆速開発！Next.js×Nest.js 型定義同期の自動生成パイプライン構築術](https://tech-lab.sios.jp/archives/49157)

### 公式ドキュメント

-   [Claude Code 公式ドキュメント](https://docs.claude.com/en/docs/claude-code)
-   [NestJS 公式ドキュメント](https://docs.nestjs.com/)
-   [Next.js 公式ドキュメント](https://nextjs.org/docs)
-   [GitHub Actions 公式ドキュメント](https://docs.github.com/en/actions)
-   [Orval 公式ドキュメント](https://orval.dev/)

---

ここまで読んでいただき、ありがとうございました！

モノレポ ×AI 協業開発環境を構築することで、開発体験が劇的に向上します。ぜひ、この記事を参考に、あなたのプロジェクトでも実践してみてください。

質問や感想は、コメント欄でお待ちしております。また、Twitter のほうもよろしくお願いします！

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-50109)[役に立たなかった](#afb-post-50109)  
  
0人がこの投稿は役に立ったと言っています。