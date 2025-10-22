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

// サムネイル用のグラデーションカラーを生成
function getGradientColors(index: number): { from: string; to: string } {
  const gradients = [
    { from: '#667eea', to: '#764ba2' }, // Purple
    { from: '#f093fb', to: '#f5576c' }, // Pink
    { from: '#4facfe', to: '#00f2fe' }, // Blue
    { from: '#43e97b', to: '#38f9d7' }, // Green
    { from: '#fa709a', to: '#fee140' }, // Orange
    { from: '#30cfd0', to: '#330867' }, // Teal
    { from: '#a8edea', to: '#fed6e3' }, // Light
    { from: '#ff9a56', to: '#ff6a88' }, // Coral
  ];
  return gradients[index % gradients.length];
}

// 概要を短縮（100文字程度）
function truncateSummary(summary: string, maxLength: number = 100): string {
  if (summary.length <= maxLength) return summary;

  const truncated = summary.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');

  if (lastPeriod > 50) {
    return truncated.slice(0, lastPeriod + 1);
  }

  return truncated + '...';
}

// 記事カードのHTML生成
function generateArticleCard(article: BlogArticle, index: number): string {
  const gradient = getGradientColors(index);
  const shortSummary = truncateSummary(article.summary, 120);

  // タグのHTML生成（最大3個）
  const tagsHTML = article.tags
    .slice(0, 3)
    .map(tag => `<span class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">${tag}</span>`)
    .join('');

  // 成果データがある場合は最初の1つを表示
  let achievementBadge = '';
  if (article.achievements.length > 0) {
    const firstAchievement = article.achievements[0];
    achievementBadge = `
            <div class="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ${firstAchievement}
            </div>`;
  }

  // サムネイル部分: OGP画像がある場合はそれを使用、なければグラデーション
  // 16:9の比率を維持（1920×1080に対応）
  const thumbnailHTML = article.ogImage
    ? `<div class="relative aspect-video overflow-hidden bg-gray-100">
            <img src="${article.ogImage}"
                 alt="${article.title}"
                 class="w-full h-full object-cover"
                 loading="lazy"
                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'aspect-video bg-gradient-to-br from-[${gradient.from}] to-[${gradient.to}] flex items-center justify-center\\'><div class=\\'text-white text-center\\'><div class=\\'text-6xl font-bold opacity-20\\'>${article.id}</div><div class=\\'text-sm font-semibold mt-2 px-4\\'>${article.category}</div></div></div>';">
            ${achievementBadge}
          </div>`
    : `<div class="relative aspect-video bg-gradient-to-br from-[${gradient.from}] to-[${gradient.to}] flex items-center justify-center">
            <div class="text-white text-center">
              <div class="text-6xl font-bold opacity-20">${article.id}</div>
              <div class="text-sm font-semibold mt-2 px-4">${article.category}</div>
            </div>
            ${achievementBadge}
          </div>`;

  return `
        <!-- Article ${article.id} -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col">
          <!-- Thumbnail -->
          ${thumbnailHTML}

          <!-- Content -->
          <div class="p-5 flex-1 flex flex-col">
            <!-- Category Badge -->
            <div class="mb-3">
              <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                ${article.category}
              </span>
              ${article.subcategory ? `<span class="ml-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs">${article.subcategory}</span>` : ''}
            </div>

            <!-- Title -->
            <h2 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
              ${article.title}
            </h2>

            <!-- Summary -->
            <p class="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
              ${shortSummary}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              ${tagsHTML}
            </div>

            <!-- Button -->
            <a href="article_${article.id}.html"
               class="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center font-semibold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors duration-200">
              詳しく見る →
            </a>
          </div>
        </div>`;
}

