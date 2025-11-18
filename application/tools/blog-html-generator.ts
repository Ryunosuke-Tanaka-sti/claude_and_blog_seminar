import * as fs from 'fs';
import * as path from 'path';

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

// HTMLテンプレート生成関数
function generateArticleHTML(article: BlogArticle): string {
  // タグのHTML生成
  const tagsHTML = article.tags
    .map(tag => `<span class="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">${tag}</span>`)
    .join('\n                        ');

  // キーポイントのHTML生成
  const keyPointsHTML = article.keyPoints
    .map((point, index) => `
                        <li class="flex items-center gap-2">
                            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">${index + 1}</span>
                            <span class="text-sm text-gray-800">${point}</span>
                        </li>`)
    .join('');

  // 成果データのHTML生成（存在する場合）
  let achievementsHTML = '';
  if (article.achievements.length > 0) {
    const achievementsItems = article.achievements
      .map(achievement => `
                        <div class="bg-purple-50 rounded p-2 border-l-4 border-purple-400">
                            <p class="text-xs text-gray-700 font-semibold">${achievement}</p>
                        </div>`)
      .join('');

    achievementsHTML = `
                <!-- 圧倒的な成果 -->
                <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-5 border-2 border-orange-200">
                    <h2 class="text-sm font-semibold text-orange-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        圧倒的な成果
                    </h2>
                    <div class="space-y-2">
                        ${achievementsItems}
                    </div>
                </div>
`;
  }

  // ハイライトのHTML生成（存在する場合）
  let highlightsHTML = '';
  if (article.highlights.length > 0) {
    const highlightsItems = article.highlights
      .map(highlight => `
                        <div class="bg-purple-50 rounded p-3 border-l-4 border-purple-400">
                            <p class="text-xs text-gray-700">${highlight}</p>
                        </div>`)
      .join('');

    highlightsHTML = `
                <!-- 記事のハイライト -->
                <div class="bg-white rounded-lg p-5 border-2 border-purple-200">
                    <h2 class="text-sm font-semibold text-purple-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                        記事のハイライト
                    </h2>
                    <div class="space-y-2">
                        ${highlightsItems}
                    </div>
                </div>
`;
  }

  // サブカテゴリのバッジ（存在する場合）
  const subcategoryBadge = article.subcategory
    ? `<span class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">
                            ${article.subcategory}
                        </span>`
    : '';

  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - ブログ記事紹介</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Web表示用レイアウト設定 */
        .content-container {
            max-width: 1400px;
            padding: 2rem;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        /* フォント設定 */
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;
        }

        /* 印刷時の調整 */
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .content-container {
                box-shadow: none;
            }
        }

        /* カスタムスタイル */
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>
<body class="bg-gray-100 py-8">
    <div class="content-container">
        <!-- Header -->
        <div class="mb-6">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-3">
                        <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                            ${article.category}
                        </span>
                        ${subcategoryBadge}
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 leading-tight mb-2">
                        ${article.title}
                    </h1>
                    <div class="flex items-center gap-4 text-sm text-gray-600">
                        <span>記事ID: ${article.id}</span>
                        <span>•</span>
                        ${tagsHTML}
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content: 2カラムレイアウト -->
        <div class="grid grid-cols-5 gap-6">
            <!-- 左カラム: 60% -->
            <div class="col-span-3 space-y-4">
                <!-- 概要 -->
                <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5">
                    <h2 class="text-sm font-semibold text-purple-900 mb-2 uppercase tracking-wide">記事概要</h2>
                    <p class="text-gray-800 leading-relaxed text-base">
                        ${article.summary}
                    </p>
                </div>

                <!-- 重要ポイント -->
                <div class="bg-white rounded-lg p-5 border border-gray-200">
                    <h2 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                        </svg>
                        重要ポイント
                    </h2>
                    <ul class="space-y-2.5">
                        ${keyPointsHTML}
                    </ul>
                </div>
            </div>

            <!-- 右カラム: 40% -->
            <div class="col-span-2 space-y-4">
                ${achievementsHTML}
                ${highlightsHTML}

                <!-- 記事リンク -->
                <div class="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg p-5 text-center">
                    <h3 class="text-lg font-bold text-white mb-4">元記事を読む</h3>
                    <a href="${article.url}"
                       target="_blank"
                       class="inline-block w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-lg hover:bg-purple-50 transition-colors duration-200 shadow-lg text-lg">
                        詳しく読む →
                    </a>
                    <p class="text-sm mt-4 text-white opacity-90">tech-lab.sios.jp</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                </svg>
                <span>SIOS Tech Lab ブログアーカイブ</span>
            </div>
            <div class="flex items-center gap-4">
                <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">← 前の記事</a>
                <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">一覧へ</a>
                <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">次の記事 →</a>
            </div>
        </div>
    </div>
</body>
</html>
`;
}

// メイン処理
async function main() {
  const dataPath = path.join(__dirname, '../doc/blog-articles-data.json');
  const outputDir = path.join(__dirname, '../docs');

  console.log('📖 blog-articles-data.jsonを読み込んでいます...');
  const articlesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as BlogArticle[];

  console.log(`✅ ${articlesData.length}記事のデータを読み込みました\n`);

  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🎨 HTMLページを生成しています...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const article of articlesData) {
    try {
      const html = generateArticleHTML(article);
      const outputPath = path.join(outputDir, `article_${article.id}.html`);

      fs.writeFileSync(outputPath, html, 'utf-8');

      console.log(`  ✓ [${article.id}] ${article.title.slice(0, 50)}...`);
      console.log(`    → ${path.basename(outputPath)}`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ [${article.id}] エラー: ${error}`);
      errorCount++;
    }
  }

  console.log('\n✅ 完了しました！');
  console.log(`\n📊 統計情報:`);
  console.log(`  - 成功: ${successCount}記事`);
  console.log(`  - エラー: ${errorCount}記事`);
  console.log(`  - 出力先: ${outputDir}`);
}

main().catch(console.error);
