---
title: "【ブログ→登壇資料】Claude×Marpで80時間を11時間に短縮した方法 | SIOS Tech. Lab"
url: https://tech-lab.sios.jp/archives/48479
image: https://tech-lab.sios.jp/wp-content/uploads/2025/07/20df217714dfb5e4dd7b5c8970885c21.png
extracted_at: 2025-11-19T12:51:27.525Z
---

# 【ブログ→登壇資料】Claude×Marpで80時間を11時間に短縮した方法 | SIOS Tech. Lab

**目次**

-   [1はじめに](#hajimeni)
    -   [1.1衝撃の効率化実績](#chong_jino_xiao_lu_hua_shi_ji)
    -   [1.2この記事で得られること](#kono_ji_shide_derarerukoto)
    -   [1.3実際の成果物](#shi_jino_cheng_guo_wu)
-   [2基本ワークフロー（シンプルな3ステップ）](#ji_benwakufuroshinpuruna3suteppu)
    -   [2.1ステップ1：ブログ記事をClaudeに読み込ませる](#suteppu1burogu_ji_shiwoClaudeni_dumi_yumaseru)
    -   [2.2ステップ2：登壇情報を明確化してMarp形式で生成](#suteppu2_deng_tan_qing_baowo_ming_que_huashiteMarp_xing_shide_sheng_cheng)
    -   [2.3ステップ3：VSCodeで微調整とプレビュー](#suteppu3VSCodede_wei_diao_zhengtopurebyu)
-   [3実際の手順（今すぐ試せる具体的方法）](#shi_jino_shou_shun_jinsugu_shiseru_ju_ti_de_fang_fa)
    -   [3.1環境準備（5分で完了）](#huan_jing_zhun_bei_5fende_wan_le)
    -   [3.2Claude用プロンプト例（コピペOK）](#Claude_yongpuronputo_li_kopipeOK)
    -   [3.3Marpの基本設定](#Marpno_ji_ben_she_ding)
    -   [3.4生成から完成までの流れ](#sheng_chengkara_wan_chengmadeno_liure)
-   [4制約と現実的な対処法](#zhi_yueto_xian_shi_dena_dui_chu_fa)
    -   [4.1Marpが苦手なこと](#Marpga_ku_shounakoto)
    -   [4.2人間による最終調整が必要な部分](#ren_jianniyoru_zui_zhong_diao_zhengga_bi_yaona_bu_fen)
    -   [4.3PowerPointとの使い分け](#PowerPointtono_shii_fenke)
-   [5実際の成果と品質評価](#shi_jino_cheng_guoto_pin_zhi_ping_si)
    -   [5.1生成品質](#sheng_cheng_pin_zhi)
    -   [5.2時間短縮の内訳](#shi_jian_duan_suono_nei_yi)
-   [6作業時間効率化比較](#zuo_ye_shi_jian_xiao_lu_hua_bi_jiao)
    -   [6.1管理面でのメリット](#guan_li_miandenomeritto)
    -   [6.2まとめ](#matome)
        -   [6.2.1この手法が向いている人](#kono_shou_faga_xiangiteiru_ren)
        -   [6.2.2この手法が向いていない場面](#kono_shou_faga_xiangiteinai_chang_mian)
        -   [6.2.3今日から始められるアクション](#jin_rikara_shimerareruakushon)
        -   [6.2.4将来的な展望](#jiang_lai_dena_zhan_wang)
        -   [6.2.5次回予告](#ci_hui_yu_gao)
    -   [6.3補足情報](#bu_zu_qing_bao)
        -   [6.3.1参考リンク](#can_kaorinku)
        -   [6.3.2動作環境](#dong_zuo_huan_jing)

## はじめに

ども！Claude関連のブログを週に5本も投稿してしまって燃え尽きている龍ちゃんです。登壇資料完成までもう少しなので、今週の残りを走り切ろうと思います。[Claude×技術ブログというテーマ](https://tech-lab.sios.jp/archives/tag/claudex%e6%8a%80%e8%a1%93%e3%83%96%e3%83%ad%e3%82%b0)でハイペースでブログを執筆しています。

そんな中、今回の登壇資料作成にClaudeが大活躍して、なんと**爆速で登壇資料作成が終わった**んです！

### 衝撃の効率化実績

-   **従来：40時間/本 × 2本 = 80時間**
-   **新手法：11時間で2本完成（3時間生成 + 5時間修正 × 2本）**
-   **結果：約7倍の効率化を実現**

45分の登壇資料を3時間で作る、これって革命的じゃないですか？

### この記事で得られること

-   ブログ記事を登壇資料に変換する実用的な方法
-   Claude×Marpによるエンジニア最適化ワークフロー
-   実際に使えるプロンプト例とコード
-   現実的な課題と対処法（包み隠さず全部話します！）

### 実際の成果物

今回作成したコンテンツはすべて、GitHubとGitHub Pagesに公開しています。ぜひ見てみてください。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/07/cbf4e5f126bfea71bf29668a9b89fdd9.png?resize=880%2C495&ssl=1)

[参考Claude AI活用技術セミナー – 登壇資料ハブ

](https://ryunosuke-tanaka-sti.github.io/claude_and_blog_seminar/)[参考GitHub – Ryunosuke-Tanaka-sti/claude\_and\_blog\_seminarGitHub](https://github.com/Ryunosuke-Tanaka-sti/claude_and_blog_seminar)

## 基本ワークフロー（シンプルな3ステップ）

Claude×Marpによる登壇資料作成は、以下の3ステップで完了します。Claude Codeの実行環境を準備することで、Marp形式のMarkdownをスムーズに編集・更新できます。

### ステップ1：ブログ記事をClaudeに読み込ませる

最初に、既に執筆済みのブログ記事をClaudeに読み込ませ、ドキュメントとして参照できる状態にします。

-   **一次情報の活用**：すでに執筆済みの内容なので、信頼性が担保されています
-   **複数ブログの参照**：関連する複数のブログを参照させることで、より充実した登壇資料を短時間で作成できます

### ステップ2：登壇情報を明確化してMarp形式で生成

高品質な登壇資料を作成するためには、**登壇に関する基本情報を整理**することが重要です。

-   **対象者**：どのようなレベル・バックグラウンドの人か
-   **時間**：登壇時間はどれくらいか
-   **目的**：何を伝えたいのか

これらの情報とブログの内容を組み合わせて、ClaudeにMarp形式で登壇資料を生成してもらいます。

**メリット**：  
MarpはMarkdown形式での記述のため、エンジニアにとって操作しやすく、バージョン管理も容易です。

### ステップ3：VSCodeで微調整とプレビュー

Claudeが生成した初期草案をベースに、VSCode上でリアルタイムプレビューを確認しながら編集を行います。

**主な調整作業**：

-   **内容の追加・修正**：特定の部分を詳しく追記、関連情報の補強
-   **スライド構成の最適化**：情報量の調整、ページ分割の精練
-   **ビジュアル調整**：フォントサイズ、レイアウトの微調整

**効率的な作業環境**：

VSCodeのMarp拡張機能を使用することで、コード編集とプレゼンテーションのプレビューを同時に行えるため、作業効率が大幅に向上します。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/07/2c01479acafee906045839ca55b55dd5.jpg?resize=880%2C495&ssl=1)

## 実際の手順（今すぐ試せる具体的方法）

### 環境準備（5分で完了）

```
# VSCode拡張機能のインストール
- Marp for VS Code
- Markdown Preview Enhanced（推奨）
```

### Claude用プロンプト例（コピペOK）

```
以下のブログ記事を基に、45分の技術登壇用資料をMarp形式で作成してください。

【対象者】：エンジニア（経験年数3-5年）
【時間】：45分
【目的】：実践的な知識共有

【ブログ記事】：
[ここにブログ記事をペースト] or [MCP経由で取得]

【要件】：
- スライド数：25-30枚程度
- 実装例やコード例を含める
- 質疑応答用のスライドも追加
- Marp形式で出力
```

### Marpの基本設定

```
---
marp: true
theme: default
paginate: true
header: '登壇タイトル'
footer: 'あなたの名前 | 日付'
---
```

### 生成から完成までの流れ

1.  **Claude出力をコピー**（約30秒）
2.  **VSCodeで新規.mdファイル作成**（約1分）
3.  **プレビュー確認**（Ctrl+K → V）
4.  **内容調整**（30分-2時間）
5.  **エクスポート**（約2分）

## 制約と現実的な対処法

### Marpが苦手なこと

Claudeと実際に試してみたところ、いくつか苦手な部分がわかりました：

**複雑なレイアウト**

-   対処法：シンプルなデザインに徹する
-   個人的に「デザインよりもコンテンツの方が重要」と考えるようになりました

**凝った図表作成**

-   対処法：図にしたい部分はHTMLで出力してもらい、そのHTMLをベースに図表を作成してSVGで埋め込む
-   これは現実的な手法だと思います

**情報の詰め込みすぎ**

-   一枚のスライドに収まりきらない情報を書いてしまったり
-   図で表現すべき内容を文章で表現してしまうことがあります
-   対処法：何を図にするかという判断には、やはり人間の目が必要

### 人間による最終調整が必要な部分

現状、Marpで出力した資料をそのまま使えるケースはそれほど多くないと思います。

-   **図 vs 文章の判断**：AIは文章で説明しがち
-   **スライド分割**：1枚に情報を詰め込む傾向
-   **フォントサイズ調整**：読みやすさの最終確認

ただし、ブログをもとに生成された文章自体は使えるので、図の配置などに関して人間が確認しながら修正すれば十分実用的です。

### PowerPointとの使い分け

**Marp向き**：

-   コンテンツ重視
-   情報密度高め
-   エンジニア向け技術発表

**PowerPoint向き**：

-   デザイン重視
-   営業資料
-   視覚効果重要な場面

レイアウトにこだわらなければMarpで登壇資料を作るのはすごく効率的です。Marpで資料を作り、それをベースにパワーポイントなどで編集するというのも現実的なアプローチだと個人的に感じています。

## 実際の成果と品質評価

### 生成品質

-   **文章品質**：✅ そのまま使用可能レベル
-   **構成力**：✅ 論理的で分かりやすい流れ
-   **技術精度**：✅ ブログベースなので一次情報で正確
-   **デザイン**：⚠️ シンプルだが実用的

### 時間短縮の内訳

# 作業時間効率化比較

従来の手法 vs Claude + Marp活用従来の手法構成検討8時間

内容執筆20時間

デザイン調整10時間

微調整2時間

Claude + Marp活用構成検討 (Claude)5分96倍効率化

内容執筆 (Claude)5分240倍効率化

デザイン調整 (Marp)1時間10倍効率化

微調整 (人間)2-5時間

### 管理面でのメリット

Marpで資料を管理しておくと、通常登壇資料はドライブに保存するだけで参照情報をすべて記録することは少ないものですが、この方法では参照した情報がすべて保存された状態になり、管理の面でも優れています。

また、MarpでVSCodeのデザインファイルを作成できるので、CSSでプロパティを編集して自分の登壇資料のベースデザインを作成できます。CSSを書くのが苦手な人も多いと思いますが、AI入力に適した形式になっていると個人的に感じています。

## まとめ

### この手法が向いている人

-   ✅ **既にブログを書いているエンジニア**
-   ✅ **コンテンツ重視の登壇をする人**
-   ✅ **効率化を重視する人**
-   ✅ **マークダウンに慣れている人**

### この手法が向いていない場面

-   ❌ **デザイン性を重視する営業資料**
-   ❌ **複雑な図表が多数必要な資料**
-   ❌ **ブランディング重視のプレゼン**

### 今日から始められるアクション

1.  **VSCodeにMarp拡張機能をインストール**
2.  **過去のブログ記事を1つ選ぶ**
3.  **上記のプロンプトをClaudeに投入**
4.  **5分で最初のスライドを生成体験**

### 将来的な展望

これは将来的な展望になりますが、Marpで第一段階の資料を作成し、その構造化情報をもとに別のAIに入力してデザインを整えてもらうという方法も検討しています。

### 次回予告

-   **具体的な応用例**：技術勉強会での実際の使用例
-   **高度なカスタマイズ**：CSSでのデザイン調整
-   **チーム運用**：複数人でのMarp資料管理

皆さんも、ぜひこの方法で登壇資料作成の効率化にチャレンジしてみてください！

---

## 補足情報

### 参考リンク

-   [Marp公式サイト](https://marp.app/)
-   [VS Code Marp拡張機能](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)

### 動作環境

-   VSCode（最新版推奨）
-   Node.js（Marp CLI使用時のみ）
-   Claude Code

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-48479)[役に立たなかった](#afb-post-48479)  
  
0人がこの投稿は役に立ったと言っています。