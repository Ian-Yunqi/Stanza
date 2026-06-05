const fs = require("fs");

const css = fs.readFileSync("D:/tool/suibian/shufang/css/style.css", "utf-8");
const books = JSON.parse(fs.readFileSync("D:/tool/suibian/shufang/data/books.json", "utf-8"));

// Build the complete JS (mirror + storage + matcher + observer + render + router)
const js = (function() {

// --- mirror.js (Gemini's new homepage logic with A'+C hints) ---
var mirror = `
var tags = ["无聊", "迷茫", "厌倦", "浮躁", "疲惫", "空游无所依", "烦闷", "平淡"];
var currentIndex = 0;
var playCount = 0;
var cycleTimer = null;
var _hintSeen = false;

function initMirror() {
    var scalerEl = document.getElementById("word-scaler");
    var containerEl = document.getElementById("home-view");
    var dailyBtn = document.getElementById("daily-btn-mirror");

    dailyBtn.classList.add("idle-breathe");

    // ===== 方案 C：延迟轻语 =====
    var HINT_KEY = "shufang-hint-seen";
    var whisperEl = document.getElementById("delayed-whisper");
    var whisperTimer = null;
    var hideTimer = null;

    try { _hintSeen = localStorage.getItem(HINT_KEY) === "1"; } catch(e) { _hintSeen = false; }

    function markHintAsSeen() {
        if (whisperTimer) clearTimeout(whisperTimer);
        if (hideTimer) clearTimeout(hideTimer);
        if (whisperEl) whisperEl.classList.remove("show");
        try { localStorage.setItem(HINT_KEY, "1"); _hintSeen = true; } catch(e) {}
    }

    if (!_hintSeen) {
        whisperTimer = setTimeout(function() {
            if (whisperEl) whisperEl.classList.add("show");
            hideTimer = setTimeout(function() {
                markHintAsSeen();
            }, 4000);
        }, 11000);
    }

    function playWord(index) {
        scalerEl.innerHTML = "";
        var newEl = document.createElement("div");
        newEl.className = "emotion-word breathing";
        newEl.textContent = tags[index];
        newEl.classList.add(tags[index].length > 2 ? "word-long" : "word-short");
        scalerEl.appendChild(newEl);

        if (playCount % tags.length === 2) {
            dailyBtn.classList.remove("idle-breathe");
            dailyBtn.classList.add("flash-highlight");
            setTimeout(function() {
                dailyBtn.classList.remove("flash-highlight");
                dailyBtn.classList.add("idle-breathe");
            }, 2000);
        }

        playCount++;

        clearTimeout(cycleTimer);
        cycleTimer = setTimeout(function() {
            if (playCount <= tags.length) {
                currentIndex = (currentIndex + 1) % tags.length;
            } else {
                var randomStep = Math.floor(Math.random() * 3) + 1;
                currentIndex = (currentIndex + randomStep) % tags.length;
            }
            playWord(currentIndex);
        }, 5500);
    }

    playWord(currentIndex);

    document.getElementById("zone-prev").addEventListener("click", function() {
        markHintAsSeen();
        currentIndex = (currentIndex - 1 + tags.length) % tags.length;
        playWord(currentIndex);
    });

    document.getElementById("zone-next").addEventListener("click", function() {
        markHintAsSeen();
        currentIndex = (currentIndex + 1) % tags.length;
        playWord(currentIndex);
    });

    document.getElementById("zone-enter").addEventListener("click", function() {
        markHintAsSeen();
        clearTimeout(cycleTimer);
        scalerEl.classList.add("clicked");
        containerEl.style.backgroundColor = "hsl(40, 20%, 95%)";
        setTimeout(function() {
            scalerEl.classList.remove("clicked");
            containerEl.style.backgroundColor = "";
            navigateToTag(tags[currentIndex]);
        }, 300);
    });

    // Grid fallback
    var gridOverlay = document.getElementById("grid-overlay");
    document.getElementById("btn-show-all").addEventListener("click", function(e) {
        e.stopPropagation();
        markHintAsSeen();
        gridOverlay.classList.add("visible");
        gridOverlay.style.display = "flex";
    });
    document.getElementById("btn-close-all").addEventListener("click", function(e) {
        e.stopPropagation();
        gridOverlay.classList.remove("visible");
        setTimeout(function() { gridOverlay.style.display = "none"; }, 400);
    });
    document.querySelectorAll(".grid-overlay .tag-btn").forEach(function(btn) {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            gridOverlay.classList.remove("visible");
            setTimeout(function() { gridOverlay.style.display = "none"; }, 400);
            navigateToTag(e.target.dataset.tag);
        });
    });

    // Daily dose button
    dailyBtn.addEventListener("click", function() { markHintAsSeen(); navigateToTag("daily"); });
}
`;

// --- storage.js ---
var storage = `
var SEEN_KEY = "shufang-seen";
var DOSE_PREFIX = "shufang-dose-";
function isStorageAvailable() {
    try { var t = "__test__"; localStorage.setItem(t, t); localStorage.removeItem(t); return true; }
    catch (e) { return false; }
}
function getSeenBooks() {
    if (!isStorageAvailable()) return [];
    try { var d = localStorage.getItem(SEEN_KEY); return d ? JSON.parse(d) : []; }
    catch (e) { return []; }
}
function pushSeenBook(id) {
    if (!isStorageAvailable()) return;
    try {
        var seen = getSeenBooks();
        if (!seen.includes(id)) { seen.push(id); if (seen.length > 5) seen.shift(); localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); }
    } catch (e) {}
}
function getDailyDose(dateStr) {
    if (!isStorageAvailable()) return null;
    return localStorage.getItem(DOSE_PREFIX + dateStr);
}
function setDailyDose(dateStr, id) {
    if (!isStorageAvailable()) return;
    try { localStorage.setItem(DOSE_PREFIX + dateStr, id); cleanOldDoses(dateStr); } catch (e) {}
}
function cleanOldDoses(currentDateStr) {
    var today = new Date(currentDateStr).getTime();
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key && key.startsWith(DOSE_PREFIX)) {
            var kt = new Date(key.replace(DOSE_PREFIX, "")).getTime();
            if (today - kt > 7 * 24 * 60 * 60 * 1000) localStorage.removeItem(key);
        }
    }
}
`;

// --- matcher.js ---
var matcher = `
function matchBook(tag, books, seenIds) {
    if (tag === "daily") {
        var fresh = books.filter(function(b) { return !seenIds.includes(b.id); });
        var pool = fresh.length ? fresh : books;
        return { book: pool[Math.floor(Math.random() * pool.length)], degraded: false };
    }
    var pool = books.filter(function(b) { return b.tags.primary === tag; });
    var degraded = false;
    if (!pool.length || pool.every(function(b) { return seenIds.includes(b.id); })) {
        var sp = books.filter(function(b) { return b.tags.secondary && b.tags.secondary.includes(tag); });
        if (sp.length) { pool = sp; degraded = true; }
    }
    var fresh = pool.filter(function(b) { return !seenIds.includes(b.id); });
    var candidates = fresh.length ? fresh : pool;
    return { book: candidates[Math.floor(Math.random() * candidates.length)], degraded };
}
`;

// --- observer.js ---
var observer = `
var _quoteObserver = null;
function initQuoteObserver() {
    if (_quoteObserver) _quoteObserver.disconnect();
    _quoteObserver = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transition = "opacity 0.6s ease";
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll(".quote-item").forEach(function(el) { _quoteObserver.observe(el); });
}
`;

// --- render.js ---
var render = `
function renderHome() {
    var dv = document.getElementById("dose-view");
    var hv = document.getElementById("home-view");
    dv.classList.remove("active");
    setTimeout(function() {
        dv.classList.add("hidden");
        hv.classList.remove("hidden");
        void hv.offsetWidth;
        hv.classList.add("active");
        // Reset mirror state without re-running initMirror
        // (avoids duplicate event listeners and double playWord cycles)
        currentIndex = 0;
        playCount = 0;
        if (cycleTimer) clearTimeout(cycleTimer);
        playWord(currentIndex);
    }, 400);
}

function renderDose(bookInfo, currentTag) {
    var book = bookInfo.book;
    var degraded = bookInfo.degraded;
    var hintEl = document.getElementById("degraded-hint");
    if (degraded && currentTag !== "daily") {
        hintEl.textContent = "本日“" + currentTag + "”之药已尽，以下为相近之方";
        hintEl.classList.remove("hidden");
    } else {
        hintEl.classList.add("hidden");
    }
    document.getElementById("render-id").textContent = book.id + " ·";
    var guideHtml = book.guide.split("\\n").filter(function(p) { return p.trim(); }).map(function(p) { return "<p>" + escapeHtml(p) + "</p>"; }).join("");
    document.getElementById("render-guide").innerHTML = guideHtml;

    var qHtml = "<div class=\\"book-meta\\"><div class=\\"book-title\\">" + escapeHtml(book.title) + "</div><div class=\\"book-author\\">" + escapeHtml(book.author) + "</div></div><div class=\\"quote-divider\\"></div>";
    book.quotes.forEach(function(q) {
        qHtml += "<div class=\\"quote-item\\"><div class=\\"quote-text\\">" + escapeHtml(q) + "</div><div class=\\"quote-divider\\"></div></div>";
    });
    qHtml += "<div class=\\"extras-box\\"><div>" + escapeHtml(book.extras.availability) + "</div><div style=\\"margin-top: 8px;\\">如果你喜欢：" + escapeHtml(book.extras.ifYouLike) + "</div></div><div class=\\"end-marker\\">□</div>";
    document.getElementById("render-quotes").innerHTML = qHtml;

    var hv = document.getElementById("home-view");
    var dv = document.getElementById("dose-view");
    hv.classList.remove("active");
    window.scrollTo(0, 0);

    setTimeout(function() {
        hv.classList.add("hidden");
        dv.classList.remove("hidden");
        var gh = document.querySelector(".guide-section").offsetHeight;
        var arrow = document.getElementById("scroll-arrow");
        arrow.style.display = (gh < window.innerHeight * 0.8) ? "none" : "block";
        document.getElementById("footer-actions").classList.remove("hidden");
        void dv.offsetWidth;
        dv.classList.add("active");
        initQuoteObserver();
    }, 400);
}

function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
`;

// --- router.js ---
var router = `
var appBooks = [];

function initRouter(books) {
    appBooks = books;
    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
}

function navigateToTag(tag) {
    var url = new URL(window.location);
    url.searchParams.set("tag", tag);
    window.history.pushState({}, "", url);
    handleUrlChange();
}

function goHome() {
    var url = new URL(window.location);
    url.searchParams.delete("tag");
    window.history.pushState({}, "", url);
    handleUrlChange();
}

function handleUrlChange() {
    var params = new URLSearchParams(window.location.search);
    var tag = params.get("tag");
    if (!tag) { renderHome(); return; }
    var matchResult;
    if (tag === "daily") {
        var today = new Date().toLocaleDateString("zh-CN");
        var savedId = getDailyDose(today);
        if (savedId) {
            var b = appBooks.find(function(x) { return x.id === savedId; });
            matchResult = b ? { book: b, degraded: false } : null;
        }
        if (!matchResult) {
            matchResult = matchBook("daily", appBooks, getSeenBooks());
            if (matchResult.book) setDailyDose(today, matchResult.book.id);
        }
    } else {
        matchResult = matchBook(tag, appBooks, getSeenBooks());
    }
    if (matchResult && matchResult.book) {
        pushSeenBook(matchResult.book.id);
        renderDose(matchResult, tag);
    } else {
        goHome();
    }
}
`;

// --- main ---
var main = `
document.addEventListener("DOMContentLoaded", function() {
    try {
        var books = BOOKS;
        initMirror();
        document.getElementById("nav-back").addEventListener("click", goHome);
        document.getElementById("nav-home").addEventListener("click", goHome);
        document.getElementById("nav-next").addEventListener("click", function() {
            var ct = new URLSearchParams(window.location.search).get("tag");
            navigateToTag(ct || "daily");
        });
        window.addEventListener("scroll", function() {
            var arrow = document.getElementById("scroll-arrow");
            if (window.scrollY > 150) { arrow.style.opacity = "0"; arrow.style.transition = "opacity 0.3s"; }
            else { arrow.style.opacity = ""; arrow.style.transition = ""; }
        });
        initRouter(books);
    } catch (e) {
        console.error("加载失败", e);
        document.body.innerHTML = "<div style=\\"text-align:center;margin-top:50px;\\">加载失败，请刷新页面</div>";
    }
});
`;

return mirror + storage + matcher + observer + render + router + main;
})();