// インデックスHTMLの生成
function generateIndexHTML(articles: BlogArticle[]): string {
  // カテゴリの抽出
  const categories = Array.from(new Set(articles.map(a => a.category)));

  // 記事カードの生成
  const articlesHTML = articles
    .map((article, index) => generateArticleCard(article, index))
    .join('\n');

  // カテゴリフィルターのHTML生成
  const categoryFiltersHTML = categories
    .map(category => `
            <button onclick="filterByCategory('${category}')"
                    class="category-filter px-4 py-2 bg-white text-purple-700 rounded-full hover:bg-purple-100 transition-colors duration-200 border border-purple-200">
              ${category}
            </button>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIOS Tech Lab ブログ記事アーカイブ</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* フォント設定 */
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;
        }

        /* line-clamp utility */
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* カテゴリフィルターのアクティブ状態 */
        .category-filter.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
        }

        /* アニメーション */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .article-card {
            animation: fadeIn 0.5s ease-out;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 mb-8">
        <div class="max-w-7xl mx-auto px-4">
            <h1 class="text-4xl font-bold mb-4">SIOS Tech Lab ブログ記事アーカイブ</h1>
            <p class="text-lg opacity-90">Claude × 技術ブログシリーズ - AI活用の実践記事集</p>
            <div class="mt-6 flex items-center gap-4">
                <span class="text-sm opacity-75">総記事数:</span>
                <span class="text-2xl font-bold">${articles.length}記事</span>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 pb-12">
        <!-- Category Filters -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">カテゴリで絞り込み</h2>
            <div class="flex flex-wrap gap-3">
                <button onclick="filterByCategory('all')"
                        class="category-filter active px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200">
                  すべて
                </button>
                ${categoryFiltersHTML}
            </div>
        </div>

        <!-- Articles Grid -->
        <div id="articles-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${articlesHTML}
        </div>

        <!-- Empty State -->
        <div id="empty-state" class="hidden text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-600 text-lg">該当する記事が見つかりませんでした</p>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8 mt-12">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p class="text-sm opacity-75">© SIOS Tech Lab - Claude AI 活用技術ブログシリーズ</p>
            <a href="https://tech-lab.sios.jp" target="_blank" class="text-purple-400 hover:text-purple-300 mt-2 inline-block">
              tech-lab.sios.jp →
            </a>
        </div>
    </footer>

    <script>
        // 記事データ（フィルタリング用）
        const articlesData = ${JSON.stringify(articles.map(a => ({ id: a.id, category: a.category })))};

        // カテゴリフィルター
        function filterByCategory(category) {
            const grid = document.getElementById('articles-grid');
            const emptyState = document.getElementById('empty-state');
            const cards = grid.children;

            // フィルターボタンのアクティブ状態を更新
            document.querySelectorAll('.category-filter').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            let visibleCount = 0;

            // カードの表示/非表示
            Array.from(cards).forEach((card, index) => {
                const articleCategory = articlesData[index].category;

                if (category === 'all' || articleCategory === category) {
                    card.classList.remove('hidden');
                    card.classList.add('article-card');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            // 空状態の表示/非表示
            if (visibleCount === 0) {
                emptyState.classList.remove('hidden');
            } else {
                emptyState.classList.add('hidden');
            }
        }

        // ページロード時のアニメーション
        window.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('#articles-grid > div');
            cards.forEach((card, index) => {
                card.classList.add('article-card');
                card.style.animationDelay = \`\${index * 0.05}s\`;
            });
        });
    </script>
</body>
</html>`;
}

// メイン処理
async function main() {
  const dataPath = path.join(__dirname, '../doc/blog-articles-data.json');
  const outputPath = path.join(__dirname, '../docs/blog-index.html');

  console.log('📖 blog-articles-data.jsonを読み込んでいます...');
  const articlesData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as BlogArticle[];

  console.log(`✅ ${articlesData.length}記事のデータを読み込みました\n`);

  console.log('🎨 インデックスHTMLを生成しています...');
  const html = generateIndexHTML(articlesData);

  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log('✅ 完了しました！');
  console.log(`📄 出力先: ${outputPath}`);
  console.log(`\n📊 統計情報:`);
  console.log(`  - 総記事数: ${articlesData.length}`);

  const categoryCount: { [key: string]: number } = {};
  articlesData.forEach(article => {
    categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
  });

  console.log(`  - カテゴリ別:`);
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`    * ${category}: ${count}記事`);
  });
}

main().catch(console.error);
