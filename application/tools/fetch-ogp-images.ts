import * as fs from 'fs';
import * as path from 'path';
import https from 'https';

interface BlogArticle {
  id: string;
  title: string;
  url: string;
  category: string;
  subcategory?: string;
  description: string;
  tags: string[];
  summary: string;
  keyPoints: string[];
  tableOfContents: string[];
  highlights: string[];
  achievements: string[];
  problemSolution?: {
    problem: string;
    solution: string;
  };
  ogImage?: string;
}

// HTTPSリクエストでHTMLを取得
function fetchHTML(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// HTMLからOGP画像URLを抽出
function extractOGPImage(html: string): string | undefined {
  // <meta property="og:image" content="..."> を抽出
  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImageMatch) {
    return ogImageMatch[1];
  }

  // <meta name="og:image" content="..."> も試す
  const ogImageMatch2 = html.match(/<meta\s+name=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImageMatch2) {
    return ogImageMatch2[1];
  }

  // content属性が先にくるパターン
  const ogImageMatch3 = html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
  if (ogImageMatch3) {
    return ogImageMatch3[1];
  }

  return undefined;
}

// メイン処理
async function main() {
  const dataPath = path.join(__dirname, '../doc/blog-articles-data.json');

  console.log('📖 blog-articles-data.jsonを読み込んでいます...');
  const articlesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as BlogArticle[];

  console.log(`✅ ${articlesData.length}記事のデータを読み込みました\n`);

  console.log('🌐 各記事のOGP画像を取得しています...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const article of articlesData) {
    try {
      console.log(`  [${article.id}] ${article.title.slice(0, 50)}...`);

      const html = await fetchHTML(article.url);
      const ogImage = extractOGPImage(html);

      if (ogImage) {
        article.ogImage = ogImage;
        console.log(`    ✓ OGP画像: ${ogImage}`);
        successCount++;
      } else {
        console.log(`    ⚠ OGP画像が見つかりませんでした`);
        errorCount++;
      }

      // レート制限のため少し待機
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`    ✗ エラー: ${error}`);
      errorCount++;
    }
  }

  console.log('\n💾 データを保存しています...');
  fs.writeFileSync(dataPath, JSON.stringify(articlesData, null, 2), 'utf-8');

  console.log('✅ 完了しました！');
  console.log(`\n📊 統計情報:`);
  console.log(`  - 成功: ${successCount}記事`);
  console.log(`  - 失敗: ${errorCount}記事`);
}

main().catch(console.error);
