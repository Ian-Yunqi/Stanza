export function matchBook(tag, books, seenIds) {
    // 每日一剂：全库随机，排除已看
    if (tag === "daily") {
        const freshDaily = books.filter(b => !seenIds.includes(b.id));
        const pool = freshDaily.length ? freshDaily : books;
        return { book: pool[Math.floor(Math.random() * pool.length)], degraded: false };
    }

    // 1. 主标签匹配
    let pool = books.filter(b => b.tags.primary === tag);
    let degraded = false;

    // 2. 降级到辅标签
    if (!pool.length || pool.every(b => seenIds.includes(b.id))) {
        const secondaryPool = books.filter(
            b => b.tags.secondary && b.tags.secondary.includes(tag)
        );
        if (secondaryPool.length) {
            pool = secondaryPool;
            degraded = true;
        }
    }

    // 3. 排除已看
    const fresh = pool.filter(b => !seenIds.includes(b.id));
    const finalCandidates = fresh.length ? fresh : pool;

    const selectedBook = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];

    return { book: selectedBook, degraded };
}
