import { initQuoteObserver } from "./observer.js";
import { resetMirror } from "./mirror.js";

export function renderHome() {
    const doseView = document.getElementById("dose-view");
    const homeView = document.getElementById("home-view");

    doseView.classList.remove("active");
    setTimeout(() => {
        doseView.classList.add("hidden");
        homeView.classList.remove("hidden");
        void homeView.offsetWidth;
        homeView.classList.add("active");
        // 重置呼吸镜面
        resetMirror();
    }, 400);
}

export function renderDose(bookInfo, currentTag) {
    const { book, degraded } = bookInfo;

    // 降级提示
    const hintEl = document.getElementById("degraded-hint");
    if (degraded && currentTag !== "daily") {
        hintEl.textContent = `本日"${currentTag}"之药已尽，以下为相近之方`;
        hintEl.classList.remove("hidden");
    } else {
        hintEl.classList.add("hidden");
    }

    // 导读区（书名不出现）
    document.getElementById("render-id").textContent = book.id + " ·";

    const guideHtml = book.guide
        .split("\n")
        .filter(p => p.trim())
        .map(p => `<p>${p}</p>`)
        .join("");
    document.getElementById("render-guide").innerHTML = guideHtml;

    // 金句区（书名在此首次出现）
    const quotesContainer = document.getElementById("render-quotes");
    let quotesHtml = `
        <div class="book-meta">
            <div class="book-title">${book.title}</div>
            <div class="book-author">${book.author}</div>
        </div>
        <div class="quote-divider"></div>
    `;

    book.quotes.forEach(quote => {
        quotesHtml += `
            <div class="quote-item">
                <div class="quote-text">${escapeHtml(quote)}</div>
                <div class="quote-divider"></div>
            </div>
        `;
    });

    quotesHtml += `
        <div class="extras-box">
            <div>${book.extras.availability}</div>
            <div style="margin-top: 8px;">如果你喜欢：${book.extras.ifYouLike}</div>
        </div>
        <div class="end-marker">□</div>
    `;
    quotesContainer.innerHTML = quotesHtml;

    // 页面切换
    const homeView = document.getElementById("home-view");
    const doseView = document.getElementById("dose-view");

    homeView.classList.remove("active");
    window.scrollTo(0, 0);

    setTimeout(() => {
        homeView.classList.add("hidden");
        doseView.classList.remove("hidden");

        // 导读短则隐藏箭头
        const guideHeight = document.querySelector(".guide-section").offsetHeight;
        const arrow = document.getElementById("scroll-arrow");
        if (guideHeight < window.innerHeight * 0.8) {
            arrow.style.display = "none";
        } else {
            arrow.style.display = "block";
        }

        document.getElementById("footer-actions").classList.remove("hidden");
        void doseView.offsetWidth;
        doseView.classList.add("active");
        initQuoteObserver();
    }, 400);
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}