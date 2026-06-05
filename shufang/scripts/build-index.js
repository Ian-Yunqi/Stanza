const fs = require('fs');

// Read the working file to extract BOOKS
const src = fs.readFileSync('D:/tool/suibian/书方.html', 'utf8');
const m = src.match(/var BOOKS = \[([\s\S]*?)\];\s*\n/);
const booksData = m ? m[0].trim() : 'var BOOKS = [];';

// HTML template with placeholder
const template = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>书方</title>
<style>
:root { --bg: #fafaf9; --text: #1a1a1a; --text-light: #8a8a86; --divider: #e8e6e3; --max-width: 640px; --padding-x: 32px; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background-color: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
button { background: none; border: none; color: var(--text); cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent; }
.tag-btn, .daily-btn, .action-btn, .back-btn, .degraded-hint, .all-tags-btn, .delayed-whisper, .list-close { font-family: "PingFang SC", "Noto Sans SC", -apple-system, sans-serif; }
.guide-text, .quote-text, .book-meta, .emotion-word, .poetry-btn { font-family: "Noto Serif SC", "Source Han Serif SC", STSong, serif; }
.hidden { display: none !important; }
.view-container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--padding-x); min-height: 100vh; display: none; opacity: 0; transition: opacity 0.4s ease; }
.view-container.active { display: flex; flex-direction: column; opacity: 1; }

/* ========== 首页 Z-Index 层级体系 ========== */
.mirror-container { position: relative; width: 100vw; height: 100vh; max-width: none; padding: 0; margin: 0; display: flex; justify-content: center; align-items: center; transition: background-color 0.3s ease; }

/* Z:5 边缘括号 */
.edge-hint { position: absolute; top: 50%; transform: translateY(-50%); font-size: 32px; color: var(--text); opacity: 0.15; z-index: 5; pointer-events: none; user-select: none; }
.edge-left { left: 16px; } .edge-right { right: 16px; }

/* Z:10 触控区——左右各半屏 */
.touch-zone { position: absolute; top: 0; height: 100%; z-index: 10; }
.touch-left { left: 0; width: 50%; } .touch-right { right: 0; width: 50%; }

/* Z:20 文字缩放容器 */
.word-scaler { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100%; z-index: 20; pointer-events: none; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); will-change: transform; }
.word-scaler.clicked { transform: translate(-50%, -50%) scale(0.96); }