// Build body HTML (new mirror homepage)
const body = `
    <div id="home-view" class="view-container mirror-container active">
        <div class="all-tags-btn" id="btn-show-all" style="font-family:'PingFang SC','Noto Sans SC',sans-serif">全部</div>

        <div class="edge-hint edge-left">〈</div>
        <div class="edge-hint edge-right">〉</div>

        <div class="touch-zone touch-left" id="zone-prev"></div>
        <div class="touch-zone touch-center" id="zone-enter"></div>
        <div class="touch-zone touch-right" id="zone-next"></div>

        <div class="word-scaler" id="word-scaler">
            <div id="emotion-display"></div>
        </div>

        <div class="delayed-whisper" id="delayed-whisper">轻触左右边缘切换</div>

        <div class="daily-dose-btn-mirror" id="daily-btn-mirror">今日一剂</div>

        <div class="grid-overlay" id="grid-overlay" style="display:none">
            <div class="grid-close" id="btn-close-all">×</div>
            <div class="tags-grid">
                <button class="tag-btn" data-tag="无聊">无聊</button>
                <button class="tag-btn" data-tag="迷茫">迷茫</button>
                <button class="tag-btn" data-tag="厌倦">厌倦</button>
                <button class="tag-btn" data-tag="浮躁">浮躁</button>
                <button class="tag-btn" data-tag="疲惫">疲惫</button>
                <button class="tag-btn" data-tag="空游无所依">空游无所依</button>
                <button class="tag-btn" data-tag="烦闷">烦闷</button>
                <button class="tag-btn" data-tag="平淡">平淡</button>
            </div>
        </div>
    </div>

    <div id="dose-view" class="view-container hidden">
        <button class="back-btn" id="nav-back">←</button>
        <div id="degraded-hint" class="degraded-hint hidden"></div>
        <div class="guide-section">
            <div class="book-id" id="render-id"></div>
            <div class="guide-text" id="render-guide"></div>
        </div>
        <div class="scroll-hint" id="scroll-arrow">↓</div>
        <div class="quotes-section" id="render-quotes"></div>
        <div class="footer-actions hidden" id="footer-actions">
            <button class="action-btn next-dose" id="nav-next">换一剂 →</button>
            <button class="action-btn back-home" id="nav-home">回到首页</button>
        </div>
    </div>
`;

const html = "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\">\n<title>书方</title>\n<style>\n" + css + "\n</style>\n</head>\n<body>\n" + body + "\n<script>\nvar BOOKS = " + JSON.stringify(books) + ";\n" + js + "\n</script>\n</body>\n</html>";

fs.writeFileSync("D:/tool/suibian/书方.html", html, "utf-8");
console.log("✅ 书方.html (呼吸镜面版) 已生成, 大小:", (fs.statSync("D:/tool/suibian/书方.html").size / 1024).toFixed(0), "KB");