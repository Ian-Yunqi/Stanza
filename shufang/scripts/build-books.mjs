/*
  用法：node scripts/build-books.mjs
  从 书籍案例库.md 提取全部 30 本书，输出到 data/books.json
  如果解析失败，手动对照 MD 文件修一下 —— 正则不是完美的
*/
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mdPath = resolve(__dirname, "../../书籍案例库.md");
const outPath = resolve(__dirname, "../data/books.json");

const md = readFileSync(mdPath, "utf-8");

// 按 "## NNN · 书名" 切分
const blocks = md.split(/^## \d{3} · .+$/m).slice(1);

console.log(`📖 检测到 ${blocks.length} 个书籍区块`);

const books = blocks.map((block, i) => {
    const id = String(i + 1).padStart(3, "0");

    // 基本信息表
    const getField = (label) => {
        const re = new RegExp(`\\|\\s*${label}\\s*\\|\\s*(.+?)\\s*\\|`);
        return (block.match(re) || [])[1]?.trim() || "";
    };

    const title = getField("书名");
    const author = getField("作者");
    const summary = getField("一句话简介");

    // 标签映射表（第一个 ✅ 做主标签，其余 ✅/○ 都进辅标签）
    const tags = { primary: null, secondary: [] };
    const tagRe = /\|\s*([^\s|]+?)\s*\|\s*([✅○])\s*\|/g;
    let m;
    while ((m = tagRe.exec(block)) !== null) {
        if (m[2] === "✅") {
            if (!tags.primary) tags.primary = m[1];
            else tags.secondary.push(m[1]);
        }
        if (m[2] === "○") tags.secondary.push(m[1]);
    }

    // 导读文字
    const guideMatch = block.match(/### 🩺 认知重塑导读\s*\n\n([\s\S]+?)(?=\n### )/);
    const guide = guideMatch ? guideMatch[1].trim() : "";

    // 金句
    const quotesMatch = block.match(/### 💊 金句试读区\s*\n\n([\s\S]+?)(?=\n### )/);
    const quotes = [];
    if (quotesMatch) {
        const quoteBlocks = quotesMatch[1].split(/\*\*第 \d+ 剂\*\*[：:]?/);
        quoteBlocks.forEach(qb => {
            const lines = qb.split("\n").filter(l => l.trim().startsWith(">"));
            if (lines.length > 0) {
                quotes.push(lines.map(l => l.replace(/^>\s*/, "").trim()).join("\n"));
            }
        });
    }

    // 延伸信息
    const availability = getField("全书获取方式");
    const ifYouLike = getField("如果你喜欢这本书");

    return {
        id,
        title,
        author,
        summary,
        tags,
        guide,
        quotes,
        extras: { availability, ifYouLike }
    };
}).filter(b => b.title); // 过滤空块

writeFileSync(outPath, JSON.stringify(books, null, 2), "utf-8");
console.log(`✅ 成功解析 ${books.length} 本书，已写入 ${outPath}`);
