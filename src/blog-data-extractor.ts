import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

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
  highlights: string[];          // 記事のハイライト（印象的な文章、2-3個）
  achievements: string[];        // 具体的な成果・数値データ（2-4個）
  problemSolution?: {            // 問題と解決
    problem: string;
    solution: string;
  };
  ogImage?: string;              // OGP画像URL
}

interface CategoryMapping {
  [articleId: string]: {
    category: string;
    subcategory?: string;
    description: string;
  };
}

// README.mdからカテゴリマッピングを抽出
function parseCategoryMapping(readmeContent: string): CategoryMapping {
  const mapping: CategoryMapping = {};
  const lines = readmeContent.split('\n');

  let currentCategory = '';
  let currentSubcategory = '';
  let lastArticleId = '';
  let inClassificationSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 「## 📊 ブログ分類」セクションの開始を検出
    if (line.match(/^##\s+📊\s+ブログ分類$/)) {
      inClassificationSection = true;
      continue;
    }

    // 次の## セクションで終了
    if (inClassificationSection && line.match(/^##\s+[^#]/)) {
      break;
    }

    // 分類セクション外は処理しない
    if (!inClassificationSection) {
      continue;
    }

    // カテゴリ見出し: ### 1. Claude × 技術ブログシリーズ（執筆環境改革）
    // または: ### 3. システム開発・自動化事例
    const categoryMatch = line.match(/^###\s+\d+\.\s+([^（\n]+)(?:（.+?）)?$/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      currentSubcategory = '';
      lastArticleId = '';
      continue;
    }

    // サブカテゴリ見出し: #### 🔹 基盤記事
    const subcategoryMatch = line.match(/^####\s+🔹\s+(.+)$/);
    if (subcategoryMatch) {
      currentSubcategory = subcategoryMatch[1].trim();
      lastArticleId = '';
      continue;
    }

    // 記事エントリ: - **48397**: タイトル
    const articleMatch = line.match(/^-\s+\*\*(\d+)\*\*:\s+(.+)$/);
    if (articleMatch) {
      const id = articleMatch[1];
      const title = articleMatch[2].trim();
      lastArticleId = id;

      mapping[id] = {
        category: currentCategory,
        subcategory: currentSubcategory || undefined,
        description: title
      };

      // 次の行をチェック（詳細説明がある場合）
      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const detailMatch = nextLine.match(/^\s+-\s+(.+)$/);
        if (detailMatch) {
          const detail = detailMatch[1].trim();
          // 詳細説明を追加（タイトルの代わりに使用）
          mapping[id].description = detail;
        }
      }
    }
  }

  return mapping;
}

// HTMLからタイトルを抽出
function extractTitle(doc: Document): string {
  const h1 = doc.querySelector('h1');
  const title = h1?.textContent?.trim() || '';

  // クリーンアップ: 末尾の " | SIOS Tech. Lab" を除去
  return title.replace(/\s*\|\s*SIOS Tech\.?\s*Lab\.?$/i, '').trim();
}

// HTMLから目次を抽出
function extractTableOfContents(doc: Document): string[] {
  const tocContainer = doc.querySelector('[data-smooth-scroll="1"]');
  if (!tocContainer) return [];

  const tocLinks = tocContainer.querySelectorAll('a');
  const toc = Array.from(tocLinks)
    .map(link => {
      const span = link.querySelector('span:last-child');
      return span?.textContent?.trim() || link.textContent?.trim() || '';
    })
    .filter(Boolean);

  return toc;
}

// HTMLから概要を抽出（改善版：記事全体から本質的な内容を生成）
function extractSummary(
  doc: Document,
  title: string,
  description: string,
  toc: string[]
): string {
  // ベース文章: README.mdの説明文
  let summary = description;

  // タイトルから具体的な成果を抽出
  const timeReduction = title.match(/(\d+時間?)[→×](\d+時間?)/);
  const percentReduction = title.match(/(\d+)%削減/);
  const multiplier = title.match(/(\d+)倍速/);
  const phases = title.match(/(\d+)(フェーズ|段階)/);

  let metrics: string[] = [];
  if (timeReduction) {
    metrics.push(`${timeReduction[1]}から${timeReduction[2]}への時短を実現`);
  }
  if (percentReduction) {
    metrics.push(`${percentReduction[1]}%のコスト削減`);
  }
  if (multiplier) {
    metrics.push(`${multiplier[1]}倍の効率化`);
  }
  if (phases) {
    metrics.push(`${phases[1]}${phases[2]}の体系的アプローチ`);
  }

  if (metrics.length > 0) {
    summary += `。${metrics.join('、')}を達成`;
  }

  // 本文から重要な実績データを抽出
  const allText = doc.body?.textContent || '';
  const achievements: string[] = [];

  if (allText.includes('削減') || allText.includes('短縮')) {
    const costReduction = allText.match(/コスト.*?(\d+)%削減/);
    const timeReduction2 = allText.match(/開発時間.*?(\d+週間?|間?→|日間?).*?(\d+[週日時間]+)/);
    if (costReduction && !summary.includes(costReduction[1])) {
      achievements.push(`コスト${costReduction[1]}%削減`);
    }
  }

  if (achievements.length > 0 && !metrics.length) {
    summary += `し、${achievements.join('、')}を実現`;
  }

  // 主要な学習内容を追加（記事の解説内容を強調）
  const learningTopics = toc
    .filter(item => {
      // 手法、方法、術、など価値のある項目のみ
      return !item.match(/^(はじめに|まとめ|今後の|参考|変更履歴|おわりに|挨拶)/) &&
             (item.match(/(手法|方法|術|テクニック|戦略|アプローチ|実践|構築|解説|設定|実装|作成|使用|選び方|比較|確認|検証|最適化)/) ||
              item.length < 30); // 短い見出しは具体的な内容
    })
    .slice(0, 4);

  if (learningTopics.length > 0) {
    // より詳細な学習内容の説明
    if (learningTopics.length >= 3) {
      summary += `。記事では「${learningTopics[0]}」「${learningTopics[1]}」「${learningTopics[2]}」などの実践的な手順を詳しく解説`;
    } else {
      summary += `。${learningTopics.join('、')}などを網羅的に解説`;
    }
  }

  // 対象読者や適用場面を追加
  if (allText.includes('初心者') || allText.includes('はじめて')) {
    summary += '。初心者でも実践できる丁寧な解説付き';
  } else if (allText.includes('上級者') || allText.includes('実務経験')) {
    summary += '。実務経験者向けの実践的な内容';
  }

  // ツールやテクノロジーの言及
  const tools: string[] = [];
  const toolPatterns = [
    'Claude', 'Notion', 'MCP', 'GitHub Actions', 'Marp', 'Mermaid',
    'Next.js', 'Nest.js', 'TypeScript', 'OpenAPI', 'Slack', 'Orval'
  ];

  toolPatterns.forEach(tool => {
    if (title.includes(tool) && !summary.includes(tool)) {
      tools.push(tool);
    }
  });

  if (tools.length > 0 && tools.length <= 3) {
    summary += `。${tools.join('×')}を活用`;
  }

  // 最終的な文字数調整（200-300文字）
  // 「はじめに」からの引用は使用せず、記事の解説内容を強調
  if (summary.length < 200) {
    // h2見出しから追加の解説ポイントを抽出
    const h2Elements = doc.querySelectorAll('h2');
    const additionalTopics = Array.from(h2Elements)
      .map(h2 => h2.textContent?.trim())
      .filter(text =>
        text &&
        text.length > 5 &&
        text.length < 40 &&
        !text.match(/^(はじめに|まとめ|今後|おわり|参考)/)
      )
      .slice(0, 3);

    if (additionalTopics.length > 0) {
      summary += `。「${additionalTopics.join('」「')}」といった実践的なトピックをカバー`;
    }
  }

  // 300文字でカット、句点で終わるように調整
  let result = summary.slice(0, 300);
  const lastPeriod = result.lastIndexOf('。');
  if (lastPeriod > 150) {
    result = result.slice(0, lastPeriod + 1);
  }

  return result.trim();
}

// HTMLからキーポイントを抽出
function extractKeyPoints(toc: string[]): string[] {
  // 目次から主要項目を抽出（数字のみのレベル1を除外）
  const keyPoints = toc
    .filter(item => {
      // "はじめに" "まとめ" などを除外
      if (item.match(/^(はじめに|まとめ|今後の|参考|変更履歴)/) ) {
        return false;
      }
      return true;
    })
    .slice(0, 5); // 最大5項目

  return keyPoints;
}

// 記事のハイライト（印象的な文章）を抽出
function extractHighlights(doc: Document): string[] {
  const highlights: string[] = [];

  // 戦略1: まとめセクションから重要な文を抽出
  const summarySection = doc.querySelector('#matome, [href="#matome"]');
  if (summarySection) {
    let element = summarySection.parentElement?.parentElement?.parentElement?.nextElementSibling;
    let count = 0;
    while (element && count < 3) {
      if (element.tagName === 'P') {
        const text = element.textContent?.trim() || '';
        if (text.length > 30 && text.length < 150 && !text.match(/^(ども|こんにちは|みなさん)/)) {
          highlights.push(text);
          count++;
        }
      }
      element = element.nextElementSibling;
    }
  }

  // 戦略2: 強調されたテキスト（太字、重要箇所）を抽出
  if (highlights.length < 2) {
    const strongElements = doc.querySelectorAll('strong, b');
    Array.from(strongElements).forEach(el => {
      const text = el.textContent?.trim() || '';
      if (text.length > 20 && text.length < 100 && !highlights.includes(text)) {
        highlights.push(text);
      }
    });
  }

  // 戦略3: 段落から印象的な文を抽出
  if (highlights.length < 2) {
    const allP = Array.from(doc.querySelectorAll('p'));
    allP.forEach(p => {
      const text = p.textContent?.trim() || '';
      // 具体的な成果や感嘆符を含む文を優先
      if ((text.includes('！') || text.includes('。')) &&
          text.length > 40 && text.length < 150 &&
          !text.match(/^(ども|こんにちは|みなさん|お久|最近|先日)/) &&
          !highlights.some(h => text.includes(h))) {
        const sentences = text.split(/[。！]/);
        const impressiveSentence = sentences.find(s =>
          s.length > 30 &&
          (s.match(/(\d+[時間分%倍]|劇的|革命|激変|爆速|効率化|削減|短縮)/) || s.includes('実現'))
        );
        if (impressiveSentence && highlights.length < 3) {
          highlights.push(impressiveSentence.trim());
        }
      }
    });
  }

  return highlights.slice(0, 3);
}

// 具体的な成果・数値データを抽出
function extractAchievements(doc: Document, title: string): string[] {
  const achievements: string[] = [];
  const allText = doc.body?.textContent || '';

  // タイトルから成果を抽出（複数パターン対応）
  const titlePatterns = [
    { regex: /(\d+時間?)[→×を](\d+時間?)/, template: (m: RegExpMatchArray) => `⚡ ${m[1]}から${m[2]}への劇的な時短を実現` },
    { regex: /(\d+)%削減/, template: (m: RegExpMatchArray) => `💰 ${m[1]}%のコスト削減を達成` },
    { regex: /(\d+)倍速/, template: (m: RegExpMatchArray) => `🚀 ${m[1]}倍の高速化を実現` },
    { regex: /(\d+)(フェーズ|段階)/, template: (m: RegExpMatchArray) => `📋 ${m[1]}${m[2]}の体系的アプローチ` },
  ];

  titlePatterns.forEach(({ regex, template }) => {
    const match = title.match(regex);
    if (match) {
      achievements.push(template(match));
    }
  });

  // 本文から具体的な数値データを抽出
  const bodyPatterns = [
    { regex: /(\d+時間?)[→×を](\d+時間?)/g, template: (m: RegExpMatchArray) => `⚡ ${m[1]}から${m[2]}への時短` },
    { regex: /コスト.*?(\d+)%削減/g, template: (m: RegExpMatchArray) => `💰 コスト${m[1]}%削減` },
    { regex: /(\d+)倍速/g, template: (m: RegExpMatchArray) => `🚀 ${m[1]}倍の高速化` },
    { regex: /(\d+週間?|日間?)[→×を](\d+[週日時間]+)/g, template: (m: RegExpMatchArray) => `⏱️ ${m[1]}から${m[2]}に短縮` },
    { regex: /(\d+)ヶ月で実証/g, template: (m: RegExpMatchArray) => `✅ ${m[1]}ヶ月の実証期間で効果を確認` },
  ];

  bodyPatterns.forEach(({ regex, template }) => {
    const matches = allText.matchAll(regex);
    for (const match of matches) {
      if (achievements.length < 4) {
        const achievement = template(match);
        // 重複チェック（絵文字を除いてチェック）
        const cleanAchievement = achievement.replace(/[⚡💰🚀📋⏱️✅]\s*/g, '');
        const isDuplicate = achievements.some(a =>
          a.replace(/[⚡💰🚀📋⏱️✅]\s*/g, '') === cleanAchievement
        );
        if (!isDuplicate) {
          achievements.push(achievement);
        }
      }
    }
  });

  return achievements.slice(0, 4);
}

// 問題と解決を抽出
function extractProblemSolution(doc: Document, toc: string[]): { problem: string; solution: string } | undefined {
  // 目次から問題と解決のセクションを探す
  const problemTopic = toc.find(item =>
    item.match(/(問題|課題|悩み|困っ|ハマ|落とし穴)/)
  );
  const solutionTopic = toc.find(item =>
    item.match(/(解決|対策|改善|方法|手法|術|アプローチ)/)
  );

  if (problemTopic && solutionTopic) {
    return {
      problem: problemTopic,
      solution: solutionTopic
    };
  }

  // h2見出しから問題と解決を探す
  const h2Elements = Array.from(doc.querySelectorAll('h2'));
  const problemH2 = h2Elements.find(h2 =>
    h2.textContent?.match(/(問題|課題|悩み|困っ|ハマ|落とし穴)/)
  );
  const solutionH2 = h2Elements.find(h2 =>
    h2.textContent?.match(/(解決|対策|改善|方法|手法|術|アプローチ)/)
  );

  if (problemH2 && solutionH2) {
    return {
      problem: problemH2.textContent?.trim() || '',
      solution: solutionH2.textContent?.trim() || ''
    };
  }

  return undefined;
}

// HTMLからタグを抽出（簡易版：キーワードベース）
function extractTags(title: string, description: string): string[] {
  const text = (title + ' ' + description).toLowerCase();
  const tagPatterns = [
    { pattern: /notion.*mcp/i, tag: 'Notion MCP' },
    { pattern: /音声認識/i, tag: '音声認識' },
    { pattern: /claude\s*code/i, tag: 'Claude Code' },
    { pattern: /marp/i, tag: 'Marp' },
    { pattern: /mermaid/i, tag: 'Mermaid' },
    { pattern: /seo/i, tag: 'SEO' },
    { pattern: /github\s*actions/i, tag: 'GitHub Actions' },
    { pattern: /api/i, tag: 'API' },
    { pattern: /プロンプト/i, tag: 'プロンプト' },
    { pattern: /ブログ執筆/i, tag: 'ブログ執筆' },
    { pattern: /仕様書/i, tag: '仕様書駆動' },
    { pattern: /開発/i, tag: '開発手法' },
    { pattern: /自動化/i, tag: '自動化' },
  ];

  const tags: string[] = [];
  for (const { pattern, tag } of tagPatterns) {
    if (pattern.test(text) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }

  return tags.slice(0, 5);
}

// 1記事を処理
function processArticle(
  articleId: string,
  htmlContent: string,
  categoryMapping: CategoryMapping
): BlogArticle {
  const dom = new JSDOM(htmlContent);
  const doc = dom.window.document;

  const title = extractTitle(doc);
  const toc = extractTableOfContents(doc);

  const categoryInfo = categoryMapping[articleId] || {
    category: 'その他',
    description: title
  };

  const summary = extractSummary(doc, title, categoryInfo.description, toc);
  const keyPoints = extractKeyPoints(toc);
  const tags = extractTags(title, categoryInfo.description);

  // 「引き」情報を抽出
  const highlights = extractHighlights(doc);
  const achievements = extractAchievements(doc, title);
  const problemSolution = extractProblemSolution(doc, toc);

  return {
    id: articleId,
    title: title,
    url: `https://tech-lab.sios.jp/archives/${articleId}`,
    category: categoryInfo.category,
    subcategory: categoryInfo.subcategory,
    description: categoryInfo.description,
    tags: tags,
    summary: summary,
    keyPoints: keyPoints,
    tableOfContents: toc,
    highlights: highlights,
    achievements: achievements,
    problemSolution: problemSolution
  };
}

// メイン処理
async function main() {
  const docDir = path.join(__dirname, '../doc');
  const readmePath = path.join(docDir, 'README.md');
  const outputPath = path.join(docDir, 'blog-articles-data.json');

  console.log('📖 README.mdを読み込んでいます...');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const categoryMapping = parseCategoryMapping(readmeContent);

  console.log(`✅ カテゴリマッピングを抽出しました: ${Object.keys(categoryMapping).length}記事`);

  console.log('\n📄 HTMLファイルを読み込んでいます...');
  const htmlFiles = fs.readdirSync(docDir)
    .filter(file => file.startsWith('tech-lab-sios-jp-archives-') && file.endsWith('.html'));

  console.log(`✅ ${htmlFiles.length}個のHTMLファイルを発見しました\n`);

  const articles: BlogArticle[] = [];

  for (const file of htmlFiles) {
    const articleId = file.match(/archives-(\d+)\.html/)?.[1];
    if (!articleId) continue;

    console.log(`  処理中: ${articleId}...`);

    const htmlPath = path.join(docDir, file);
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    try {
      const article = processArticle(articleId, htmlContent, categoryMapping);
      articles.push(article);

      console.log(`    ✓ タイトル: ${article.title.slice(0, 50)}...`);
      console.log(`    ✓ カテゴリ: ${article.category}`);
      console.log(`    ✓ キーポイント: ${article.keyPoints.length}個`);
      console.log(`    ✓ 概要: ${article.summary.length}文字`);
      console.log(`    ✓ ハイライト: ${article.highlights.length}個`);
      console.log(`    ✓ 成果データ: ${article.achievements.length}個\n`);
    } catch (error) {
      console.error(`    ✗ エラー: ${error}`);
    }
  }

  // IDでソート
  articles.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  console.log(`\n💾 データを保存しています: ${outputPath}`);
  fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2), 'utf-8');

  console.log('✅ 完了しました！');
  console.log(`\n📊 統計情報:`);
  console.log(`  - 総記事数: ${articles.length}`);
  console.log(`  - カテゴリ別:`);

  const categoryCount: { [key: string]: number } = {};
  articles.forEach(article => {
    categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
  });

  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`    * ${category}: ${count}記事`);
  });
}

main().catch(console.error);
