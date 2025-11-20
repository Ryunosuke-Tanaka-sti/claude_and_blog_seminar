---
title: "Claude API×GitHub Actions完全自動化でコスト60%削減！ブログ投稿システム構築術 | SIOS Tech. Lab"
url: https://tech-lab.sios.jp/archives/49116
image: https://tech-lab.sios.jp/wp-content/uploads/2025/09/6a6d8d087ee4fbaa6b8064e99574aa3d.png
extracted_at: 2025-11-19T12:51:29.265Z
---

# Claude API×GitHub Actions完全自動化でコスト60%削減！ブログ投稿システム構築術 | SIOS Tech. Lab

**目次**

-   [1はじめに](#hajimeni)
-   [2成果物](#cheng_guo_wu)
-   [3GitHub × Claude API で実現する解決アプローチ](#GitHub_Claude_API_de_shi_xiansuru_jie_jueapurochi)
    -   [3.1基本コンセプト](#ji_benkonseputo)
    -   [3.2システム全体の流れ](#shisutemu_quan_tino_liure)
-   [4コスト最適化の技術的工夫：API 利用料を 60% 削減](#kosuto_zui_shi_huano_ji_shu_de_gong_fuAPI_li_yong_liaowo_60_xue_jian)
    -   [4.11\. HTML 前処理によるトークン削減（約 50% 削減）](#1_HTML_qian_chu_liniyorutokun_xue_jian_yue_50_xue_jian)
    -   [4.22\. プロンプトキャッシュの活用（約 37% 削減）](#2_puronputokyasshuno_huo_yong_yue_37_xue_jian)
    -   [4.3実際のコスト削減効果](#shi_jinokosuto_xue_jian_xiao_guo)
-   [5システム実装の詳細](#shisutemu_shi_zhuangno_xiang_xi)
    -   [5.1プロジェクト構成](#purojekuto_gou_cheng)
    -   [5.24 段階の投稿文生成プロセス](#4_duan_jieno_tou_gao_wen_sheng_chengpurosesu)
-   [6実際の運用フロー](#shi_jino_yun_yongfuro)
    -   [6.11\. GitHub Issue での起動](#1_GitHub_Issue_deno_qi_dong)
    -   [6.22\. 自動処理の実行](#2_zi_dong_chu_lino_shi_xing)
    -   [6.33\. レビュー・承認プロセス](#3_rebyucheng_renpurosesu)
    -   [6.44\. 運用実績](#4_yun_yong_shi_ji)
-   [7効果とメリット](#xiao_guotomeritto)
    -   [7.1定量的な効果](#ding_liang_dena_xiao_guo)
    -   [7.2定性的なメリット](#ding_xing_denameritto)
-   [8まとめと今後の展望](#matometo_jin_houno_zhan_wang)
    -   [8.1今後の発展可能性](#jin_houno_fa_zhan_ke_neng_xing)

## はじめに

ども！最近はClaude Codeにべったりな龍ちゃんです。皆さんは技術ブログから SNS 投稿まで、コンテンツマーケティングの自動化に取り組んでいますか？エンジニアやっている傍らで、情報発信やXの運用なども行っています。

私たちのチームでも以前、[Claude のプロジェクト機能でブログから X 投稿文を自動生成するシステム](https://tech-lab.sios.jp/archives/48231)を構築しました。これはこれで便利だったのですが、運用していくうちに以下の課題が明らかになったんですね。

**Claude プロジェクトの運用課題**

-   Claude の契約者しか利用できず、チーム内での共有や協業に制限がある
-   システムプロンプトの更新が上書き保存となり、改善履歴や変更効果の追跡ができない
-   成果物が Claude 上や他ツールに分散し、管理とレビューワークフローが属人化しやすい

「これは何とかしないと…」ということで、Claude API × GitHub Actions による完全自動化システムを構築することにしました。今回は設計思想から実装のポイント、コスト最適化まで詳しく解説していきますね。

## 成果物

今回の作成物は、.envファイルにClaude APIのAPI Keyを環境変数として入れることで動作するようになります。興味がある方はリポジトリを読んでみてください。こちらのリポジトリではPythonを書く環境をDevContainerで構築しています。

[![](https://tech-lab.sios.jp/wp-content/uploads/sng/fcb2e3326cf9e7213ed1f50421e988a4.)参考GitHub – Ryunosuke-Tanaka-sti/github-x-generate-demoGitHub](https://github.com/Ryunosuke-Tanaka-sti/github-x-generate-demo)

## GitHub × Claude API で実現する解決アプローチ

### 基本コンセプト

「GitHub だけでブログ URL から X 投稿文の生成・レビュー・公開まで完結」を目指しました。具体的には以下を実現しています：

-   **ワンクリック起動**: URL 入力で自動実行
-   **完全なバージョン管理**: Git でプロンプト・成果物を管理
-   **チーム協業**: 誰でもレビュー・承認可能
-   **コスト最適化**: API 利用料を最小化

### システム全体の流れ

自動化フローは以下のようになります：

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/09/GitHub-Flow.png?resize=880%2C154&ssl=1)

1.  **GitHub Issue でトリガー**: 記事 URL をタイトルに入力してイシューを作成
2.  **HTML 自動取得**: Python スクリプトで記事本文を抽出・クリーニング
3.  **Claude API で分析**: プロンプトキャッシュを活用して 3 パターンの投稿文を生成
4.  **PR 自動作成**: 生成結果を含む Pull Request を自動作成
5.  **レビュー・マージ**: チームメンバーが内容を確認して承認

このフローにより、Issue 作成から最終的な投稿文完成まで、すべて GitHub 上で完結できるようになりました。

## コスト最適化の技術的工夫：API 利用料を 60% 削減

Claude API の利用において、最も大きなコスト要因はトークン数です。私たちは以下の 2 つのアプローチでコストを大幅に削減しました。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/09/5bd156fc0f4e676ff6934beaeca67492.png?resize=644%2C487&ssl=1)

### 1\. HTML 前処理によるトークン削減（約 50% 削減）

当初はブログページの HTML を丸ごと送信していましたが、よく考えてみれば記事本文のみが必要なんですよね。Python スクリプトで以下の前処理を実装しました：

```
# 不要な HTML 要素の除去例
- ヘッダー・フッター・ナビゲーション
- サイドバー・広告・関連記事
- JavaScript・CSS・meta タグ
- コメント欄・SNS ボタン
```

この前処理により入力トークン数を約 50% 削減、コストが半分になりました。

### 2\. プロンプトキャッシュの活用（約 37% 削減）

[Claude API のプロンプトキャッシュ機能](https://docs.anthropic.com/ja/docs/build-with-claude/prompt-caching)を活用することで、システムプロンプト部分のトークン利用料を大幅に削減しました。

```
# プロンプトキャッシュの実装例
response = self.client.messages.create(
    model=self.model,
    max_tokens=4000,
    system=[
        {
            "type": "text",
            "text": self.system_prompt_content,
            "cache_control": {"type": "ephemeral"}  # キャッシュ設定
        }
    ],
    messages=[{"role": "user", "content": user_prompt}]
)
```

システムプロンプトをキャッシュすることで、2 回目以降は約 37% のコスト削減を実現しています。

### 実際のコスト削減効果

両方の最適化を組み合わせることで、実行コスト $0.10 → $0.04 程度に削減できました。年間で考えるとかなりの削減効果ですね。

## システム実装の詳細

### プロジェクト構成

```
github-x-generate/
├── scripts/                          # 実行スクリプト群
│   ├── generate_posts_with_cache.py  # Claude API統合
│   ├── fetch_html_from_techlab.py    # HTML取得・前処理
│   └── simple_claude_api.py          # API クライアント
├── prompts/
│   └── system_prompt.md              # システムプロンプト定義
├── .github/workflows/
│   └── generate_PR_from_issue.yaml   # メイン自動化ワークフロー
├── posts/                            # 生成結果保存ディレクトリ
└── requirements.txt                  # Python 依存関係定義
```

### 4 段階の投稿文生成プロセス

システムプロンプトでは、以下の 4 段階プロセスで高品質な投稿文を生成します：

**Phase 1: 記事分析・品質評価**

-   技術的正確性の 5 段階評価
-   実装レベルの判定（プロトタイプ〜企業レベル）
-   対象読者レベルの特定

**Phase 2: ハッシュタグ効果分析**

-   Web 検索による最新トレンドの調査
-   エンジニア向け効果的ハッシュタグの選定

**Phase 3: 3 パターンの投稿文作成**

-   A パターン: 効果重視・数値訴求型
-   B パターン: 課題共感・解決提案型
-   C パターン: 技術トレンド・学習促進型

**Phase 4: 誇張表現検証・修正**

-   記事内容との照合による事実確認
-   根拠のない数値・効果の除去

使用しているプロンプトはこちらのブログで解説をしています。

## 実際の運用フロー

### 1\. GitHub Issue での起動

```
https://tech-lab.sios.jp/archives/48173
```

記事 URL をタイトルに入力して Issue を作成するだけで、GitHub Actions が自動起動します。これだけです！

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/09/GitHub-Issue.png?resize=880%2C453&ssl=1)

### 2\. 自動処理の実行

-   HTML 記事の取得と本文抽出（約 30 秒）
-   Claude API による投稿文生成（約 45 秒）
-   PR 作成とメタデータ保存（約 15 秒）

トータル 1 分半程度で完了します。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/09/GitHub-Actions.png?resize=880%2C632&ssl=1)

### 3\. レビュー・承認プロセス

生成された PR には以下が含まれます：

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/09/GitHub-PR.png?resize=880%2C1894&ssl=1)

-   **3 パターンの投稿文**: 異なるアプローチの投稿候補
-   **品質評価データ**: 技術的正確性や対象読者の分析結果
-   **コスト情報**: 実際の API 利用料とトークン使用量

レビュアーは内容を確認し、必要に応じて微調整を加えてからマージするだけです。

### 4\. 運用実績

23 件の技術記事で運用実績があり、Azure・インフラ、AI・Claude、Git・CI/CD、Docker・コンテナなど多様な技術分野で安定動作を確認しています。

## 効果とメリット

### 定量的な効果

**コスト削減効果**

-   HTML 前処理: 50% トークン削減
-   プロンプトキャッシュ: 37% トークン削減
-   総合的なコスト削減: 約 60%

**工数削減効果**

-   投稿文作成時間: 30 分 → 3 分（90% 削減）
-   レビュー・修正工程: 20 分 → 5 分（75% 削減）
-   全体工程: 1 時間 → 10 分（83% 削減）

### 定性的なメリット

**チーム協業の向上**

-   誰でも投稿文生成を実行可能
-   GitHub ベースのレビューワークフロー
-   知見の蓄積とバージョン管理

**品質の向上**

-   誇張表現の自動検出・修正
-   記事内容との整合性保証
-   3 パターンによるA/Bテスト可能

**運用の効率化**

-   Issue 作成からマージまで自動化
-   エラー時の詳細な診断情報
-   成果物の一元管理

これは想像以上に効果的でした。特に複数人でのコンテンツマーケティングには必須のツールになりそうですね。

## まとめと今後の展望

Claude API × GitHub Actions により、個人プロジェクトでは困難だった「チーム協業」「バージョン管理」「コスト最適化」を同時実現することができました。約 60% のコスト削減と GitHub 完結型ワークフローにより、効率的な運用が可能になります。

### 今後の発展可能性

1.  **他プラットフォーム展開**: LinkedIn、Facebook 対応
2.  **多言語対応**: 英語版投稿文の自動生成
3.  **効果分析**: エンジニアリング指標の追加連携
4.  **統計分析活用**: 蓄積データによるプロンプト最適化

技術ブログのコンテンツマーケティング自動化にお悩みの方は、ぜひ参考にしてください。もし実装で困りごとがあれば連絡いただければお手伝いしますよ！！

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-49116)[役に立たなかった](#afb-post-49116)  
  
0人がこの投稿は役に立ったと言っています。