.emotion-word { letter-spacing: 0.2em; color: var(--text); text-align: center; position: absolute; left: 0; right: 0; margin: auto; top: -30px; opacity: 0; will-change: transform, opacity; pointer-events: auto; cursor: pointer; }
.word-short { font-size: 48px; } .word-long { font-size: 32px; letter-spacing: 0.1em; }
.emotion-word.breathing { animation: breatheAnim 5.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes breatheAnim { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 20% { opacity: 1; transform: scale(1) translateY(0); } 70% { opacity: 1; transform: scale(1.02) translateY(0); } 100% { opacity: 0; transform: scale(1.05) translateY(-5px); } }

/* Z:30 顶层交互 */
.all-tags-btn { position: absolute; top: 32px; right: var(--padding-x); font-size: 13px; color: #8a8a86; z-index: 30; cursor: pointer; letter-spacing: 0.15em; padding: 14px; text-decoration: underline; text-underline-offset: 4px; }
.daily-dose-btn-mirror { position: absolute; bottom: 12%; font-size: 14px; color: var(--text-light); letter-spacing: 0.1em; z-index: 30; padding: 10px 20px; opacity: 0.4; transition: opacity 1s ease, color 1s ease; cursor: pointer; }
.daily-dose-btn-mirror.idle-breathe { animation: pulseText 4s infinite alternate; }
.daily-dose-btn-mirror.flash-highlight { opacity: 0.9 !important; color: var(--text) !important; animation: none; }
@keyframes pulseText { 0% { opacity: 0.4; } 100% { opacity: 0.8; } }
.delayed-whisper { position: absolute; bottom: 20%; font-size: 10px; color: #ccc; letter-spacing: 0.1em; opacity: 0; pointer-events: none; z-index: 30; transition: opacity 1.5s ease; }
.delayed-whisper.show { opacity: 1; }

/* Z:40 诗集目录 */
.list-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 40; display: flex; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; }
.list-overlay.visible { opacity: 1; pointer-events: auto; }
.list-backdrop { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: var(--bg); z-index: 41; }
.list-close { position: absolute; top: 24px; left: var(--padding-x); font-size: 28px; color: #ccc; cursor: pointer; padding: 10px; z-index: 43; font-weight: 300; }
.poetry-container { position: relative; z-index: 42; width: 100%; height: 100%; overflow-y: auto; padding: 120px 0; scrollbar-width: none; -ms-overflow-style: none; }
.poetry-container::-webkit-scrollbar { display: none; }
.poetry-list { display: flex; flex-direction: column; align-items: center; gap: 80px; opacity: 0; transform: translateY(8px); transition: opacity 0.5s ease, transform 0.5s ease; }
.list-overlay.visible .poetry-list { opacity: 1; transform: translateY(0); }
.poetry-btn { color: var(--text-light); letter-spacing: 0.2em; transition: color 0.3s ease, transform 0.2s ease; cursor: pointer; }
.poetry-btn:active { color: var(--text); transform: scale(0.96); }
.poetry-btn.short-word { font-size: 32px; }
.poetry-btn.long-word { font-size: 26px; letter-spacing: 0.1em; }

/* ========== 处方页 ========== */
#dose-view { position: relative; padding-top: 40px; padding-bottom: 80px; }
.back-btn { position: absolute; top: 24px; left: var(--padding-x); font-size: 18px; color: rgba(0,0,0,0.2); padding: 10px 10px 10px 0; }
.degraded-hint { font-size: 12px; color: #b0aea8; text-align: center; margin-top: 20px; margin-bottom: 20px; }
.guide-section { margin-top: 60px; min-height: 60vh; }
.book-id { font-size: 12px; color: var(--text-light); margin-bottom: 24px; }
.guide-text p { font-size: 16px; line-height: 2.0; margin-bottom: 1.5em; text-align: justify; }
.scroll-hint { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); font-size: 24px; color: var(--text); opacity: 0.15; animation: breathe 2s ease-in-out infinite; pointer-events: none; z-index: 10; }
@keyframes breathe { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.3; } }
.quotes-section { margin-top: 100px; }
.book-meta { margin-bottom: 60px; }
.book-title { font-size: 16px; font-weight: bold; margin-bottom: 4px; }
.book-author { font-size: 14px; color: var(--text-light); }
.quote-item { margin-bottom: 60px; opacity: 0; }
.quote-text { font-size: 18px; line-height: 2.2; text-align: justify; white-space: pre-wrap; }
.quote-divider { width: 100%; height: 1px; background-color: var(--divider); margin: 30px 0 60px 0; }
.extras-box { margin-top: 80px; font-size: 12px; color: var(--text-light); line-height: 1.8; }
.end-marker { font-size: 10px; color: #ccc; text-align: center; margin-top: 60px; margin-bottom: 80px; }
.footer-actions { display: flex; flex-direction: column; align-items: center; gap: 30px; }
.action-btn { font-size: 14px; color: var(--text-light); }
.next-dose { color: var(--text); }
@media (min-width: 640px) { :root { --padding-x: 48px; } }
</style>
</head>
<body>
    <div id="home-view" class="view-container mirror-container active">
        <div class="all-tags-btn" id="btn-show-all">全部</div>
        <div class="daily-dose-btn-mirror" id="daily-btn-mirror">今日一剂</div>
        <div class="delayed-whisper" id="delayed-whisper">轻触左右边缘或空白处切换</div>
        <div class="edge-hint edge-left">&lang;</div>
        <div class="edge-hint edge-right">&rang;</div>
        <div class="touch-zone touch-left" id="zone-prev"></div>
        <div class="touch-zone touch-right" id="zone-next"></div>
        <div class="word-scaler" id="zone-enter"></div>

        <div class="list-overlay" id="list-overlay">
            <div class="list-backdrop" id="list-backdrop"></div>
            <div class="list-close" id="btn-close-all">&times;</div>
            <div class="poetry-container">
                <div class="poetry-list">
                    <button class="poetry-btn short-word" data-tag="无聊">无聊</button>
                    <button class="poetry-btn short-word" data-tag="迷茫">迷茫</button>
                    <button class="poetry-btn short-word" data-tag="厌倦">厌倦</button>
                    <button class="poetry-btn short-word" data-tag="浮躁">浮躁</button>
                    <button class="poetry-btn short-word" data-tag="疲惫">疲惫</button>
                    <button class="poetry-btn long-word" data-tag="空游无所依">空游无所依</button>
                    <button class="poetry-btn short-word" data-tag="烦闷">烦闷</button>
                    <button class="poetry-btn short-word" data-tag="平淡">平淡</button>
                </div>
            </div>
        </div>
    </div>

    <div id="dose-view" class="view-container hidden">
        <button class="back-btn" id="nav-back">&larr;</button>
        <div id="degraded-hint" class="degraded-hint hidden"></div>
        <div class="guide-section">
            <div class="book-id" id="render-id"></div>
            <div class="guide-text" id="render-guide"></div>
        </div>
        <div class="scroll-hint" id="scroll-arrow">&darr;</div>
        <div class="quotes-section" id="render-quotes"></div>
        <div class="footer-actions hidden" id="footer-actions">
            <button class="action-btn next-dose" id="nav-next">换一剂 &rarr;</button>
            <button class="action-btn back-home" id="nav-home">回到首页</button>
        </div>
    </div>

<script>
// __BOOKS_PLACEHOLDER__

var tags = ["无聊", "迷茫", "厌倦", "浮躁", "疲惫", "空游无所依", "烦闷", "平淡"];
var currentIndex = 0;
var playCount = 0;
var cycleTimer = null;
var whisperTimer = null;
var hideTimer = null;

function markHintAsSeen() {
    var whisperEl = document.getElementById("delayed-whisper");
    if (whisperTimer) clearTimeout(whisperTimer);
    if (hideTimer) clearTimeout(hideTimer);
    if (whisperEl) whisperEl.classList.remove("show");
    try { localStorage.setItem("shufang-hint-seen", "1"); } catch(e) {}
}

function initMirror() {
    var HINT_KEY = "shufang-hint-seen";
    var dailyBtn = document.getElementById("daily-btn-mirror");
    dailyBtn.classList.add("idle-breathe");

    var _hintSeen = false;
    try { _hintSeen = localStorage.getItem(HINT_KEY) === "1"; } catch(e) {}
    if (!_hintSeen) {
        var whisperEl = document.getElementById("delayed-whisper");
        whisperTimer = setTimeout(function() {
            if (whisperEl) whisperEl.classList.add("show");
            hideTimer = setTimeout(function() { markHintAsSeen(); }, 4000);
        }, 11000);
    }
    document.getElementById("zone-prev").addEventListener("click", function() {
        markHintAsSeen(); currentIndex = (currentIndex - 1 + tags.length) % tags.length; playWord(currentIndex);
    });
    document.getElementById("zone-next").addEventListener("click", function() {
        markHintAsSeen(); currentIndex = (currentIndex + 1) % tags.length; playWord(currentIndex);
    });

    var listOverlay = document.getElementById("list-overlay");
    var closeList = function(e) { if(e) e.stopPropagation(); listOverlay.classList.remove("visible"); };
    document.getElementById("btn-show-all").addEventListener("click", function(e) {
        e.stopPropagation(); markHintAsSeen(); listOverlay.classList.remove("hidden"); listOverlay.classList.add("visible");
    });
    document.getElementById("btn-close-all").addEventListener("click", closeList);
    document.getElementById("list-backdrop").addEventListener("click", closeList);
    document.querySelectorAll(".poetry-btn").forEach(function(btn) {
        btn.addEventListener("click", function(e) { e.stopPropagation(); closeList(); navigateToTag(e.target.dataset.tag); });
    });
    document.getElementById("daily-btn-mirror").addEventListener("click", function() { markHintAsSeen(); navigateToTag("daily"); });
}

function playWord(index) {
    var scalerEl = document.getElementById("zone-enter");
    var dailyBtn = document.getElementById("daily-btn-mirror");
    if (!scalerEl) return;
    scalerEl.innerHTML = "";
    var newEl = document.createElement("div");
    newEl.className = "emotion-word breathing";
    newEl.textContent = tags[index];
    newEl.classList.add(tags[index].length > 2 ? "word-long" : "word-short");
    newEl.addEventListener("click", function() {
        markHintAsSeen();
        clearTimeout(cycleTimer);
        scalerEl.classList.add("clicked");
        document.getElementById("home-view").style.backgroundColor = "hsl(40, 20%, 95%)";
        setTimeout(function() {
            scalerEl.classList.remove("clicked");
            document.getElementById("home-view").style.backgroundColor = "";
            navigateToTag(tags[currentIndex]);
        }, 300);
    });
    scalerEl.appendChild(newEl);
    if (playCount > 0 && playCount % tags.length === 2) {
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
            var rs = Math.floor(Math.random() * 3) + 1;
            currentIndex = (currentIndex + rs) % tags.length;
        }
        playWord(currentIndex);
    }, 5500);
}

// === 算法 & 缓存 ===
function isStorageAvailable() { try { var t="__t__"; localStorage.setItem(t,t); localStorage.removeItem(t); return true; } catch(e) { return false; } }
function getSeenBooks() { if(!isStorageAvailable()) return []; try { var d=localStorage.getItem("shufang-seen"); return d?JSON.parse(d):[]; } catch(e) { return []; } }
function pushSeenBook(id) { if(!isStorageAvailable()) return; try { var s=getSeenBooks(); if(!s.includes(id)) { s.push(id); if(s.length>5) s.shift(); localStorage.setItem("shufang-seen",JSON.stringify(s)); } } catch(e) {} }
function getDailyDose(ds) { if(!isStorageAvailable()) return null; return localStorage.getItem("shufang-dose-"+ds); }
function setDailyDose(ds,id) { if(!isStorageAvailable()) return; try { localStorage.setItem("shufang-dose-"+ds,id); cleanOldDoses(ds); } catch(e) {} }
function cleanOldDoses(cds) { var today=new Date(cds).getTime(); for(var i=0;i<localStorage.length;i++) { var k=localStorage.key(i); if(k&&k.startsWith("shufang-dose-")) { var kt=new Date(k.replace("shufang-dose-","")).getTime(); if(today-kt>7*24*60*60*1000) localStorage.removeItem(k); } } }

function matchBook(tag,books,seenIds) {
    if(tag==="daily") { var fresh=books.filter(function(b){return !seenIds.includes(b.id);}); var pool=fresh.length?fresh:books; return {book:pool[Math.floor(Math.random()*pool.length)],degraded:false}; }
    var pool=books.filter(function(b){return b.tags && b.tags.primary===tag;});
    var degraded=false;
    if(!pool.length||pool.every(function(b){return seenIds.includes(b.id);})) { var sp=books.filter(function(b){return b.tags&&b.tags.secondary&&b.tags.secondary.includes(tag);}); if(sp.length){pool=sp;degraded=true;} }
    var fresh=pool.filter(function(b){return !seenIds.includes(b.id);}); var candidates=fresh.length?fresh:pool;
    return {book:candidates[Math.floor(Math.random()*candidates.length)],degraded:degraded};
}

var _quoteObserver=null;
function initQuoteObserver() { if(_quoteObserver)_quoteObserver.disconnect(); _quoteObserver=new IntersectionObserver(function(entries,obs){ entries.forEach(function(entry){ if(entry.isIntersecting){ entry.target.style.opacity="1"; entry.target.style.transition="opacity 0.6s ease"; obs.unobserve(entry.target); } }); },{threshold:0.15,rootMargin:"0px 0px -50px 0px"}); document.querySelectorAll(".quote-item").forEach(function(el){_quoteObserver.observe(el);}); }
function escapeHtml(text) { var div=document.createElement("div"); div.textContent=text; return div.innerHTML; }

function renderHome() { var dv=document.getElementById("dose-view"),hv=document.getElementById("home-view"); dv.classList.remove("active"); setTimeout(function(){ dv.classList.add("hidden"); hv.classList.remove("hidden"); void hv.offsetWidth; hv.classList.add("active"); currentIndex=0; playCount=0; if(cycleTimer) clearTimeout(cycleTimer); playWord(currentIndex); },400); }

function renderDose(bookInfo,currentTag) {
    var book=bookInfo.book, degraded=bookInfo.degraded;
    var hintEl=document.getElementById("degraded-hint");
    if(degraded&&currentTag!=="daily") { hintEl.textContent="本日“"+currentTag+"”之药已尽，以下为相近之方"; hintEl.classList.remove("hidden"); }
    else { hintEl.classList.add("hidden"); }
    document.getElementById("render-id").textContent=book.id+" ·";
    document.getElementById("render-guide").innerHTML=book.guide.split("\n").filter(function(p){return p.trim();}).map(function(p){return "<p>"+escapeHtml(p)+"</p>";}).join("");
    var qHtml="<div class=\"book-meta\"><div class=\"book-title\">"+escapeHtml(book.title)+"</div><div class=\"book-author\">"+escapeHtml(book.author)+"</div></div><div class=\"quote-divider\"></div>";
    book.quotes.forEach(function(q){ var text=typeof q==='string'?q:q.text; qHtml+="<div class=\"quote-item\"><div class=\"quote-text\">"+escapeHtml(text)+"</div><div class=\"quote-divider\"></div></div>"; });
    qHtml+="<div class=\"extras-box\"><div>"+escapeHtml(book.extras.availability)+"</div><div style=\"margin-top: 8px;\">如果你喜欢："+escapeHtml(book.extras.ifYouLike)+"</div></div><div class=\"end-marker\">□</div>";
    document.getElementById("render-quotes").innerHTML=qHtml;
    var hv=document.getElementById("home-view"),dv=document.getElementById("dose-view"); hv.classList.remove("active"); window.scrollTo(0,0);
    setTimeout(function(){ hv.classList.add("hidden"); dv.classList.remove("hidden"); document.getElementById("scroll-arrow").style.display=(document.querySelector(".guide-section").offsetHeight<window.innerHeight*0.8)?"none":"block"; document.getElementById("footer-actions").classList.remove("hidden"); void dv.offsetWidth; dv.classList.add("active"); initQuoteObserver(); },400);
}

function navigateToTag(tag) { var url=new URL(window.location); url.searchParams.set("tag",tag); window.history.pushState({},"",url); handleUrlChange(); }
function goHome() { var url=new URL(window.location); url.searchParams.delete("tag"); window.history.pushState({},"",url); handleUrlChange(); }

function handleUrlChange() {
    var tag=new URLSearchParams(window.location.search).get("tag");
    if(!tag) { renderHome(); return; }
    var matchResult;
    if(tag==="daily") { var today=new Date().toLocaleDateString("zh-CN"),savedId=getDailyDose(today); if(savedId){var b=BOOKS.find(function(x){return x.id===savedId;});matchResult=b?{book:b,degraded:false}:null;} if(!matchResult){matchResult=matchBook("daily",BOOKS,getSeenBooks());if(matchResult.book)setDailyDose(today,matchResult.book.id);} }
    else { matchResult=matchBook(tag,BOOKS,getSeenBooks()); }
    if(matchResult&&matchResult.book) { pushSeenBook(matchResult.book.id); renderDose(matchResult,tag); }
    else { goHome(); }
}

document.addEventListener("DOMContentLoaded",function(){
    if(!BOOKS||BOOKS.length===0) { document.body.innerHTML="<div style=\"text-align:center;margin-top:50px;\">书籍数据缺失</div>"; return; }
    initMirror();
    document.getElementById("nav-back").addEventListener("click",goHome);
    document.getElementById("nav-home").addEventListener("click",goHome);
    document.getElementById("nav-next").addEventListener("click",function(){var ct=new URLSearchParams(window.location.search).get("tag");navigateToTag(ct||"daily");});
    window.addEventListener("scroll",function(){var arrow=document.getElementById("scroll-arrow");if(window.scrollY>150){arrow.style.opacity="0";arrow.style.transition="opacity 0.3s";}else{arrow.style.opacity="";arrow.style.transition="";}});
    handleUrlChange();
});
<\/script>
</body>
</html>`;

// Splice
const final = template.replace('// __BOOKS_PLACEHOLDER__', booksData);
fs.writeFileSync('D:/tool/suibian/shufang/index.html', final);
console.log('Done. Size:', final.length, 'bytes');
console.log('BOOKS length:', booksData.length, 'bytes');
