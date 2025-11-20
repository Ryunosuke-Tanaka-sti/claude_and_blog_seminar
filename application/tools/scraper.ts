import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import TurndownService from 'turndown';

type CheerioAPI = ReturnType<typeof cheerio.load>;

interface OgpInfo {
    title: string;
    image: string;
    url: string;
}

interface ExtractionResult {
    html: string;
    ogpInfo: OgpInfo;
    originalTokens: number;
    extractedTokens: number;
    compressedTokens: number;
}

/**
 * URLからHTMLを取得してパースする関数
 * @param url 取得するURL
 * @returns パースされたCheerio instance
 */
async function fetchAndParseHtml(url: string): Promise<CheerioAPI | null> {
    try {
        const response = await fetch(url, { timeout: 10000 });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        return $;
    } catch (error) {
        console.error(`URLの取得でエラーが発生しました: ${error}`);
        return null;
    }
}

/**
 * Claude用のトークン数概算関数
 *
 * Claude（日本語）の場合：
 * - ひらがな・カタカナ: 約1.5文字/トークン
 * - 漢字: 約1文字/トークン
 * - 英数字: 約4文字/トークン
 * - HTML: 約3文字/トークン
 *
 * @param text 計算対象のテキスト
 * @returns 推定トークン数
 */
function estimateClaudeTokens(text: string): number {
    if (!text) {
        return 0;
    }

    let hiraganaKatakana = 0;
    let kanji = 0;
    let asciiChars = 0;
    let otherChars = 0;

    for (const char of text) {
        const code = char.charCodeAt(0);

        if ((code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff)) {
            hiraganaKatakana++;
        } else if (code >= 0x4e00 && code <= 0x9faf) {
            kanji++;
        } else if (code < 128) {
            asciiChars++;
        } else {
            otherChars++;
        }
    }

    const estimatedTokens =
        hiraganaKatakana / 1.5 +
        kanji / 1.0 +
        asciiChars / 4.0 +
        otherChars / 2.0;

    return Math.floor(estimatedTokens);
}

/**
 * OGP情報を取得する関数
 * @param $ Cheerio instance
 * @returns OGP情報オブジェクト
 */
function extractOgpInfo($: CheerioAPI): OgpInfo {
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    const ogUrl = $('meta[property="og:url"]').attr('content') || '';

    return {
        title: ogTitle,
        image: ogImage,
        url: ogUrl
    };
}

/**
 * YAML frontmatterを生成する関数
 * @param ogpInfo OGP情報
 * @param extractedAt 抽出日時
 * @returns YAML frontmatter文字列
 */
function createYamlFrontmatter(ogpInfo: OgpInfo, extractedAt: Date): string {
    const yaml = `---
title: "${ogpInfo.title.replace(/"/g, '\\"')}"
url: ${ogpInfo.url}
image: ${ogpInfo.image}
extracted_at: ${extractedAt.toISOString()}
---

`;
    return yaml;
}

/**
 * HTMLをMarkdownに変換する関数
 * @param html HTML文字列
 * @param ogpInfo OGP情報
 * @returns Markdown文字列（YAML frontmatter付き）
 */
function convertHtmlToMarkdown(html: string, ogpInfo: OgpInfo): string {
    // Turndownサービスの初期化
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        strongDelimiter: '**',
        linkStyle: 'inlined'
    });

    // カスタムルール1: 長いalt属性の簡略化
    turndownService.addRule('simplifyImageAlt', {
        filter: 'img',
        replacement: (_content, node) => {
            const element = node as HTMLImageElement;
            const src = element.getAttribute('src') || '';
            const alt = element.getAttribute('alt') || '';

            // alt属性が100文字以上の場合は簡略化
            if (alt.length > 100) {
                return `![image](${src})`;
            }

            return alt ? `![${alt}](${src})` : `![](${src})`;
        }
    });

    // カスタムルール2: div/spanタグはテキストのみ抽出
    turndownService.addRule('removeDivSpan', {
        filter: ['div', 'span'],
        replacement: (content) => content
    });

    // HTMLコメントを除去してからMarkdown変換
    const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, '');

    // Markdown変換
    const markdown = turndownService.turndown(cleanHtml);

    // YAML frontmatterを追加
    const frontmatter = createYamlFrontmatter(ogpInfo, new Date());

    return frontmatter + markdown;
}

