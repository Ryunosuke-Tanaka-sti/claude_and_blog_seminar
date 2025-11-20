---
title: "Claude Code一時ファイルからSkillsへ：ビジネスロジック抽出の実践ガイド | SIOS Tech. Lab"
url: https://tech-lab.sios.jp/archives/50202
image: https://tech-lab.sios.jp/wp-content/uploads/2025/11/6c9dbb535721c83a7d4155d4cb3b1980.png
extracted_at: 2025-11-19T12:58:49.341Z
---

# Claude Code一時ファイルからSkillsへ：ビジネスロジック抽出の実践ガイド | SIOS Tech. Lab

**目次**

-   [1はじめに](#hajimeni)
-   [2TL;DR](#TLDR)
-   [3こんな人に読んでほしい](#konna_renni_dundehoshii)
-   [4tmpディレクトリのプロジェクト内設定](#tmpdirekutorinopurojekuto_nei_she_ding)
    -   [4.1デフォルトの問題点](#deforutono_wen_ti_dian)
    -   [4.2解決策：リポジトリ内tmpの設定](#jie_jue_ceripojitori_neitmpno_she_ding)
    -   [4.3CLAUDE.mdに指示を追加](#CLAUDEmdni_zhi_shiwo_zhui_jia)
    -   [4.4この設定のメリット](#kono_she_dingnomeritto)
-   [5プロジェクト構成とtmpの配置](#purojekuto_gou_chengtotmpno_pei_zhi)
    -   [5.1ディレクトリ構造](#direkutori_gou_zao)
    -   [5.2なぜapplication/tools/tmp/なのか？](#nazeapplicationtoolstmpnanoka)
    -   [5.3この構造の利点](#kono_gou_zaono_li_dian)
    -   [5.42つのアプローチ](#2tsunoapurochi)
-   [6実装されたCLIコマンド一覧](#shi_zhuangsaretaCLIkomando_yi_lan)
    -   [6.1投稿（posts）操作](#tou_gao_posts_cao_zuo)
    -   [6.2カテゴリ（categories）操作](#kategoricategories_cao_zuo)
    -   [6.3ハッシュタグ（hashtags）操作](#hasshutaguhashtags_cao_zuo)
    -   [6.4予約投稿（scheduled-posts）操作](#yu_yue_tou_gao_scheduled-posts_cao_zuo)
    -   [6.5データ検証（validate）操作](#deta_jian_zheng_validate_cao_zuo)
    -   [6.6Skillsで提供される機能の特徴](#Skillsde_ti_gongsareru_ji_nengno_te_zheng)
    -   [6.7Skillsで提供されていない機能（→tmpスクリプトで補完）](#Skillsde_ti_gongsareteinai_ji_neng_tmpsukuriputode_bu_wan)
-   [7tmpスクリプトの具体例](#tmpsukuriputono_ju_ti_li)
    -   [7.1例1: ハッシュタグチェックスクリプト](#li1_hasshutaguchekkusukuriputo)
    -   [7.2例2: ハッシュタグ削除スクリプト](#li2_hasshutagu_xue_chusukuriputo)
-   [8ビジネスロジック抽出の実装手順](#bijinesurojikku_chou_chuno_shi_zhuang_shou_shun)
    -   [8.1頻出パターンの観察](#pin_chupatanno_guan_cha)
    -   [8.2ビジネスロジックの抽出事例](#bijinesurojikkuno_chou_chu_shi_li)
        -   [8.2.1事例1: validate orphaned → Skill機能化](#shi_li1_validate_orphaned_Skill_ji_neng_hua)
        -   [8.2.2事例2: tmpからOperations層への抽出](#shi_li2_tmpkaraOperations_cengheno_chou_chu)
        -   [8.2.3事例3: 段階的な拡張プロセス](#shi_li3_duan_jie_dena_kuo_zhangpurosesu)
-   [9週次レビューの実践](#zhou_cirebyuno_shi_jian)
    -   [9.1頻出パターンの分析](#pin_chupatanno_fen_xi)
    -   [9.2docs/research/への記録](#docsresearchheno_ji_lu)
    -   [9.3UIを作るタイミングの判断](#UIwo_zuorutaiminguno_pan_duan)
-   [10環境セットアップ](#huan_jingsettoappu)
    -   [10.1Python環境のセットアップ（推奨）](#Python_huan_jingnosettoappu_tui_jiang)
    -   [10.2TypeScript環境のセットアップ](#TypeScript_huan_jingnosettoappu)
    -   [10.3避けるべき言語](#bikerubeki_yan_yu)
    -   [10.4CLAUDE.mdに言語設定を追加](#CLAUDEmdni_yan_yu_she_dingwo_zhui_jia)
    -   [10.5型ヒントを使う理由](#xinghintowo_shiu_li_you)
-   [11tmpスクリプトを保存する習慣](#tmpsukuriputowo_bao_cunsuru_xi_guan)
    -   [11.1基本方針](#ji_ben_fang_zhen)
    -   [11.2Skill拡張の判断基準](#Skill_kuo_zhangno_pan_duan_ji_zhun)
-   [12まとめ](#matome)
    -   [12.1tmpからCLI機能への昇格プロセス](#tmpkaraCLI_ji_nengheno_sheng_gepurosesu)
    -   [12.2実践のポイント](#shi_jiannopointo)
    -   [12.3次のステップ](#cinosuteppu)
-   [13参考リンク](#can_kaorinku)
    -   [13.1公式ドキュメント](#gong_shidokyumento)
    -   [13.2シリーズ記事](#shirizu_ji_shi)
    -   [13.3関連ブログ](#guan_lianburogu)

## はじめに

ども！Claude Codeにべったりな龍ちゃんです。

[前回の記事「Claude Codeの一時ファイルで爆速ビジネスロジック検証：UI不要で要件を発見する方法」](https://tech-lab.sios.jp/archives/50208)で、tmpスクリプトが「自然言語から生まれた純粋な要件」であることを説明しました。

本記事では、**実際にどうやってtmpスクリプトを観察し、ビジネスロジックを抽出し、CLI機能として昇格させるか**を、具体的なコード例とともに解説します。

## TL;DR

この記事で分かること：

-   **tmpディレクトリのプロジェクト内設定方法**
    -   デフォルトの問題点（OSの/tmpに生成される）
    -   CLAUDE.mdでの設定方法
    -   tools/配下に配置するメリット
-   **プロジェクト構成とtmpの配置**
    -   4層構造の実装（公式SDK → 自作Client → CLI → Skill）
    -   tmpスクリプトがCLIツールを活用する仕組み
-   **実装されたCLIコマンド一覧**
    -   posts, categories, hashtags, scheduled-posts, validate操作
    -   Skillsで提供される機能 vs tmpで補完される機能
-   **tmpスクリプトの具体例**
    -   ハッシュタグチェック、データクリーニングの実装
    -   DRY RUNモードによる安全性確保
-   **ビジネスロジック抽出の実装手順**
    -   tmpから本体コードへの昇格プロセス
    -   Operations層、CLI層、Skill層の実装
-   **週次レビューの実践**
    -   頻出パターンの分析コマンド
    -   docs/research/への記録方法
-   **環境セットアップ**
    -   Python/uv環境の構築
    -   TypeScript環境の構築
    -   型ヒントによる品質向上

**重要な前提条件:**

-   「Claude Code: 公式MCPを補完するSkills設計パターン」と前回の記事を読んでいる
-   Claude Code Skillsの基本を理解している

## こんな人に読んでほしい

✅ 前回の記事を読んで「実際にどう実装するの？」が気になった人  
✅ tmpスクリプトの観察を始めたい人  
✅ ビジネスロジック抽出の具体的な手順を知りたい人  
✅ tmpからCLI機能への昇格プロセスを学びたい人  
✅ 環境セットアップ（Python/uv, TypeScript）の方法を知りたい人

## tmpディレクトリのプロジェクト内設定

### デフォルトの問題点

Claude Codeは設定なしだとOSの`/tmp`ディレクトリにスクリプトを生成してしまいます。これだと：

-   ❌ リポジトリ外なので管理しにくい
-   ❌ OSの再起動で消える可能性がある
-   ❌ 他の開発者と共有できない
-   ❌ 履歴が残らない

### 解決策：リポジトリ内tmpの設定

```
# tmpディレクトリを作成
mkdir -p application/tools/tmp

# .gitignoreでtmpの中身を除外（任意）
echo "application/tools/tmp/*.py" >> .gitignore
# または、観察目的で意図的にコミットする場合は除外しない
```

### CLAUDE.mdに指示を追加

リポジトリルートの`CLAUDE.md`に以下を追加：

````
## Temporary Scripts Directory

**IMPORTANT**: Always save temporary Python scripts to `application/tools/tmp/` directory.

When generating temporary scripts:
1. Place them in `application/tools/tmp/`
2. Use descriptive filenames
3. Include docstrings

Example:
```python
# application/tools/tmp/validate_data_integrity.py
"""Temporary script to validate data integrity."""
```
````

### この設定のメリット

-   ✅ tmpスクリプトがリポジトリ内で管理される
-   ✅ tools/配下なので同じ依存関係（pyproject.toml）を使える
-   ✅ チーム全体で観察可能
-   ✅ gitで履歴管理できる（必要に応じて）

## プロジェクト構成とtmpの配置

### ディレクトリ構造

実際のプロジェクト構成を見てみましょう：

```
application/tools/
├── src/
│   └── supabase_client/          # 自作Client（ビジネスロジック）
│       ├── models.py              # データモデル定義
│       ├── operations/            # テーブル操作クラス
│       │   ├── posts.py
│       │   ├── categories.py
│       │   ├── hashtags.py
│       │   └── ...
│       └── cli.py                 # CLIコマンド実装
├── tmp/                           # tmpスクリプト（ここ重要！）
│   ├── merge_duplicate_categories.py
│   ├── validate_orphaned_posts.py
│   ├── check_hashtags.py
│   ├── remove_hashtags_from_posts.py
│   └── ...
└── pyproject.toml                 # 依存関係管理
```

### なぜ`application/tools/tmp/`なのか？

tmpを`tools/`配下に配置することで、**tmpスクリプトがCLIツールとして実装された機能をそのまま利用できる**んです。

実際のtmpスクリプトの中身を見てみると：

```
# application/tools/tmp/check_hashtags.py
import subprocess
import json

def get_all_post_uuids():
    """Get all post UUIDs from the database."""
    result = subprocess.run(
        ["uv", "run", "db", "posts", "list", "--limit", "1000"],  # ← CLIコマンドを呼び出す
        capture_output=True,
        text=True,
        check=True,
    )
    # Extract UUIDs from output
    # ...

def get_post_details(uuid):
    """Get post details by UUID."""
    result = subprocess.run(
        ["uv", "run", "db", "posts", "get", uuid],  # ← CLIコマンドを呼び出す
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(result.stdout)
```

### この構造の利点

-   ✅ tmpスクリプトがCLIツール（`uv run db`コマンド）を組み合わせて使える
-   ✅ 依存関係（pyproject.toml）を共有
-   ✅ Claude Codeが生成するスクリプトと本体コードが同じ環境で動作
-   ✅ tmpで検証したロジックをOperations層に抽出しやすい

### 2つのアプローチ

実際には、tmpスクリプトの実装方法には2つのパターンがあります：

**1\. CLIコマンド経由**（現在の実装）:

-   `subprocess.run(["uv", "run", "db", ...])`でCLIを呼び出す
-   基本操作を組み合わせて複雑な処理を実現
-   Claude Codeが自然に生成するパターン

**2\. 直接インポート**（より進んだ段階）:

-   `from src.supabase_client import SupabaseClient`で直接インポート
-   Operations層のメソッドを直接呼び出す
-   より複雑なロジックを実装する際に有用

つまり、tmpスクリプトは「使い捨て」じゃなくて、**プロジェクトの一部として機能している**んです。

これが、tmpスクリプトから本体機能への昇格がスムーズにできる理由でもあります。tmpスクリプトで検証したロジックを、そのままOperations層（`src/supabase_client/operations/`）に移せばいいだけですから。

## 実装されたCLIコマンド一覧

理解を助けるために、実際に実装されているCLIコマンドを紹介します。tmpスクリプトは、これらのコマンドを組み合わせて複雑な処理を実現します。

### 投稿（posts）操作

```
# 投稿一覧取得
uv run db posts list [--limit N] [--blog-url URL] [--pattern N] [--category NAME] [--hashtag NAME]

# 投稿詳細取得
uv run db posts get <UUID>

# 投稿作成
uv run db posts create --blog-url <URL> --pattern <1-3> --content <TEXT>

# 投稿更新
uv run db posts update <UUID> [--content TEXT] [--pattern N]

# 投稿削除
uv run db posts delete <UUID>

# ブログURL一覧
uv run db posts urls

# 統計情報
uv run db posts stats
```

### カテゴリ（categories）操作

```
# カテゴリ一覧
uv run db categories list

# カテゴリ作成
uv run db categories create <NAME>

# 統計情報
uv run db categories stats

# 重複検出
uv run db categories find-duplicates

# カテゴリマージ
uv run db categories merge --to <ID> --from <IDs> [--dry-run]
```

### ハッシュタグ（hashtags）操作

```
# ハッシュタグ一覧
uv run db hashtags list

# ハッシュタグ作成
uv run db hashtags create <NAME>

# 統計情報
uv run db hashtags stats

# 重複検出
uv run db hashtags find-duplicates

# ハッシュタグマージ
uv run db hashtags merge --to <ID> --from <IDs> [--dry-run]
```

### 予約投稿（scheduled-posts）操作

```
# 予約投稿一覧
uv run db scheduled-posts list [--status <STATUS>] [--today] [--limit N]

# 予約投稿詳細
uv run db scheduled-posts get <UUID>

# 予約投稿作成
uv run db scheduled-posts create --text <TEXT> --scheduled-date <ISO8601> [--source-post-uuid <UUID>]

# 予約投稿更新
uv run db scheduled-posts update <UUID> [--status STATUS] [--scheduled-date DATE]

# 予約投稿削除
uv run db scheduled-posts delete <UUID>
```

### データ検証（validate）操作

```
# 孤立レコード検出
uv run db validate orphaned
```

### Skillsで提供される機能の特徴

-   ✅ **基本CRUD操作**: 単一レコードの作成・取得・更新・削除
-   ✅ **フィルタ機能**: カテゴリ、ハッシュタグ、ブログURLでの絞り込み
-   ✅ **統計情報**: 投稿数のカウント、使用状況の可視化
-   ✅ **データクリーニング**: 重複検出、孤立レコード検出、マージ機能

### Skillsで提供されていない機能（→tmpスクリプトで補完）

-   ❌ **複雑な組み合わせ処理**: 複数コマンドの連鎖実行
-   ❌ **カスタムフィルタロジック**: 独自の条件での抽出
-   ❌ **一括更新処理**: 条件に基づいた複数レコードの更新
-   ❌ **クロスチェック**: 複数テーブル横断での整合性チェック

この「基本操作」と「組み合わせ処理」の境界が、tmpスクリプトが生成される理由です。

## tmpスクリプトの具体例

理論だけでは分かりにくいので、実際のリポジトリにあるtmp/スクリプトを紹介します。

### 例1: ハッシュタグチェックスクリプト

**生成された背景**: 「全投稿のハッシュタグの有無を確認したい」というリクエスト

```
# application/tools/tmp/check_hashtags.py
import subprocess
import json
import re

def get_all_post_uuids():
    result = subprocess.run(
        ["uv", "run", "db", "posts", "list", "--limit", "1000"],
        capture_output=True,
        text=True,
        check=True,
    )
    # UUIDを正規表現で抽出
    uuids = []
    for line in result.stdout.split('\n'):
        uuid_match = re.search(r'([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', line)
        if uuid_match:
            uuids.append(uuid_match.group(1))
    return uuids

def has_hashtag(text):
    return bool(re.search(r'#\w+', text))

# メイン処理: 全投稿をチェックして分類
for uuid in get_all_post_uuids():
    post = get_post_details(uuid)
    if has_hashtag(post['content_text']):
        with_hashtags.append(post)
```

**このスクリプトから分かること**:

1.  **基本操作の組み合わせ**: `db posts list` → 処理 → `db posts get`
2.  **ビジネスルール**: 「ハッシュタグあり」= `#`で始まる単語が含まれる
3.  **CLIツールの活用**: `subprocess.run()`でCLIコマンドを呼び出す

tmpスクリプトは**CLIツールを組み合わせて複雑な処理を実現**していました。

### 例2: ハッシュタグ削除スクリプト

**生成された背景**: 「投稿本文からハッシュタグを削除したい」（データクリーニング要求）

```
# application/tools/tmp/remove_hashtags_from_posts.py
import re
import subprocess
import sys

def remove_hashtags(text):
    # 日本語対応の正規表現でハッシュタグを削除
    cleaned = re.sub(r'#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+', '', text)
    # Clean up multiple spaces
    cleaned = re.sub(r'\s+', ' ', cleaned)
    # Remove trailing/leading whitespace
    cleaned = cleaned.strip()
    return cleaned

# DRY RUNモードで安全確認
execute = '--execute' in sys.argv

for post in posts_with_hashtags:
    new_content = remove_hashtags(post['content_text'])
    if execute:
        subprocess.run([
            "uv", "run", "db", "posts", "update",
            post['uuid'], "--content", new_content
        ])
    else:
        print(f"DRY RUN: Would update {post['uuid']}")
        print(f"  OLD: {post['content_text'][:100]}...")
        print(f"  NEW: {new_content[:100]}...")
```

**このスクリプトから分かること**:

1.  **ビジネスルールの具体化**: ハッシュタグ削除の正規表現（日本語対応）
2.  **安全性の配慮**: `--execute`フラグによるDRY RUNモード
3.  **一括処理パターン**: 取得 → 加工 → 更新

**重要な発見**: 同じロジック（`remove_hashtags()`）が複数のスクリプトで再利用される → **これこそ抽出すべきビジネスロジック**

## ビジネスロジック抽出の実装手順

### 頻出パターンの観察

簡単な分析で、何が必要な機能かが見えてきました：

```
# tmp/内のスクリプトを名前でカウント
ls application/tools/tmp/*.py | xargs -n1 basename | sort | uniq -c | sort -nr
```

**結果**:

```
5 validate_orphaned_posts.py
4 bulk_update_scheduled_posts.py
3 merge_duplicate_categories.py
2 analyze_hashtag_stats.py
1 export_posts_csv.py
```

**解釈**:

-   5回生成 → **週1回以上使う** → Skillに組み込むべき
-   3-4回 → **定期的に使う** → Skill機能追加候補
-   1-2回 → tmpのままで良い（稀なケース）

データが教えてくれました。「validate\_orphaned\_posts.pyは必要な機能だ」と。

### ビジネスロジックの抽出事例

#### 事例1: validate orphaned → Skill機能化

**tmpの内容**（5回生成）:

```
# tmp/validate_orphaned_posts.py の処理フロー
1. uv run db posts list（全投稿取得）
2. カテゴリ未設定の投稿をフィルタ
3. 結果をリスト表示
```

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

#### 事例2: tmpからOperations層への抽出

tmpスクリプトから抽出されたビジネスロジックが、どのように本体コードに統合されるかを見てみましょう。

**tmpスクリプトで見つかったパターン** → **抽出された実装**:

```
# application/tools/src/supabase_client/operations/hashtags.py
"""Hashtags table operations"""

from supabase import Client
from ..models import Hashtag

class HashtagOperations:
    def __init__(self, client: Client):
        self.client = client
        self.table = "hashtags"

    def list(self, limit: int = 100, offset: int = 0) -> list[Hashtag]:
        result = (
            self.client.table(self.table)
            .select("*")
            .order("hashtag_name")
            .range(offset, offset + limit - 1)
            .execute()
        )
        return [Hashtag(**item) for item in result.data]

    def count_posts_by_hashtag(self) -> list[dict]:
        """
        Count posts for each hashtag

        Returns:
            [
                {"hashtag_id": 1, "hashtag_name": "#AI", "post_count": 15},
                ...
            ]
        """
        result = (
            self.client.table("post_hashtags")
            .select("hashtag_id, hashtags(hashtag_name)")
            .execute()
        )

        # Count posts per hashtag
        hashtag_counts: dict[int, dict] = {}
        for item in result.data:
            tag_id = item["hashtag_id"]
            tag_name = item["hashtags"]["hashtag_name"] if item.get("hashtags") else None
            if tag_id not in hashtag_counts:
                hashtag_counts[tag_id] = {
                    "hashtag_id": tag_id,
                    "hashtag_name": tag_name,
                    "post_count": 0,
                }
            hashtag_counts[tag_id]["post_count"] += 1

        # Sort by post count descending
        return sorted(
            hashtag_counts.values(),
            key=lambda x: x["post_count"],
            reverse=True,
        )
```

**CLIコマンドとしての公開**:

```
# application/tools/src/supabase_client/cli.py
import click
from .client import SupabaseClient
from .operations import HashtagOperations

@cli.group()
def hashtags():
    """Hashtag operations"""
    pass

@hashtags.command("list")
@click.option("--limit", type=int, default=10)
def hashtags_list(limit: int):
    client = SupabaseClient()
    ops = HashtagOperations(client.get_client())
    results = ops.list(limit=limit)

    for hashtag in results:
        click.echo(f"ID: {hashtag.hashtag_id}, Name: {hashtag.hashtag_name}")

@hashtags.command("stats")
def hashtags_stats():
    """Show hashtag usage statistics"""
    client = SupabaseClient()
    ops = HashtagOperations(client.get_client())
    stats = ops.count_posts_by_hashtag()

    click.echo("Hashtag Usage Statistics:")
    for item in stats:
        click.echo(f"  {item['hashtag_name']}: {item['post_count']} posts")
```

**tmpスクリプト → 本体実装の流れ**:

1.  **tmp/check\_hashtags.py**: ハッシュタグの集計ロジックを発見
2.  **Operations層**: `count_posts_by_hashtag()` としてビジネスロジック化
3.  **CLI層**: `db hashtags stats` コマンドとして公開
4.  **Skill層**: Claude Codeから自然言語で操作可能に

この4層構造により、tmpスクリプトで検証したロジックが、段階的に本体機能へ昇格していきます。

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/11/part3-07-four-layer-implementation.png?resize=880%2C616&ssl=1)

#### 事例3: 段階的な拡張プロセス

tmp観察を続けることで、自然に機能が拡張されていきました：

**Phase 1（初期実装）**: 基本CRUDのみ

-   list, get, create, update, delete

**tmp観察（1週間）**:

-   カテゴリ・ハッシュタグでのフィルタ要求が頻出
-   統計情報の要求も多い

**Phase 2（拡張・4時間）**: 複雑なクエリ追加

-   `--category`, `--hashtag` フィルタオプション
-   `stats` コマンド（集計）
-   中間テーブル操作（add-categories, add-hashtags）

**tmp観察（さらに1週間）**:

-   merge系スクリプトが頻出
-   データクリーニングの需要が明確に

**Phase 3（さらに拡張・3時間）**: データクリーニング機能

-   `find-duplicates` コマンド
-   `merge --dry-run` コマンド
-   `validate orphaned` コマンド

→ **tmpの観察が、段階的な機能拡張を自然に導いた**

**合計開発時間**: 15時間（8 + 4 + 3）でデータベース管理システムが完成（実測例として参考）

## 週次レビューの実践

### 頻出パターンの分析

私は毎週金曜日、こんな習慣をつけました：

```
# 頻繁に生成されるスクリプト
ls application/tools/tmp/*.py | xargs -n1 basename | sort | uniq -c | sort -nr
```

**観察ポイント**:

-   3回以上生成 → Skill機能追加候補
-   毎回同じロジック → ビジネスルールが固まっている
-   微妙に違うパラメータ → オプション化すべき

### docs/research/への記録

tmp観察ログの例（実際に記録していたもの）：

```
# tmp観察ログ: 2024-11-15

## 今週の傾向
- validate_orphaned_posts.py: 5回生成（先週3回）
- merge_duplicate_categories.py: 3回生成（新規）
- bulk_update_scheduled_posts.py: 4回生成（継続）

## 発見
- 孤立投稿の検証は定期作業（毎日1回）
- カテゴリ重複チェックの需要が増加
- 一括更新のロジックが固まってきた

## ビジネスルール（tmpから抽出）
- 重複判定: 類似度90%以上
- マージ優先順位: 投稿数 > 作成日時 > UUID
- 孤立投稿: カテゴリ未設定 or ハッシュタグ0個

## アクション
- [ ] db validate orphaned コマンド追加
- [ ] db categories find-duplicates コマンド追加
- [ ] db categories merge --dry-run 実装
```

この記録が、Phase 2-3の機能拡張につながりました。

### UIを作るタイミングの判断

**UIが必要になる条件**:

1.  ✅ 利用者が複数（チームや社内共有）
2.  ✅ ビジネスロジックが固まっている
3.  ✅ tmpスクリプトの生成が停止（安定稼働）

**UIを作る前に確認すること**:

-   tmpの観察を2-4週間継続
-   ビジネスルールが変わらないことを確認
-   操作フローがtmpから明確に見える

私の場合、まだUIは作っていません。Claude Codeで十分だからです（個人利用のため）。

## 環境セットアップ

tmpスクリプトの品質を高めるために、Claude Codeがコードを書きやすい環境を整えましょう。

### Python環境のセットアップ（推奨）

**なぜPythonなのか**:

-   Claude Codeが最も得意な言語
-   データ処理・バッチ処理に適している
-   スクリプト実行が簡単（`uv run python tmp/script.py`）

**uv環境のセットアップ**:

```
# uvのインストール
curl -LsSf https://astral.sh/uv/install.sh | sh

# プロジェクト初期化と依存関係追加
uv init
uv add click pandas requests

# tmpスクリプトを実行
uv run python application/tools/tmp/script.py
```

**uvのメリット**: pipの10-100倍速い / 仮想環境自動管理 / Python自動インストール

**詳細な環境構築**: [uvで解決！Pythonモノレポの依存関係管理【2025年版】](https://tech-lab.sios.jp/archives/50151)を参照

### TypeScript環境のセットアップ

**TypeScript/JavaScriptが適しているケース**:

-   Node.js環境でのスクリプトに適している
-   フロントエンド・API連携処理に向く

```
# TypeScript環境のセットアップ
npm init -y
npm install -D typescript ts-node @types/node
npx tsc --init

# tmpスクリプト用の設定
# tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["application/tools/tmp/**/*"]
}

# tmpスクリプトを実行
npx ts-node application/tools/tmp/script.ts
```

### 避けるべき言語

-   ❌ シェルスクリプト（bash）: Claude Codeが複雑なロジックを書きにくい
-   ❌ Ruby, Perl: サポートは良いが、Pythonの方が安定
-   ❌ Java: セットアップが重く、tmpスクリプトには不向き

### CLAUDE.mdに言語設定を追加

```
## Development Language Preferences

**Primary Language: Python 3.12+**
- Use `uv run python tmp/script.py` for execution
- Leverage type hints for better code generation

**Avoid**: Shell scripts for complex logic (use Python subprocess instead)
```

### 型ヒントを使う理由

Claude Codeは型情報があると、より高品質なコードを生成します。

```
# ❌ 型ヒントなし（Claude Codeが推測する必要がある）
def get_posts(limit):
    return client.posts.list(limit=limit)

# ✅ 型ヒント付き（Claude Codeが正確に理解）
def get_posts(limit: int) -> list[Post]:
    return client.posts.list(limit=limit)
```

**このセットアップのメリット**:

-   ✅ tmpスクリプトの生成品質が向上
-   ✅ エラーが減り、実行成功率が上がる
-   ✅ tmpから本体コードへの移行がスムーズ
-   ✅ 型情報により、ビジネスロジックが明確になる

## tmpスクリプトを保存する習慣

### 基本方針

-   Claude Codeが生成したスクリプトを削除しない
-   `application/tools/tmp/`に保存して観察する
-   実行後も残しておく（頻度分析のため）

### Skill拡張の判断基準

-   3回以上生成 → 機能追加候補
-   ロジック固定 → Skill化
-   1-2回のみ → tmpのまま保持

## まとめ

### tmpからCLI機能への昇格プロセス

![](https://i0.wp.com/tech-lab.sios.jp/wp-content/uploads/2025/11/part3-06-tmp-to-cli-process-1.png?resize=880%2C660&ssl=1)

この5ステップのプロセスにより、tmpスクリプトが段階的に本体機能へ昇格していきます：

1.  **tmpスクリプト生成**: Claude Codeが自然言語から生成
2.  **tmp観察**: 週次レビューで頻出パターンを分析
3.  **ビジネスロジック抽出**: Operations層に実装
4.  **CLIコマンド化**: CLI層で公開（`uv run db ...`）
5.  **Skill登録**: 自然言語で操作可能に

### 実践のポイント

**環境設定**:

-   ✅ tmpディレクトリをリポジトリ内に配置
-   ✅ CLAUDE.mdで明示的に指示
-   ✅ Python/uv環境を整備

**観察と分析**:

-   ✅ 週次レビューで頻出パターンを把握
-   ✅ docs/research/に記録
-   ✅ 3回以上生成 → 機能追加候補

**段階的な拡張**:

-   ✅ Phase 1: 基本CRUD
-   ✅ Phase 2: フィルタ・集計
-   ✅ Phase 3: データクリーニング

### 次のステップ

📖 **[Claude Code Skills 実装ガイド](https://tech-lab.sios.jp/archives/50154)**でCLIツール化とSkill登録の詳細を学ぶ

前回の記事で説明した概念を、本記事の実装パターンで実践してみてください。tmpスクリプトから、あなたのプロジェクトに最適なビジネスロジックが見えてくるはずです。

## 参考リンク

### 公式ドキュメント

-   [Claude Code 公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/overview)
-   [Claude Code Skills 公式ガイド](https://docs.anthropic.com/en/docs/claude-code/skills)
-   [Python Click 公式ドキュメント](https://click.palletsprojects.com/) – CLIツール作成
-   [Python Type Hints 公式ガイド](https://docs.python.org/3/library/typing.html)
-   [uv 公式ドキュメント](https://docs.astral.sh/uv/)
-   [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
-   [Supabase Python Client](https://supabase.com/docs/reference/python/introduction)

### シリーズ記事

-   **[Claude Code: 公式MCPを補完するSkills設計パターン](https://tech-lab.sios.jp/archives/50214)**
    -   4層構造パターン（公式SDK → 自作Client → CLI → Skill）
    -   UI開発工数の大幅削減
-   **[Claude Codeの一時ファイルで爆速ビジネスロジック検証：UI不要で要件を発見する方法](https://tech-lab.sios.jp/archives/50208)**
    -   tmpスクリプトの本質的発見（概念編）
    -   なぜUIなしでビジネスロジックを整備できるか

### 関連ブログ

-   **[Claude Code Skills 実装ガイド：ローカルツールをスムーズに統合する方法](https://tech-lab.sios.jp/archives/50154)**
    -   Skillの実装方法（詳細）
    -   Progressive Disclosure、トークン効率化
-   **[HTMLでブログ記事を保存してる奴、全員Markdownにしろ。AIが読みにくいでしょうが！](https://tech-lab.sios.jp/archives/50175)**
    -   blog-scraperの実装例（tmpから進化したツール）
    -   トークン削減の実測データ
-   **[AIチャットで話すだけ!X予約投稿を完全自動化するシステム構築術](https://tech-lab.sios.jp/archives/49981)**
    -   X投稿管理システムの全体像
    -   Azure Functions + Supabaseでの予約投稿自動化

質問や感想は、コメント欄でお待ちしております！

ご覧いただきありがとうございます！ この投稿はお役に立ちましたか？  
  
[役に立った](#afb-post-50202)[役に立たなかった](#afb-post-50202)  
  
0人がこの投稿は役に立ったと言っています。