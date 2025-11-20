---
title: "Notebook LMへのデータ収集をSlack Botで効率化する開発 with Google Docs | SIOS Tech. Lab"
url: https://tech-lab.sios.jp/archives/47891
image: https://tech-lab.sios.jp/wp-content/uploads/2025/06/ad8161766f5487542998631309f26383.jpg
extracted_at: 2025-11-19T12:51:17.002Z
---

# Notebook LMへのデータ収集をSlack Botで効率化する開発 with Google Docs | SIOS Tech. Lab

**目次**

-   [1はじめに](#hajimeni)
-   [2なぜこのシステムを開発したのか？](#nazekonoshisutemuwo_kai_fashitanoka)
-   [3実際の挙動](#shi_jino_ju_dong)
-   [4使用技術](#shi_yong_ji_shu)
-   [5処理フロー](#chu_lifuro)
    -   [5.1初期設定とメッセージ送信](#chu_qi_she_dingtomesseji_song_xin)
    -   [5.2Slack Events APIによる監視](#Slack_Events_APIniyoru_jian_shi)
    -   [5.3メッセージ情報の取得](#messeji_qing_baono_qu_de)
    -   [5.4Google Docs連携処理](#Google_Docs_lian_xie_chu_li)
    -   [5.5完了通知](#wan_le_tong_zhi)
-   [6構築](#gou_zhu)
    -   [6.1Google Docsの更新](#Google_Docsno_geng_xin)
    -   [6.2Slackにボットメッセージを送信する](#Slacknibottomessejiwo_song_xinsuru)
    -   [6.3リアクションイベントを受け付ける](#riakushonibentowo_shouke_fukeru)
    -   [6.4Slack スレッドに送信されたメッセージをすべて取得](#Slack_sureddoni_song_xinsaretamessejiwosubete_qu_de)
    -   [6.5リアクションイベントからGoogle Docsの取得までを一つの処理としてまとめる](#riakushonibentokaraGoogle_Docsno_qu_demadewo_yitsuno_chu_litoshitematomeru)
-   [7エラーハンドリングと署名検証](#erahandoringuto_shu_ming_jian_zheng)
    -   [7.1Slackの署名検証](#Slackno_shu_ming_jian_zheng)
    -   [7.2エラーハンドリング](#erahandoringu)
-   [8今後の展望](#jin_houno_zhan_wang)
    -   [8.1機能拡張の方向性](#ji_neng_kuo_zhangno_fang_xiang_xing)
    -   [8.2システム改善の取り組み](#shisutemu_gai_shanno_quri_zumi)
    -   [8.3技術的挑戦](#ji_shu_de_tiao_zhan)
    -   [8.4おわりに](#owarini)

# はじめに

お久です！皆さんAIにどれぐらい課金していますか？動画配信サービスより、AIサービスのほうが課金額が高くなっている龍ちゃんです。サービスごとに特色もあり、得意領域もそれぞれ異なるので、いっそのこと10万ぐらいぶっこんでしまいたいところですね。

さて！今回は、AIサービスを使うにあたって便利にしていこうというお話です。具体的な部分としては「SlackからNotebook LMに簡単にデータを取り込む方法」のプロトタイプについてです。

今回はベースのコンテンツを作成して、執筆はAIに手伝わせようと思います。ブログの最後にAIが執筆した部分と方法についてコラムを書いておきます。

# なぜこのシステムを開発したのか？

このプロトタイプを開発した背景には、AIサービスの活用における課題があります。特に、現在様々なAIサービスが登場し、それぞれの特色や得意分野が異なる中で、効率的な情報管理と連携の重要性が高まっています。

具体的な課題として、Google Docsを普段使用していないためのデータ連携の困難さや、Slackでの会話内容を効率的にまとめる必要性がありました。また、Slack AIは比較的高価である一方、既に契約済みのNotebook LMを有効活用したいという思いもありました。

そこで今回は、「SlackからNotebook LMに簡単にデータを取り込む方法」のプロトタイプ開発に着手しました。初期段階として、Slackのテキストメッセージのみを対象とし、スレッドを一つの単位として取り込む基本的な機能の実装を目指しています。

Notebook LMでは、一度紐づけたソースが更新された場合は手動でアクションを行う必要があるため完全な自動化には至っていません。ですが、Google Docsを起動することなく情報を転機できるため、AIと開発の連携をより上げることができると期待しています。

![龍ちゃん](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/02/profile-mini.png?resize=80%2C80&ssl=1)龍ちゃん

[あとは！この記事を読んで作りたくなったからですね！](https://developer.feedforce.jp/entry/2024/09/26/120000)

# 実際の挙動

# 使用技術

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/06/f80e593c8ae6b706d97282a26a438015.png?resize=880%2C589&ssl=1)

今回開発したシステムは、以下のような技術スタックを使用しています。まず、バックエンドフレームワークとしてNestJSを採用しました。これは既存のデプロイ環境との親和性を考慮した選択です。[@slack/web-apiライブラリ](https://www.npmjs.com/package/@slack/web-api)を利用することで、Slackとの連携を効率的に実装することができました。

Slack APIに関しては、主に3つの機能を活用しています。まず、Event Subscriptionsの `reactions.item_added` を使用してリアクションの検知を行います。次に、メッセージの取得には `conversations.history` でリアクション対象のメッセージを、`conversations.replies` でスレッド内の返信を取得します。また、`chat.postMessage` を使用してスレッドへの返信機能も実装しています。

Google Docs APIについては、サービスアカウントを利用して認証を行い、`documents.batchUpdate` を使用してドキュメントへのテキスト追記を実現しています。これにより、Slackでの会話内容を自動的にGoogle Docsに記録することが可能になりました。

最終的に、Google DocsとNotebook LMを連携させることで、Slackの内容を活用してNotebook LMを効率的に使用できるようになります。

# 処理フロー

処理フローは以下の流れになります。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/06/a1eb60c287231f1ad17189a093f7a178.png?resize=654%2C633&ssl=1)

## 初期設定とメッセージ送信

ユーザーがSlackにメッセージを送信すると、リアクション追加の準備が整います。

## Slack Events APIによる監視

バックエンドAPIでは、Slack Events APIを使用してSlackでの活動を監視します。具体的には：

-   `POST /api/slack/events` エンドポイントでSubscription Eventを受信
-   `reaction_added` イベントをキャッチして処理を開始（特定のリアクションの場合は処理）

## メッセージ情報の取得

リアクションが追加されると、システムは以下の処理を実行します：

-   Slack APIの `GET Slack Message` を呼び出し
-   Slack APIを用いてメッセージを取得
    -   `conversations.history` ：リアクションがつけられたメッセージ取得
    -   `conversations.replies`：リアクションをつけられたメッセージにスレッドがあればスレッドのメッセージも取得する

## Google Docs連携処理

取得したメッセージ情報をもとに、リアクション対応の処理を実行：

-   Google Docs更新処理を開始
-   Service Accountを使用した認証で安全にアクセス
-   ドキュメントの内容を更新

## 完了通知

処理完了後、Slackに結果を通知：

-   `chat.postMessage` でリアクション対象への結果通知
-   処理結果確認のメッセージ送信

# 構築

ここでは、実際のシステム構築について詳しく説明していきます。プロトタイプとはいえ、実用的な機能を備えたシステムを構築することができました。以下、主要なコンポーネントごとに実装の詳細を解説していきます。部分的なコードを解説用に添付します。最終的なコードはGitHubのリポジトリとブログの最後に完成版のコードを張ります。

## Google Docsの更新

Google Docsを操作するためにサービスアカウントを用いて認証を行っています。

サービスアカウントって何？

サービスアカウントとは、ユーザーがログインしなくても、プログラムがGoogleのサービスにアクセスできるようにする、特別なアカウントのことです。人間でいうと「あなたは〇〇のタスクを代わりにやってくれる、もう一人の自分」のような存在です。これにより、システムが裏側で黙々と処理を進めたり、決められたタイミングで情報を記録したりといった、自動化がスムーズに実現できるようになるんです。

Google Docsへの更新処理は、主に以下のような流れで実装しています：

まず、Google Cloud Platformでサービスアカウントを作成し、必要なAPIを有効化します。認証情報をJSONファイルとして取得し、これを使用してGoogle APIにアクセスします。NestJSからは、googleapisライブラリを使用してクライアントを作成し、適切なスコープ（documents、drive）を設定します。スコープとしては、以下を指定しています。

スコープ

説明

[https://www.googleapis.com/auth/documents](https://www.googleapis.com/auth/documents)

Googleドキュメント操作に必要なスコープ

[https://www.googleapis.com/auth/drive](https://www.googleapis.com/auth/drive)

Googleドライブ操作に必要なスコープ

サービスアカウントで割り振られたメールアドレスで操作したいGoogleドキュメントに、共有権限でドキュメントを共有します。

認証周りの処理はnest.jsの[Configuration](https://docs.nestjs.com/techniques/configuration)を通じて共通的に保持しています。

```
import { MessagingApiClient } from '@line/bot-sdk/dist/messaging-api/api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { docs_v1, google } from 'googleapis';

@Injectable()
export class EnvironmentsService {
  constructor(private configService: ConfigService) {}

  private googleDocs: docs_v1.Docs;
  get googleDosc() {
    if (this.googleDocs) return this.googleDocs;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.DOCS_CLIENT_EMAIL,
        private_key: process.env.DOCS_PRIVATE_KEY.replace(/\\n/g, '\n'), // 環境変数から読み込む場合は改行コードを修正
      },
      scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'], // 必要なスコープ
    });

    this.googleDocs = google.docs({
      version: 'v1',
      auth,
    });

    return this.googleDocs;
  }

  get GoogleDocsID(): string {
    return this.configService.get('DOCS_ID');
  }
}
```

実際のドキュメント操作では、`documents.batchUpdate`メソッドでDocsのトップに追記する形で更新します。この際、Slackから取得したメッセージの内容を適切なフォーマットに変換して追記します。

```
import { Injectable } from '@nestjs/common';

import { EnvironmentsService } from 'src/config/enviroments.service';

@Injectable()
export class DocsAccessService {
  constructor(private readonly env: EnvironmentsService) {}
  docs = this.env.googleDosc;
  
  async updateDoc(docId: string, text: string) {
    try {
      const response = await this.docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: [
            {
              insertText: {
                text: text,
                location: {
                  index: 1, // Insert at the beginning of the document
                },
              },
            },
          ],
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }
}
```

これにより、API経由で内容を自動的にGoogle Docsに記録し、後でNotebook LMで活用できる形式で保存することが可能になりました。

## Slackにボットメッセージを送信する

Slackからのメッセージ送信では、`Bot User OAuth Tokens`を使用します。これには、`channels:history`、`chat:write`、`reactions:read`の権限が必要です。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/06/f74498a7658d11b219bd6fa9a2476bb5.png?resize=880%2C1315&ssl=1)

まずは、先ほど取得したトークンを環境変数として参照できるようにします。

```
import { MessagingApiClient } from '@line/bot-sdk/dist/messaging-api/api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentsService {
  constructor(private configService: ConfigService) {}

  get SlackBotToken(): string {
    return this.configService.get('SLACK_BOT_TOKEN');
  }
}
```

メッセージの送信方法は主に2種類あり、`chat.postMessage`で通常のメッセージを、`chat.postEphemeral`で一時的なメッセージを送信できます。Slack Botの捜査には`@slack/web-api`を使用しています。

```
import { Injectable } from '@nestjs/common';
import { ReactionAddedEvent, WebClient } from '@slack/web-api';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { DocsAccessService } from 'src/utils/docs-access/docs-access.service';

@Injectable()
export class SlackService {
  private client: WebClient;
  constructor(
    private readonly env: EnvironmentsService,
    private readonly docService: DocsAccessService,
  ) {
    const token = this.env.SlackBotToken;
    this.client = new WebClient(token);
  }
  
  async postMessage(channelId: string, text: string, threadTs?: string): Promise<void> {
    try {
      console.log(`Attempting to post message to channel ${channelId}${threadTs ? ` in thread ${threadTs}` : ''}`);
      await this.client.chat.postMessage({
        channel: channelId,
        text: text,
        thread_ts: threadTs, // ここに返信したいメッセージのtsを指定
        // optional: icon_emoji: ':robot_face:', // カスタムアイコンを使いたい場合
        // optional: username: 'My Reaction Bot', // カスタムユーザー名を使いたい場合
      });
      // console.log('Message posted successfully:', result.ts);
    } catch (error) {
      console.error(`Failed to post message: ${error.message}`, error.stack);
      if (error.data) {
        console.error('Slack API error response:', error.data);
      }
      throw error;
    }
  }
  // あなただけに表示されています系メッセージ
  async postMessageEphemeral(channelId: string, text: string, threadTs: string, user: string): Promise<void> {
    try {
      console.log(`Attempting to post message to channel ${channelId}${threadTs ? ` in thread ${threadTs}` : ''}`);
      await this.client.chat.postEphemeral({
        channel: channelId,
        user: user,
        text: text,
        thread_ts: threadTs, // ここに返信したいメッセージのtsを指定
        // optional: icon_emoji: ':robot_face:', // カスタムアイコンを使いたい場合
        // optional: username: 'My Reaction Bot', // カスタムユーザー名を使いたい場合
      });
      // console.log('Message posted successfully:', result.ts);
    } catch (error) {
      console.error(`Failed to post message: ${error.message}`, error.stack);
      if (error.data) {
        console.error('Slack API error response:', error.data);
      }
      throw error;
    }
  }
}
```

二つのメソッドはほとんど同様の使い方ができます。明確な違いとしては、他のユーザーからの視認性・メッセージの修正の有無にあります。

特徴

chat.postMessage

chat.postEphemeral

用途

チャンネルやスレッドに永続的なメッセージを投稿する

特定のユーザーに対してのみ一時的な（非公開の）メッセージを投稿する

可視性

そのメッセージが投稿されたチャンネルの全員に見える

指定した user のみに見え、他のチャンネルメンバーには見えない

持続性

チャンネルの履歴に残り、後から参照可能

ユーザーがSlackクライアントを再起動したり、セッションを終了したりすると消える可能性がある（Slackの保証はないが、一時的と認識すべき）

宛先指定

channel パラメータでチャンネルIDまたはユーザーID（DMの場合）を指定

channel パラメータでチャンネルID、user パラメータでメッセージを表示するユーザーID を指定

スレッド返信

thread\_ts パラメータでスレッドに返信可能

thread\_ts パラメータでスレッド内の特定のユーザーに返信可能

APIスコープ

chat:write（通常）  
chat:write.public（パブリックチャンネルのみ）  
chat:write.private（プライベートチャンネルのみ）

chat:write または chat:write.ephemeral

メッセージの編集/削除

chat.update や chat.delete で後から編集・削除が可能

基本的に後から編集・削除する機能はない (表示されるかどうかはSlackクライアントに依存するため)

## リアクションイベントを受け付ける

Events Subscriptionsを設定することで、Slackでのリアクションなどのイベントを検知できるようになります。今回のプロトタイプでは、メッセージへのリアクション追加・削除を監視するため、`reaction_added`と`reaction_removed`イベントを使用しています。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/06/0a288a84c5c933335ebb6b85e6b81576.jpg?resize=880%2C550&ssl=1)

処理としては、URL検証用リクエスト`url_verification`とイベントコールバック`event_callback`を取得する処理が割り振られています。

```
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackBotSignatureGuard } from 'src/common/guard/slack-bot-signature/slack-bot-signature.guard';

import { SlackEvent } from '@slack/types';

@Controller('/api/slack/')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @UseGuards(SlackBotSignatureGuard)
  @Post('events')
  async handleSlackEvents(@Body() payload): Promise<string | { challenge: string }> {
    // SlackのイベントがURL検証リクエストの場合は、challengeを返す
    // これにより、Slackがイベントサブスクリプションを確認できるようになります
    if (payload.type === 'url_verification') {
      console.log('URL Verification Request handled.');
      return { challenge: payload.challenge };
    }
    const event: SlackEvent = payload.event;

    // イベントのタイプがサポートされていない場合はログを出力して終了
    // ここでは 'event_callback' タイプのみを処理する
    // 必要に応じて他のイベントタイプを追加することができます
    if (payload.type !== 'event_callback' || !event) {
      console.log('Unsupported Slack event type:', payload.type);
      return 'OK'; // Slackに200 OKを返却
    }

    // イベントの処理を行う
    if (event.type === 'reaction_added') {
      // リアクションが 'notebooklm' の場合のみ処理を行う
      if (event.reaction == 'notebooklm') {
        this.slackService.updateDataSource(event);
      }
      return 'OK'; // Slackに200 OKを返却
    }

    return 'OK'; // Slackに200 OKを返却
  }
}
```

リアクションイベントの型定義は[こちらのリファレンス](https://api.slack.com/events/reaction_added)を参照してください。リアクション追加判別後、特定のリアクションが追加されたときのみ処理を行うようにしています。リアクション追加イベントには、リアクション情報とリアクションがつけられた対象を特定するための情報（ts/channel）が含まれています。こちらを使用してメッセージを取得します。

## Slack スレッドに送信されたメッセージをすべて取得

```
import { Injectable } from '@nestjs/common';
import { ReactionAddedEvent, WebClient } from '@slack/web-api';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { DocsAccessService } from 'src/utils/docs-access/docs-access.service';

@Injectable()
export class SlackService {
  constructor(
    private readonly env: EnvironmentsService,
  ) {
    const token = this.env.SlackBotToken;
    this.client = new WebClient(token);
  }

  async getMessage(channelId: string, ts: string): Promise<string> {
    try {
      const result = await this.client.conversations.history({
        channel: channelId,
        latest: ts,
        limit: 1,
        inclusive: true,
      });
      if (result.messages && result.messages.length > 0) {
        const message = result.messages[0];
        
        if (message.thread_ts) {
          const repilesResponse = await this.client.conversations.replies({
            channel: channelId,
            ts: message.thread_ts,
          });

          const replies = repilesResponse.messages
            .map((reply) => {
              // TODO：BOTが返信したメッセージを除外する
              if (reply.bot_id) return '';
              return reply.text ? reply.text : '';
            })
            .join('\n');

          console.log('Replies retrieved successfully:', replies);
          return replies;
        }
        return message.text ? message.text : '';
      } else {
        console.warn('No messages found for the given ts');
        return null;
      }
    } catch (error) {
      console.error(`Failed to get message: ${error.message}`, error.stack);
      if (error.data) {
        console.error('Slack API error response:', error.data);
      }
      throw error;
    }
  }
}
```

Slackのメッセージ取得について、いくつかの重要な点と制限事項があります。リアクションイベント内に含まれるチャンネルIDとts（タイムスタンプ）で`conversations.history`を`limit:1`で実行することで親スレッドを特定します。これはスレッド内にてリアクションイベントが発生しても、取得できるのは親スレッドの情報というSlack API特有の仕様です。[API仕様書はこちらになります](https://api.slack.com/methods/conversations.history)。

スレッドを含むメッセージを完全に取得するためには、スレッド全体を別途取得する必要があります。BOTからの自動返信もメッセージとして含まれる可能性があり、これが実際の利用者の会話の流れを把握する際に不都合を生じさせることがあります。そのため、メッセージのフィルタリングや処理方法について、慎重な設計が必要となります。今回は、`conversations.replies`の結果でBOTの情報が含まれる場合はメッセージを除外しています。[API仕様書はこちらになります](https://api.slack.com/methods/conversations.replies)。

## リアクションイベントからGoogle Docsの取得までを一つの処理としてまとめる

ここまで、個別の処理に切り分けて実装していました。最終的にコントローラーから処理を受け取るサービスとして一つの関数にまとめていきます。

```
import { Injectable } from '@nestjs/common';
import { ReactionAddedEvent, WebClient } from '@slack/web-api';
import { EnvironmentsService } from 'src/config/enviroments.service';
import { DocsAccessService } from 'src/utils/docs-access/docs-access.service';

@Injectable()
export class SlackService {
  private client: WebClient;
  constructor(
    private readonly env: EnvironmentsService,
    private readonly docService: DocsAccessService,
  ) {
    const token = this.env.SlackBotToken;
    this.client = new WebClient(token);
  }

  async updateDataSource(event: ReactionAddedEvent): Promise<void> {
    const channelId = event.item.channel;
    const ts = event.item.ts;

    const message = await this.getMessage(channelId, ts);

    if (!message) {
      console.warn(`Message not found for channel ${channelId} and ts ${ts}`);
    }

    if (message != '') {
      const docId = this.env.GoogleDocsID;
      const text = `\n---\n${message}\n---\n`;
      await this.docService.updateDoc(docId, text);

      this.postMessage(
        channelId,
        `Notebook LMデータソースに追記しました: ${event.reaction} by <@${event.user}> \n\n${message}`,
        ts, // ここでスレッドのtsを指定
      );
    } else {
      this.postMessage(
        channelId,
        `現在テキストソースにしか対応していません。リアクションをつけたメッセージはテキストが空でした。`,
        ts, // ここでスレッドのtsを指定
      );
    }
  }

}
```

今回解説した関数を利用して、イベントを受け取りGoogle Docsの更新・SlackへのBotによるメッセージ送信までの実装が完了しました。

# エラーハンドリングと署名検証

エラーハンドリングと今後の課題について詳しく見ていきましょう。

## Slackの署名検証

[公式でも言及されていますが、アクセスがSlackからのものであることを確約する](https://api.slack.com/authentication/verifying-requests-from-slack)必要があります。nest.jsではGuardsという機能を用いて、コントローラーにアクセスする前に事前に検証をすることができます。処理自体は公式の情報をもとに構築してあります。

必要になるのは、Slack Developerで取得することができる`Signing Secret`です。

```
import { CanActivate, ExecutionContext, Injectable, RawBodyRequest, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { Observable } from 'rxjs';
import { EnvironmentsService } from 'src/config/enviroments.service';

@Injectable()
export class SlackBotSignatureGuard implements CanActivate {
  constructor(private readonly env: EnvironmentsService) {}
  private readonly MAX_TIMESTAMP_AGE_SECONDS = 300; // 5分 (リプレイアタック防止のため)

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RawBodyRequest<Request>>();

    const slackSignature = request.headers['x-slack-signature'] as string;
    const slackTimestamp = request.headers['x-slack-request-timestamp'] as string;
    const rawBody = (request as any).rawBody; // main.ts で bodyParser を設定して取得

    if (!slackSignature || !slackTimestamp || !rawBody) {
      console.error('署名検証が失敗しました: 必要なヘッダーまたはボディが不足しています。');
      throw new UnauthorizedException('署名検証が失敗しました: 必要なヘッダーまたはボディが不足しています。');
    }

    // リプレイアタック
    const timestamp = parseInt(slackTimestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000); // Unixタイムスタンプ (秒)

    if (Math.abs(currentTime - timestamp) > this.MAX_TIMESTAMP_AGE_SECONDS) {
      console.warn(
        // 日本語にしてエラーメッセージをわかりやすくする
        `Slackリクエストのタイムスタンプが古すぎるか、未来のものです。タイムスタンプ: ${timestamp}, 現在: ${currentTime}`,
      );
      throw new UnauthorizedException('Slackリクエストのタイムスタンプが古すぎるか、未来のものです。');
    }

    // Slackの署名検証
    const baseString = `v0:${timestamp}:${rawBody.toString()}`;

    const hmac = createHmac('sha256', this.env.SlackBotSigningSecret);
    hmac.update(baseString);
    const computedSignature = `v0=${hmac.digest('hex')}`;

    if (!timingSafeEqual(Buffer.from(computedSignature), Buffer.from(slackSignature))) {
      console.warn('Slackの署名が無効です。');
      throw new UnauthorizedException('Slackの署名が無効です。');
    }

    return true;
  }
}
```

## エラーハンドリング

プロトタイプとしての現在の実装では、基本的なエラーハンドリングのみを実装していますが、本番環境での運用を想定した場合、以下のような設計が必要になりそうです。

-   **Slack API関連のエラー処理:**
    -   レート制限への対応とリトライロジックの実装
    -   API接続タイムアウトの適切な処理
    -   チャンネルアクセス権限エラーの処理
-   **Google Docs API関連のエラー処理:**
    -   認証エラーの適切な処理とトークンリフレッシュ
    -   ドキュメント編集権限エラーのハンドリング
    -   API制限到達時の待機ロジック実装
-   **システム全般のエラー処理:**
    -   エラーログの構造化と保存
    -   重要なエラーの管理者への通知システム
    -   システムの状態回復メカニズムの実装

これらのエラーハンドリングを実装することで、システムの安定性と信頼性が大幅に向上します。また、運用面でのトラブルシューティングも容易になります。

# 今後の展望

今回のプロトタイプ開発を通じて、SlackからNotebook LMへのデータ連携という基本的な仕組みは構築できました。しかし、これはあくまで第一歩であり、より実用的で価値のあるシステムに発展させるための道筋がいくつか見えてきました。

## 機能拡張の方向性

**ファイル形式の対応拡大**

現在はテキストメッセージのみの対応ですが、Slackでは画像、PDF、スプレッドシートなど様々なファイルが共有されます。特に、画像からのOCR処理やPDFの内容抽出機能を追加することで、より包括的な情報収集が可能になります。Google Cloud VisionやDocument AIとの連携により、これらの実装は十分現実的です。

**リアクション種別による分類機能**

現在は単一のリアクション（`:notebooklm:`）のみに対応していますが、複数のリアクションを使い分けることで、情報を自動分類できるようになります。例えば：

-   `:important:` → 重要な情報として優先度高でマーク
-   `:todo:` → タスクリストとして別ドキュメントに記録
-   `:knowledge:` → ナレッジベース用ドキュメントに整理

この仕組みにより、単なるデータ収集から、目的別の情報整理システムへと発展させることができます。

**AI要約機能の統合**

現在はSlackのメッセージをそのままGoogle Docsに転記していますが、長いスレッドや議論については、Azure OpenAIやAnthropic APIを活用した要約機能を追加したいと考えています。これにより、本質的な内容のみを抽出してNotebook LMに渡すことが可能になり、より効率的な情報活用が実現できます。

## システム改善の取り組み

**パフォーマンスとスケーラビリティの向上**

現在の同期処理から非同期処理への移行は必須です。Redis Queueやbull.jsを使用したジョブキューイングシステムを導入し、大量のメッセージ処理にも対応できる構成に変更予定です。また、Google Docsの容量制限を考慮し、定期的なドキュメント分割機能も検討しています。

**ユーザーエクスペリエンスの改善**

現在のシンプルなBot返信から、より詳細なフィードバック機能への拡張を計画しています。処理状況の可視化、エラー時の分かりやすい説明、さらにはSlashコマンドを使った手動操作機能なども追加したいところです。

**監視とメンテナンス機能**

本格運用を見据えて、システムヘルスチェック機能やログ分析ダッシュボードの構築も重要です。特に、API使用量の監視やエラー傾向の分析機能により、安定したサービス提供を目指します。

## 技術的挑戦

**Notebook LM APIの活用**

現在はGoogle Docsを経由した間接的な連携ですが、今後Notebook LM APIが公開された際には、より直接的な統合を検討したいと思います。これにより、リアルタイムでの質問応答機能や、自動的なインサイト生成なども実現可能になるかもしれません。

**マルチプラットフォーム対応**

Slack以外のコミュニケーションツール（Microsoft Teams、Discord、Mattermost等）への対応も視野に入れています。共通のインターフェースを設計することで、組織の使用ツールに関係なく同様の価値を提供できるシステムを目指します。

**セキュリティとコンプライアンス強化**

企業利用を考慮し、データの暗号化、アクセス権限の細分化、監査ログの充実などを進める必要があります。特に、個人情報や機密情報を含む可能性のあるSlackメッセージの取り扱いについては、慎重な設計が求められます。

## おわりに

今回開発したプロトタイプは、AIを活用した情報管理の可能性を示す小さな一歩でした。しかし、ここから得られた知見と技術基盤を活かし、より実用的で価値のあるシステムへと発展させていきたいと考えています。

特に、現在のAIブームの中で、単にAIツールを使うだけでなく、既存のワークフローにAIを自然に統合する仕組みの重要性を改めて感じました。SlackのようなコミュニケーションツールとNotebook LMのような分析ツールを橋渡しすることで、日常的な業務の中で自然にナレッジが蓄積され、活用される環境を作ることができそうです。

今後も継続的に改善を重ね、最終的には「気がついたら素晴らしいナレッジベースができていた」と感じられるような、透明で価値のあるシステムを目指していきます。皆さんも、ぜひ様々なAIサービスを組み合わせて、独自の価値を生み出すシステム構築にチャレンジしてみてください！

AIが執筆した部分とプロンプト

AIが執筆した部分としては「処理フロー」「Slackにボットメッセージを送信する：表」「今後の展望～おわりに」になります。

「処理フロー」に関しては、Claudeを使用してSVG形式で出力しています。以下のプロンプトを使用してMarmaid形式の情報を出力して、SVGに変換してFigmaで成形しています。

```
Slack・バックエンドAPI・Google Docs・Notebook LMの連携フロー図を描いてほしい 
- from Slack to backend callback /api/slack/events(POST) : Subscription Event reacttion add 
- from backend to Slack API GET Slack Message 
- from backend to Google Docs : update Docs use service account Google Docs 
- from backend to Slack POST Slack Message target reacttion target
```

「Slackにボットメッセージを送信する：表」に関しては、Geminiを使用して出力しています。コンテンツを箇条書きで書いて変換にAIを使用しています。

「今後の展望～おわりに」に関しては、Geminiを利用しています。コンテンツを執筆し、PDFとしてエクスポートして、入力しています。

```
内容のファクトチェックと「今後の展望」・「おわりに」を文体を合わせて執筆してください。

add PDF
```

内容を確認して、納得がいったのでそのまま採用しました。

弊社ではAI活用頑張ってますので、こちらも併せてチェック！！

[![PRレビューを自動化しよう！GitHub Copilot × システムプロンプトの基本](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/05/d198041283864ff33f62da4a570840a9-1.png?resize=520%2C300&ssl=1)2025-05-31PRレビューを自動化しよう！GitHub Copilot × システムプロンプトの基本](https://tech-lab.sios.jp/archives/47820)[![GitHub Copilotをチーム開発で使いこなす！システムプロンプト設定方法](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/05/d198041283864ff33f62da4a570840a9.png?resize=520%2C300&ssl=1)2025-05-30GitHub Copilotをチーム開発で使いこなす！システムプロンプト設定方法](https://tech-lab.sios.jp/archives/47814)ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-47891)[役に立たなかった](#afb-post-47891)  
  
0人がこの投稿は役に立ったと言っています。