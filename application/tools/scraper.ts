import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

/**
 * URLからHTMLを取得してパースする関数
 * @param url 取得するURL
 * @returns パースされたCheerio instance
 */
async function fetchAndParseHtml(url: string): Promise<cheerio.Root | null> {
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
 * コンテンツを抽出して圧縮する関数
 * @param $ Cheerio instance
 * @param targetSelector 抽出対象のCSSセレクタ
 * @returns 圧縮されたコンテンツ
 */
function extractAndCompressContent($: cheerio.Root, targetSelector: string = 'section.entry-content'): string {
    try {
        const title = $('title').text().trim();
        
        const targetElements = $(targetSelector);
        
        if (targetElements.length === 0) {
            console.error(`指定されたセレクタ '${targetSelector}' に該当する要素が見つかりませんでした`);
            return '';
        }

        const targetElement = targetElements.first();
        
        const originalFullTokens = estimateClaudeTokens($.html());
        const extractedTokens = estimateClaudeTokens(targetElement.html() || '');

        targetElement.find('script, style, noscript').remove();

        targetElement.find('img[alt]').each((_, elem) => {
            const $img = $(elem);
            const altText = $img.attr('alt');
            if (altText) {
                $img.after(` ${altText} `);
            }
            $img.removeAttr('alt');
            $img.removeAttr('class');
            $img.removeAttr('id');
            $img.removeAttr('style');
        });

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

        const result = `<h1>${title}</h1>\n\n${compressedContent}`;
        
        return result;
    } catch (error) {
        console.error(`処理中にエラーが発生しました: ${error}`);
        return '';
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

    const cacheDir = 'doc';
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
        console.log(`${cacheDir}ディレクトリを作成しました。`);
    }

    const domainPath = targetUrl
        .replace('https://', '')
        .replace('http://', '')
        .replace(/\//g, '-')
        .replace(/\./g, '-');
    
    const htmlFilePath = path.join(cacheDir, `${domainPath}.html`);

    console.log(`📁 HTMLファイル保存先: ${htmlFilePath}`);

    if (fs.existsSync(htmlFilePath)) {
        const stats = fs.statSync(htmlFilePath);
        console.log(`✅ ${htmlFilePath} が既に存在するため、後続の処理をスキップします。`);
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
    const result = extractAndCompressContent($);

    if (!result) {
        throw new Error('コンテンツの抽出に失敗しました');
    }

    console.log(`💾 HTMLファイル保存中: ${htmlFilePath}`);
    try {
        fs.writeFileSync(htmlFilePath, result, 'utf-8');

        if (fs.existsSync(htmlFilePath)) {
            const fileSize = fs.statSync(htmlFilePath).size;
            console.log(`✅ HTMLファイルを保存しました: ${htmlFilePath}`);
            console.log(`📊 ファイルサイズ: ${fileSize} bytes`);
        } else {
            throw new Error('HTMLファイルの保存に失敗しました');
        }
    } catch (error) {
        console.error(`❌ HTMLファイル保存エラー: ${error}`);
        throw error;
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error(error);
        process.exit(1);
    });
}