/**
 * コンテンツを抽出して圧縮する関数
 * @param $ Cheerio instance
 * @param targetSelector 抽出対象のCSSセレクタ
 * @param sourceUrl ソースURL
 * @returns 抽出結果オブジェクト
 */
function extractAndCompressContent(
    $: CheerioAPI,
    targetSelector: string = 'section.entry-content',
    sourceUrl: string = ''
): ExtractionResult {
    try {
        const title = $('title').text().trim();
        const ogpInfo = extractOgpInfo($);

        const targetElements = $(targetSelector);

        if (targetElements.length === 0) {
            console.error(`指定されたセレクタ '${targetSelector}' に該当する要素が見つかりませんでした`);
            throw new Error('Content extraction failed');
        }

        const targetElement = targetElements.first();

        const originalFullTokens = estimateClaudeTokens($.html());
        const extractedTokens = estimateClaudeTokens(targetElement.html() || '');

        // 既存の処理（script/style削除、属性削除など）
        targetElement.find('script, style, noscript').remove();

        // 画像処理：alt/src属性は保持（Markdown変換時に使用）
        targetElement.find('img').each((_, elem) => {
            const $img = $(elem);
            // alt/src属性は保持（Markdown変換時に使用）
            $img.removeAttr('class');
            $img.removeAttr('id');
            $img.removeAttr('style');
        });

        // その他の属性削除
        targetElement.find('*').each((_, elem) => {
            const $elem = $(elem);
            const tagName = $elem.prop('tagName')?.toLowerCase();
            if (tagName === 'a') {
                const href = $elem.attr('href');
                $elem.removeAttr('class');
                $elem.removeAttr('id');
                $elem.removeAttr('style');
                if (href) {
                    $elem.attr('href', href);
                }
            } else {
                $elem.removeAttr('class');
                $elem.removeAttr('id');
                $elem.removeAttr('style');
            }
        });

        let compressedContent = targetElement.html() || '';
        compressedContent = compressedContent.replace(/>\s+</g, '><');

        const finalCompressedTokens = estimateClaudeTokens(compressedContent);

        // ログ出力
        console.log(`元ページ全体のトークン数: ${originalFullTokens.toLocaleString()}`);
        console.log(`抽出後のトークン数: ${extractedTokens.toLocaleString()}`);
        console.log(`最終圧縮後のトークン数: ${finalCompressedTokens.toLocaleString()}`);
        console.log(`抽出による削減: ${(originalFullTokens - extractedTokens).toLocaleString()}`);
        console.log(`圧縮による削減: ${(extractedTokens - finalCompressedTokens).toLocaleString()}`);
        console.log(`総削減トークン数: ${(originalFullTokens - finalCompressedTokens).toLocaleString()}`);

        const extractionRatio = originalFullTokens > 0
            ? ((originalFullTokens - extractedTokens) / originalFullTokens * 100)
            : 0;

        const compressionOnlyRatio = extractedTokens > 0
            ? ((extractedTokens - finalCompressedTokens) / extractedTokens * 100)
            : 0;

        const totalCompressionRatio = originalFullTokens > 0
            ? ((originalFullTokens - finalCompressedTokens) / originalFullTokens * 100)
            : 0;

        console.log(`抽出による削減率: ${extractionRatio.toFixed(2)}%`);
        console.log(`圧縮による削減率: ${compressionOnlyRatio.toFixed(2)}%`);
        console.log(`総合圧縮率: ${totalCompressionRatio.toFixed(2)}%`);

        // ページタイトルを含むHTML（Markdown変換用）
        const htmlWithTitle = `<h1>${title}</h1>\n\n${compressedContent}`;

        return {
            html: htmlWithTitle,
            ogpInfo: {
                title: ogpInfo.title || title,
                url: sourceUrl || ogpInfo.url,
                image: ogpInfo.image
            },
            originalTokens: originalFullTokens,
            extractedTokens: extractedTokens,
            compressedTokens: finalCompressedTokens
        };
    } catch (error) {
        console.error(`処理中にエラーが発生しました: ${error}`);
        throw error;
    }
}

