---
title: "Claude Codeの一時ファイルでビジネスロジック検証：UI不要で要件を発見する方法"
url: https://tech-lab.sios.jp/archives/50208
image: https://tech-lab.sios.jp/wp-content/uploads/2025/11/0ec5c302ede8a2cf435144c555a1d7a6.png
extracted_at: 2025-11-19T12:58:50.306Z
---

# Claude Codeの一時ファイルでビジネスロジック検証：UI不要で要件を発見する方法

**目次**

-   [1はじめに](#hajimeni)
-   [2TL;DR](#TLDR)
-   [3こんな人に読んでほしい](#konna_renni_dundehoshii)
-   [4従来のUI先行開発の問題](#cong_lainoUI_xian_xing_kai_fano_wen_ti)
-   [5ロジックファースト検証の発見](#rojikkufasuto_jian_zhengno_fa_jian)
    -   [5.1私の開発環境と、ロジックファースト検証の起源](#sino_kai_fa_huan_jingtorojikkufasuto_jian_zhengno_qi_yuan)
    -   [5.2Skill運用開始後に起きた面白いこと](#Skill_yun_yong_kai_shi_houni_qikita_mian_baiikoto)
    -   [5.3tmpの蓄積](#tmpno_xu_ji)
-   [6発見：tmpは「自然言語から生まれた要件」だ](#fa_jiantmpha_zi_ran_yan_yukara_shengmareta_yao_jianda)
    -   [6.1tmpの本質的価値](#tmpno_ben_zhi_de_si_zhi)
    -   [6.2なぜ「自然言語から生まれた要件」なのか？](#naze_zi_ran_yan_yukara_shengmareta_yao_jiannanoka)
        -   [6.2.1理由1: 実際の利用パターンの記録](#li_you1_shi_jino_li_yongpatanno_ji_lu)
        -   [6.2.2理由2: ビジネスルールの具現化](#li_you2_bijinesururuno_ju_xian_hua)
        -   [6.2.3理由3: 組み合わせパターンの発見](#li_you3_zumi_hewasepatanno_fa_jian)
    -   [6.3tmpに蓄積される3種類の情報](#tmpni_xu_jisareru3zhong_leino_qing_bao)
-   [7tmpからビジネスロジックを抽出する](#tmpkarabijinesurojikkuwo_chou_chusuru)
    -   [7.1頻出パターンの観察](#pin_chupatanno_guan_cha)
    -   [7.2ビジネスロジックの抽出事例](#bijinesurojikkuno_chou_chu_shi_li)
        -   [7.2.1事例1: validate orphaned → Skill機能化](#shi_li1_validate_orphaned_Skill_ji_neng_hua)
        -   [7.2.2事例2: 段階的な拡張プロセス](#shi_li2_duan_jie_dena_kuo_zhangpurosesu)
-   [8UIなしでビジネスロジックを整備できる理由](#UInashidebijinesurojikkuwo_zheng_beidekiru_li_you)
    -   [8.1従来のUI先行開発 vs ロジックファースト検証](#cong_lainoUI_xian_xing_kai_fa_vs_rojikkufasuto_jian_zheng)
    -   [8.2Claude Codeが「操作UI」として機能](#Claude_Codega_cao_zuoUItoshite_ji_neng)
        -   [8.2.1なぜ「UI不要」が成立するのか – 概念的理解](#nazeUI_bu_yaoga_cheng_lisurunoka_-_gai_nian_de_li_jie)
        -   [8.2.2UI不要が適している場面・適さない場面](#UI_bu_yaoga_shishiteiru_chang_mianshisanai_chang_mian)
    -   [8.3tmpがビジネスロジック整備を可能にする仕組み](#tmpgabijinesurojikku_zheng_beiwo_ke_nengnisuru_shi_zumi)
-   [9まとめ](#matome)
    -   [9.1tmpの再定義](#tmpno_zai_ding_yi)
    -   [9.2tmpが実現する新しい開発フロー](#tmpga_shi_xiansuru_xinshii_kai_fafuro)
    -   [9.3前回の記事の「短時間完成」の本当の意味](#qian_huino_ji_shino_duan_shi_jian_wan_chengno_ben_dangno_yi_wei)
    -   [9.4核心的な発見](#he_xin_dena_fa_jian)
    -   [9.5関連する開発手法との違い](#guan_liansuru_kai_fa_shou_fatono_weii)
        -   [9.5.1vs. 従来の仕様駆動開発](#vs_cong_laino_shi_yang_qu_dong_kai_fa)
        -   [9.5.2vs. AI駆動開発](#vs_AI_qu_dong_kai_fa)
        -   [9.5.3vs. TDD（テスト駆動開発）](#vs_TDDtesuto_qu_dong_kai_fa)
        -   [9.5.4ロジックファースト検証の位置づけ](#rojikkufasuto_jian_zhengno_wei_zhidzuke)
    -   [9.6実践方法について](#shi_jian_fang_fanitsuite)
-   [10参考リンク](#can_kaorinku)
    -   [10.1公式ドキュメント](#gong_shidokyumento)
    -   [10.2前提記事](#qian_ti_ji_shi)
    -   [10.3関連ブログ](#guan_lianburogu)
    -   [10.4次に読むべき記事](#cini_dumubeki_ji_shi)

## はじめに

ども！Claude Codeにべったりな龍ちゃんです。

[前回の記事「Claude Code: 公式MCPを補完するSkills設計パターン」](https://tech-lab.sios.jp/archives/50214)で、**公式MCPを補完するSkillsパターン**を紹介し、UI開発工数を大幅削減した事例を共有しました。

特に、こんな成果を報告しました：

-   **フロントエンド開発をスキップ**
-   UI設計（3-5日）をスキップ
-   React開発（7-10日）をスキップ
-   **開発工数を大幅削減**（実測例として数時間〜1日で実装）

でも、概要しか書いていないので：

> 「なぜフロントエンド開発をスキップできたの？」  
> 「UIなしでどうやってビジネスロジックを整備したの？」  
> 「短時間で完成した秘密は何？」

前回の記事では「Claude CodeをUIとして使った」と説明しましたが、**それだけでは本質的な理由になっていません**。

本記事では、**なぜフロントエンド開発をスキップできたのか**、その核心に迫ります。

**キーワードは、`tmp/`ディレクトリに蓄積されるスクリプトです。**

結論を先に言うと、tmpスクリプトは「ゴミ」ではなく、**「人間の自然言語から生まれた純粋な要件」**でした。この発見が、前回の記事で紹介した4層構造（公式SDK → 自作Client → CLI → Skill）を可能にしました。

## TL;DR

この記事で分かること：

-   **なぜUI開発をスキップできたのか**の本質的理由
    -   tmpスクリプトがビジネスロジックを整備してくれた
    -   Claude Codeが「人間の操作UI」として機能
    -   UIは後回しにできる（ロジック確定後 → 手戻りなし）
-   **tmpスクリプトの再定義**
    -   従来: tmp/ = 一時的なゴミ
    -   新発見: tmp/ = **人間の自然言語から生まれた純粋な要件の可視化**
-   **ロジックファースト検証のプロセス**
    -   CLI基本実装 → Skill定義 → tmp蓄積 → tmp観察 → ビジネスロジック抽出 → CLI拡張
    -   頻出パターンの発見（5回生成 → Skill化）
    -   ビジネスルールの具現化（類似度90%、マージ優先順位等）
-   **実践方法**（詳細は[次回の記事「Claude Code一時ファイルからSkillsへ：ビジネスロジック抽出の実践ガイド」](https://tech-lab.sios.jp/archives/50202)で解説）
    -   週次レビュー、docs/research/へのログ記録
    -   3回以上生成 → Skill機能追加候補
-   **開発工数削減の本質**
    -   AIツールによる速度向上ではない
    -   **UI開発というアプローチ自体を変えたこと**

**重要な前提条件:**

-   Claude Code Skillsの基本を理解している
-   前回の記事「Claude Code: 公式MCPを補完するSkills設計パターン」を読んでいる

## こんな人に読んでほしい

✅ 前回の記事を読んで「なぜ短時間で完成できたのか」が気になった人  
✅ フロントエンド開発なしでビジネスロジックを整備したい人  
✅ `application/tools/tmp/`にスクリプトが溜まっている人  
✅ 要件が固まっていない段階で開発を始めたい人  
✅ UI設計の手戻りコストに悩んでいる人  
✅ 「tmpスクリプト = ゴミ」と思って削除していた人

## 従来のUI先行開発の問題

まず、典型的な開発フローを見てみましょう：

要件定義 → UI設計 → フロントエンド実装 → バックエンド実装

**根本的な問題**: ビジネスロジックが固まっていない段階でUIに投資している

![](https://tech-lab.sios.jp/wp-content/uploads/2025/11/part2-01-development-flow-comparison.svg)

例えば、こんなシーンを想像してください：

要求:「重複カテゴリをマージできる画面が欲しい」
  ↓
UI設計開始: ボタン配置、確認ダイアログ、進捗表示...
  ↓
実装開始
  ↓
「あれ、重複の定義ってどうするんだっけ？」
「マージ時に投稿数が多い方を残す？古い方を残す？」
  ↓
仕様変更 → UI再設計 → 再実装 ← 高コスト！

**要件変更 = 高コスト**の悪循環：

-   ビジネスロジック変更 → UIも変更が必要
-   小さい単位での試行錯誤ができない
-   UI完成しないと実際の操作フローが分からない
-   完成後に「やっぱりこの機能いらない」と判明…

前回の記事で触れた開発工数の差（16-24日 vs 数時間〜1日）の**本質的な理由がここにあります**。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/11/part2-02-development-cost-comparison.png?resize=880%2C546&ssl=1)

## ロジックファースト検証の発見

### 私の開発環境と、ロジックファースト検証の起源

以前、[AIチャットで話すだけ!X予約投稿を完全自動化するシステム構築術](https://tech-lab.sios.jp/archives/49981)で紹介したX予約投稿システムは、**Firestoreベース**でした。

その後、データベースを**Supabaseに移行**することになりました。そして移行時に、**ビジネスロジックの変更要求**が出てきたんです。

ここで悩みました：

従来の方法: UI設計 → フロントエンド実装 → ビジネスロジック検証
  ↓
問題: ビジネスロジックが固まっていないのにUIを作る？
      検証してみたら要件変更 → UI作り直し？

「先にビジネスロジックを検証できないかな…」

そこで思いついたのが、**Claude CodeをUIとして使う**方法でした。UIを作らず、CLIツール + Skillsでビジネスロジックを先に検証してしまおう、と。

前回の記事で紹介した**Supabase公式MCPを補完するSkills**を実装し、こんな構成になりました：

CLIツール（db コマンド）
  ↓
Skills定義（.claude/skills/\*.md）
  ↓
Claude Codeから操作可能

**特徴**:

-   基本CRUD操作のみ実装（posts, categories, hashtags, series）
-   [X投稿管理システムのデータベースを操作](https://tech-lab.sios.jp/archives/49981)
-   UIは存在しない
-   Claude Codeが「人間の操作UI」として機能

### Skill運用開始後に起きた面白いこと

基本操作は順調でした：

私: 「投稿一覧を取得して」
Claude Code: uv run db posts list を実行
✅ 成功

私: 「カテゴリ一覧も見せて」
Claude Code: uv run db categories list を実行
✅ 成功

「Skill、便利だな！基本操作は完璧！」と思っていました。

しかし、**組み合わせ処理**を依頼すると、面白いことが起きました：

**私のリクエスト**: 「重複カテゴリを見つけてマージして」

**Claude Codeの反応**:

1.  `uv run db categories list` を実行
2.  カテゴリ一覧を取得
3.  **`application/tools/tmp/merge_duplicate_categories.py` を生成** ← ここ！
4.  スクリプトを実行して重複を検出
5.  `uv run db categories merge` を実行

**観察**: Skill（db）は基本操作のみ提供していました。組み合わせ処理のために、**Claude Codeが中間処理のスクリプトをtmp/に生成**していたんです。

「あれ、tmpにスクリプトが残ってる。これ、削除すべき？」

### tmpの蓄積

1週間後、tmp/ディレクトリを覗いてみると：

tmp/
├── merge\_duplicate\_categories.py（3回生成）
├── validate\_orphaned\_posts.py（5回生成）
├── analyze\_hashtag\_stats.py（2回生成）
├── export\_posts\_csv.py（1回生成）
└── bulk\_update\_scheduled\_posts.py（4回生成）

「これ、ゴミじゃなくて何か意味があるのでは？」

同じスクリプトが複数回生成されている…これは偶然じゃない。

## 発見：tmpは「自然言語から生まれた要件」だ

### tmpの本質的価値

**従来の認識**:

-   tmp/ = 一時的なゴミ
-   実行後は削除すべき
-   気にしなくて良い

**新しい認識**（私の発見）:

-   tmp/ = **人間の自然言語から生まれた純粋な要件の可視化**
-   Skillの足りない機能の証拠
-   ビジネスロジックの暗黙知が形になったもの
-   次の改善のヒント

### なぜ「自然言語から生まれた要件」なのか？

#### 理由1: 実際の利用パターンの記録

**従来の要件定義プロセス**:

人間が考える → 要件書に書く → 「こうあるべき」

→ 抽象的、実際に使われるかは不明

**ロジックファースト検証のプロセス**:

人間が自然言語で依頼 → Claude Codeがtmpスクリプト生成 → 「実際にこう使った」

→ 具体的、実証済み、検証済み

**読者への問いかけ**: あなたが書いた要件書、実際に全部使われましたか？

#### 理由2: ビジネスルールの具現化

これが一番面白い発見でした。

**要件書に書いたこと（抽象的）**:

> 重複カテゴリを検出してマージできること

**tmp/merge\_duplicate\_categories.py の中身（具体的）**:

```
def find_duplicates(categories):
    """重複カテゴリを検出

    重複の定義:
    1. name完全一致
    2. name.lower()一致（大文字小文字無視）
    3. 編集距離が2以下（typo考慮）
    """
    for i, cat1 in enumerate(categories):
        for cat2 in categories[i+1:]:
            similarity = SequenceMatcher(
                None,
                cat1["name"].lower(),
                cat2["name"].lower()
            ).ratio()

            if similarity > 0.9:  # 90%以上の類似度
                duplicates.append((cat1, cat2, similarity))

    return duplicates

def merge_strategy(duplicates):
    """マージ戦略

    優先順位:
    1. 投稿数が多い方を残す
    2. created_atが古い方を残す
    3. UUIDが辞書順で小さい方を残す
    """
    # ... 実装 ...
```

**これが「人間の純粋な要件」です**:

-   重複の具体的な定義（類似度90%以上）
-   マージの優先順位（投稿数 > 作成日時 > UUID）
-   エッジケースの扱い（複数重複がある場合）

→ **要件書には書かれていない詳細が、tmpスクリプトには全て含まれている**

私が「重複カテゴリをマージして」と自然言語で依頼した時、頭の中にあった暗黙の要件が、tmpスクリプトとして可視化されたんです。

#### 理由3: 組み合わせパターンの発見

**Skill設計時の想定**:

-   基本CRUD操作のみ考えていた
-   list, get, create, update, delete

**tmp/が教えてくれた実際の使い方**:

-   list → 処理 → merge（組み合わせ）
-   list → フィルタ → validate（検証）
-   list → 集計 → sort（分析）

→ **実際の組み合わせパターンが自然に記録される**

Skill設計時には考えていなかった使い方が、tmpに全部記録されていました。

### tmpに蓄積される3種類の情報

分析してみると、tmpスクリプトには3種類の情報が含まれていました：

1.  **基本操作の組み合わせパターン**
    -   どのコマンドをどの順序で実行するか
    -   例: `db categories list` → 処理 → `db categories merge`
2.  **Skillにない独自ロジック**
    -   重複検索アルゴリズム（類似度計算）
    -   クロスチェック（複数テーブル横断）
    -   統計・集計（Top10表示）
3.  **ビジネスルールの実装**
    -   「重複とは何か」の具体的な定義
    -   「孤立とは何か」の判断基準
    -   「有用なハッシュタグ」の評価軸

## tmpからビジネスロジックを抽出する

### 頻出パターンの観察

簡単な分析で、何が必要な機能かが見えてきました：

```
# tmp/内のスクリプトを名前でカウント
ls application/tools/tmp/*.py | xargs -n1 basename | sort | uniq -c | sort -nr
```

**結果**:

5 validate\_orphaned\_posts.py
4 bulk\_update\_scheduled\_posts.py
3 merge\_duplicate\_categories.py
2 analyze\_hashtag\_stats.py
1 export\_posts\_csv.py

**解釈**:

-   5回生成 → **週1回以上使う** → Skillに組み込むべき
-   3-4回 → **定期的に使う** → Skill機能追加候補
-   1-2回 → tmpのままで良い（稀なケース）

データが教えてくれました。「validate\_orphaned\_posts.pyは必要な機能だ」と。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/11/part2-04-frequent-pattern-analysis.png?resize=880%2C572&ssl=1)

### ビジネスロジックの抽出事例

#### 事例1: validate orphaned → Skill機能化

**tmpの内容**（5回生成）:

\# tmp/validate\_orphaned\_posts.py の処理フロー
1. uv run db posts list（全投稿取得）
2. カテゴリ未設定の投稿をフィルタ
3. 結果をリスト表示

**発見**:

-   ✅ 孤立投稿の検証は定期的に行う作業（週1回以上）
-   ✅ ロジックが毎回同じ
-   ✅ ビジネスルールが固まっている

「これ、毎回tmpスクリプト生成するの無駄じゃない？Skillに組み込もう」

**Skillへの追加（Phase 3実装）**:

```
# 新しいコマンドとして実装
uv run db validate orphaned

# 出力例
Orphaned Scheduled Posts: 0
Unused Categories: 2
  ID: 106, Name: 本番環境構築
  ID: 66, Name: フロントエンド

Unused Hashtags: 1
  ID: 34, Name: #TEST

Total issues found: 3
```

→ **tmpスクリプトがSkillの本体機能に昇格**

これで、次回から「孤立投稿を検証して」と依頼すると、tmpスクリプトを生成せず、直接Skill機能が実行されるようになりました。

#### 事例2: 段階的な拡張プロセス

tmp観察を続けることで、自然に機能が拡張されていきました：

**Phase 1（初期実装）**: 基本CRUDのみ

-   list, get, create, update, delete

**tmp観察（1週間）**:

-   カテゴリ・ハッシュタグでのフィルタ要求が頻出
-   統計情報の要求も多い

**Phase 2（拡張）**: 複雑なクエリ追加

-   `--category`, `--hashtag` フィルタオプション
-   `stats` コマンド（集計）
-   中間テーブル操作（add-categories, add-hashtags）

**tmp観察（さらに1週間）**:

-   merge系スクリプトが頻出
-   データクリーニングの需要が明確に

**Phase 3（さらに拡張）**: データクリーニング機能

-   `find-duplicates` コマンド
-   `merge --dry-run` コマンド
-   `validate orphaned` コマンド

→ **tmpの観察が、段階的な機能拡張を自然に導いた**

**段階的な開発により**: 短期間でデータベース管理システムが完成（実測例として15時間程度）

## UIなしでビジネスロジックを整備できる理由

### 従来のUI先行開発 vs ロジックファースト検証

**従来の方法**:

要件書「重複カテゴリをマージできること」
  ↓
UI設計: ボタン、ダイアログ、進捗表示
  ↓
フロントエンド実装（React等）
  ↓
実際に使ってみる
  ↓
「あれ、重複の定義が曖昧だった」
「マージ条件が足りない」
  ↓
仕様変更 → UI再設計 → 再実装 ← 高コスト！

**問題**: ビジネスロジックが固まっていないのにUIを作っている

**ロジックファースト検証**:

CLIツール（基本操作のみ）
  ↓
人間が自然言語で依頼「重複カテゴリをマージして」
  ↓
Claude Codeがtmp/merge\_duplicate\_categories.py を生成
  ↓
tmpスクリプトに「重複の定義」「マージ戦略」が可視化される
  ↓
頻出パターンを観察（週次レビュー）
  ↓
ビジネスロジック抽出
  ↓
CLIに機能追加（\`db categories find-duplicates\`）
  ↓
ビジネスロジック完成（UIはまだない）
  ↓
必要になったらUI実装（ロジック確定済み、手戻りなし）

**利点**:

-   ✅ ビジネスロジックを先に固められる
-   ✅ UIなしで検証・改善できる
-   ✅ 小さく試行錯誤できる
-   ✅ UI設計時には要件が確定している → 手戻りゼロ

### Claude Codeが「操作UI」として機能

**重要な洞察**: UIがないのではなく、**Claude Codeが人間の操作UIになっている**

従来のUI:
  人間 → Webフロントエンド → バックエンド → データベース

ロジックファースト:
  人間 → Claude Code（自然言語UI） → CLIツール → データベース

#### なぜ「UI不要」が成立するのか – 概念的理解

従来のUIの役割を分解すると：

**1\. 視覚的フィードバック** （操作結果の確認）

-   従来: ボタンを押して画面で結果を見る
-   tmp駆動: tmpスクリプトを実行して、実行可能なフィードバックを得る
-   **本質**: UIは「見るため」ではなく「確認するため」→ 実行結果で代替可能

**2\. 操作の抽象化** （複雑なコマンドを簡単に）

-   従来: ボタン一つで複雑な処理を実行
-   tmp駆動: 自然言語で依頼すると、Claude Codeがtmpスクリプト生成
-   **本質**: UIは「操作を簡単にする」→ 自然言語で代替可能

**3\. 操作フローのガイド** （次に何をすべきか示す）

-   従来: 画面遷移やメニューで操作を誘導
-   tmp駆動: tmpスクリプトの頻出パターンから次の機能を発見
-   **本質**: UIは「発見を助ける」→ tmp観察で代替可能

つまり、**UIの役割は全て代替可能**です。

**Claude CodeがUIとして優れている点**:

-   ✅ 自然言語で操作できる（ボタン配置不要）
-   ✅ 柔軟性が高い（固定画面レイアウトがない）
-   ✅ 組み合わせ処理を即座に実行（カスタマイズ自在）
-   ✅ tmpスクリプト生成で要件を可視化（暗黙知の顕在化）

これが、フロントエンド開発をスキップできた理由です。

#### UI不要が適している場面・適さない場面

**適している場面**:

-   ✅ バックエンドロジック開発（データ処理、検証、変換）
-   ✅ 自動化スクリプト（バッチ処理、CI/CD）
-   ✅ インフラ管理（データベース操作、設定変更）
-   ✅ 個人・小チーム利用（開発者のみが使う）

**UIが必要な場面**:

-   ❌ ビジュアルデザインが重要（UI/UX設計が価値）
-   ❌ 非エンジニアユーザー向け（自然言語UIでは不十分）
-   ❌ リアルタイム性が重要（グラフ、ダッシュボード）
-   ❌ 規制要件（監査証跡、操作履歴の可視化）

**移行パターン**:

多くの場合、こうなります：

Phase 1: tmp駆動でロジック整備（UI不要）
Phase 2: ロジック確定後、必要ならUI実装

UI実装は、**ロジックが固まってから**。手戻りがゼロになります。

**将来的なアプリ化の価値**:

ビジネスロジック検証で確定した機能は、**本当に人間が欲している機能**として証明されています。この段階でアプリ化すれば：

-   ✅ 要件が固まっている → UI設計が明確
-   ✅ ビジネスルールが検証済み → 手戻りゼロ
-   ✅ 実際の利用パターンが分かっている → 最適なUX設計が可能
-   ✅ tmpスクリプトの頻度から優先機能が明確 → 無駄な機能を作らない

つまり、**tmpで検証したロジックをアプリ化することで、本当に価値のある機能だけを提供できる**んです。

### tmpがビジネスロジック整備を可能にする仕組み

1\. 人間の暗黙知を可視化
   → 「重複って何？」がtmpスクリプトに具体的な定義として現れる

2. 頻出パターンの発見
   → 同じスクリプトが5回生成 → これは必要な機能だ

3. ビジネスルールの検証
   → tmpスクリプトが実際に動く → ロジックが検証済み

4. UIなしで改善サイクル
   → tmp観察 → CLI拡張 → 再びtmp観察 → さらに拡張

この4つのステップが、UIなしでビジネスロジックを整備できる仕組みです。

## まとめ

### tmpの再定義

**従来の認識**:

-   tmp/ = 一時的なゴミ
-   実行後は削除すべき

**新しい理解**:

-   tmp/ = **人間の自然言語から生まれた純粋な要件**
-   ビジネスロジック整備の記録
-   UI設計のヒント

### tmpが実現する新しい開発フロー

従来:
  要件定義 → UI設計 → 実装 → 「仕様変更...」

ロジックファースト:
  CLI基本実装 → Skill定義 → tmp蓄積 → ビジネスロジック抽出 → CLI拡張
  → ロジック確定 → （必要なら）UI実装

**革新的な点**:

-   ✅ **UIなしでビジネスロジックを整備・検証できる**
-   ✅ **tmpが要件定義のプロセス自体を変える**
-   ✅ **小さく試行錯誤しながらロジックを固められる**
-   ✅ **UI設計は後回し（ロジック確定後）→ 無駄なし**

### 前回の記事の「短時間完成」の本当の意味

**前回の記事で語ったこと**: フロントエンド開発をスキップして短時間で完成（事実）

**本記事で明かしたこと**: tmpがビジネスロジックを整備してくれた（理由）

**なぜスキップできたのか**:

-   ✅ tmpがビジネスロジックを整備してくれた（自然言語から要件が生まれる）
-   ✅ Claude Codeが人間の操作UIとして機能（Webフロントエンドが不要）
-   ✅ UIは後回しにできる（ロジック確定後 → 手戻りなし）

**開発プロセスの比較**:

従来: 要件定義（抽象的）→ UI設計 → フロント実装 → バックエンド
      合計: 16-24日（128-192時間、一般的な工数見積として参考）

ロジックファースト: CLI基本実装 → Skill定義 → tmp蓄積・観察 → CLI拡張
                  合計: 数時間〜1日（実測例として参考）

削減効果: UI開発をスキップすることで大幅削減

**時間内訳の詳細**:

フェーズ

従来

ロジックファースト

削減内容

要件定義

16-24h

最小限

大部分スキップ

UI設計

32-48h

0h

**100%削減**

フロントエンド

40-60h

0h

**100%削減**

バックエンド

24-36h

数時間〜1日

**大幅削減**

機能拡張

16-24h

段階的に追加

**柔軟に対応**

**削減の本質**: AIツールによる速度向上ではなく、**UI開発というアプローチ自体を変えた**ことです。

### 核心的な発見

tmpスクリプトを観察することで：

1.  **人間の暗黙知が可視化される**
    -   「重複って何？」→ 類似度90%以上という具体的な定義
2.  **頻出パターンから優先順位が見える**
    -   5回生成 → 必要な機能
    -   1回生成 → 稀なケース
3.  **ビジネスルールが検証される**
    -   tmpスクリプトが実際に動く → 検証済み
4.  **UIなしで改善サイクルが回る**
    -   tmp観察 → CLI拡張 → tmp観察 → さらに拡張

### 関連する開発手法との違い

ロジックファースト検証は、既存の開発手法と何が違うのでしょうか？

#### vs. 従来の仕様駆動開発

項目

仕様駆動開発

ロジックファースト検証

要件の形式

ドキュメント（抽象的）

実行可能スクリプト（具体的）

検証方法

レビュー会議

実行して確認

変更コスト

高い（ドキュメント更新 + 実装変更）

低い（tmpを捨てて再生成）

発見的開発

困難（仕様変更が重い）

容易（試行錯誤しやすい）

**本質的な違い**: ドキュメントは「こうあるべき」、tmpスクリプトは「実際にこう使った」

#### vs. AI駆動開発

項目

AI駆動開発

ロジックファースト検証

ツール依存性

高い（特定AIツールに依存）

低い（自然言語UIなら何でも）  
Skillsを使うならClaude依存

焦点

AIの活用方法

開発手法そのもの

適用範囲

コード生成中心

要件発見 → 実装まで

本質

ツール論

方法論

**本質的な違い**: AI駆動開発は「AIを使う」手法、ロジックファースト検証は「自然言語を要件にする」手法（ツール非依存）

#### vs. TDD（テスト駆動開発）

項目

TDD

ロジックファースト検証

駆動要素

テストコード

tmpスクリプト

目的

品質保証

要件発見

成果物

永続的テスト

一時的スクリプト（昇格可能）

サイクル

Red → Green → Refactor

tmp生成 → 観察 → 抽出 → 昇格

**本質的な違い**: TDDは「正しさ」を駆動、ロジックファースト検証は「要件そのもの」を駆動

#### ロジックファースト検証の位置づけ

要件発見フェーズ: ロジックファースト検証 ← 本手法の焦点
      ↓
実装フェーズ: TDD, AI駆動開発など
      ↓
運用フェーズ: DevOps, SRE

ロジックファースト検証は、**要件が固まっていない初期段階**に特に有効です。要件が明確になれば、TDDやAI駆動開発と組み合わせて使えます。

### 実践方法について

tmpの具体的な観察方法、ビジネスロジックの抽出手順、環境セットアップなどの詳細は、次回の記事「**Claude Code一時ファイルからSkillsへ：ビジネスロジック抽出の実践ガイド**」で解説します。

次回の記事では：

-   tmpディレクトリのプロジェクト内設定方法
-   週次レビューの実践
-   ビジネスロジック抽出の具体例（コード付き）
-   環境セットアップ（Python/uv, TypeScript）
-   tmpからCLI機能への昇格プロセス

を扱う予定です。

皆さんも、tmpスクリプトを削除せず、観察してみてください。そこには、**あなたの本当の要件が隠れています**。

## 参考リンク

### 公式ドキュメント

-   [Claude Code 公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/overview)
-   [Claude Code Skills 公式ガイド](https://docs.anthropic.com/en/docs/claude-code/skills)
-   [Supabase 公式ドキュメント](https://supabase.com/docs)
-   [Python 公式ドキュメント](https://docs.python.org/3/) – 型ヒント、subprocess等
-   [uv 公式ドキュメント](https://docs.astral.sh/uv/)

### 前提記事

-   **[Claude Code: 公式MCPを補完するSkills設計パターン](https://tech-lab.sios.jp/archives/50214)**
    -   4層構造パターン（公式SDK → 自作Client → CLI → Skill）
    -   UI開発工数の大幅削減
    -   なぜフロントエンド開発をスキップできたか（表面的な説明）

### 関連ブログ

-   **[Claude Code Skills 実装ガイド：ローカルツールをスムーズに統合する方法](https://tech-lab.sios.jp/archives/50154)**
    -   Skillの実装方法（詳細）
    -   Progressive Disclosure、トークン効率化
    -   本記事の基盤となるSkills実装
-   **[HTMLでブログ記事を保存してる奴、全員Markdownにしろ。AIが読みにくいでしょうが！](https://tech-lab.sios.jp/archives/50175)**
    -   blog-scraperの実装例（tmpから進化したツール）
    -   トークン削減の実測データ
-   **[AIチャットで話すだけ!X予約投稿を完全自動化するシステム構築術](https://tech-lab.sios.jp/archives/49981)**
    -   X投稿管理システムの全体像
    -   Azure Functions + Supabaseでの予約投稿自動化

### 次に読むべき記事

-   **[Claude Code一時ファイルからSkillsへ：ビジネスロジック抽出の実践ガイド](https://tech-lab.sios.jp/archives/50202)**: tmpの観察方法、ビジネスロジック抽出の具体例、環境セットアップを詳解

次回の記事では、本記事で説明した概念を実際にどう実装するかを、コード例を交えて解説します。

質問や感想は、コメント欄でお待ちしております！

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-50208)[役に立たなかった](#afb-post-50208)  
  
0人がこの投稿は役に立ったと言っています。