/**
 * メイン関数
 */
async function main() {
    const url = process.env.URL || '';
    let targetUrl = url;

    if (!targetUrl) {
        targetUrl = 'https://tech-lab.sios.jp/archives/48173';
        console.log(`⚠️  URL未指定のため、デフォルトURLを使用: ${targetUrl}`);
    }

    if (!targetUrl.startsWith('https://tech-lab.sios.jp/archives')) {
        throw new Error("URLは 'https://tech-lab.sios.jp/archives' で始まる必要があります");
    }

    const cacheDir = path.join(__dirname, '../../docs/data');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
        console.log(`${cacheDir}ディレクトリを作成しました。`);
    }

    const domainPath = targetUrl
        .replace('https://', '')
        .replace('http://', '')
        .replace(/\//g, '-')
        .replace(/\./g, '-');

    // 拡張子を .md に変更
    const mdFilePath = path.join(cacheDir, `${domainPath}.md`);

    console.log(`📁 Markdownファイル保存先: ${mdFilePath}`);

    // キャッシュチェック（.md ファイル）
    if (fs.existsSync(mdFilePath)) {
        const stats = fs.statSync(mdFilePath);
        console.log(`✅ ${mdFilePath} が既に存在するため、後続の処理をスキップします。`);
        console.log(`📊 ファイルサイズ: ${stats.size} bytes`);
        return;
    }

    console.log('🔄 HTML取得・パース開始...');
    const $ = await fetchAndParseHtml(targetUrl);

    if (!$) {
        throw new Error('HTMLの取得に失敗しました');
    }

    const title = $('title').text().trim();
    if (title) {
        console.log(`📄 ページタイトル: ${title}`);
    }

    console.log('🔧 コンテンツ抽出・圧縮開始...');
    const extractionResult = extractAndCompressContent($, 'section.entry-content', targetUrl);

    if (!extractionResult.html) {
        throw new Error('コンテンツの抽出に失敗しました');
    }

    // Markdown変換
    console.log('📝 Markdown変換開始...');
    const markdown = convertHtmlToMarkdown(extractionResult.html, extractionResult.ogpInfo);

    // トークン計測（3段階目）
    const markdownTokens = estimateClaudeTokens(markdown);

    console.log(`Markdown変換後のトークン数: ${markdownTokens.toLocaleString()}`);
    console.log(`Markdown変換による削減: ${(extractionResult.compressedTokens - markdownTokens).toLocaleString()}`);

    const markdownReductionRatio = extractionResult.compressedTokens > 0
        ? ((extractionResult.compressedTokens - markdownTokens) / extractionResult.compressedTokens * 100)
        : 0;

    const totalReductionRatio = extractionResult.originalTokens > 0
        ? ((extractionResult.originalTokens - markdownTokens) / extractionResult.originalTokens * 100)
        : 0;

    console.log(`Markdown変換による削減率: ${markdownReductionRatio.toFixed(2)}%`);
    console.log(`総合削減率（生HTML→Markdown）: ${totalReductionRatio.toFixed(2)}%`);

    // Markdownファイル保存
    console.log(`💾 Markdownファイル保存中: ${mdFilePath}`);
    try {
        fs.writeFileSync(mdFilePath, markdown, 'utf-8');

        if (fs.existsSync(mdFilePath)) {
            const fileSize = fs.statSync(mdFilePath).size;
            console.log(`✅ Markdownファイルを保存しました: ${mdFilePath}`);
            console.log(`📊 ファイルサイズ: ${fileSize} bytes`);
        } else {
            throw new Error('Markdownファイルの保存に失敗しました');
        }
    } catch (error) {
        console.error(`❌ Markdownファイル保存エラー: ${error}`);
        throw error;
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error(error);
        process.exit(1);
    });
}
