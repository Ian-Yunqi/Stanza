/* ==========================================================================
   书方 · 极简交互与静谧选词引擎（少按钮、自然手势、语义与空间配伍）
   ========================================================================== */
(function () {
    "use strict";

    var BOOKS = Array.isArray(window.BOOKS) ? window.BOOKS : [];

    var MOODS = [
        {
            word: "迷茫",
            whisper: "选项太多，反而听不见自己真正的声音",
            poems: [
                { verse: "昨夜西风凋碧树，独上高楼，望尽天涯路", source: "晏殊 ·《蝶恋花》" },
                { verse: "行到水穷处，坐看云起时", source: "王维 ·《终南别业》" },
                { verse: "欲渡黄河冰塞川，将登太行雪满山", source: "李白 ·《行路难》" }
            ],
            pos: { x: 30, y: 24 },
            keywords: ["迷茫", "困惑", "不知道", "选择", "前途", "方向", "毕业", "就业", "考研", "专业", "未来", "十字路口", "徘徊", "找不到", "自我", "成长", "彷徨", "怎么办", "规划", "西风", "天涯路"]
        },
        {
            word: "浮躁",
            whisper: "时间感被调快，注意力在信息流里被切碎",
            poems: [
                { verse: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生", source: "苏轼 ·《定风波》" },
                { verse: "万物静观皆自得，四时佳兴与人同", source: "程颢 ·《秋日》" },
                { verse: "结庐在人境，而无车马喧", source: "陶渊明 ·《饮酒》" }
            ],
            pos: { x: 72, y: 24 },
            keywords: ["浮躁", "刷手机", "短视频", "焦虑", "静不下", "专注", "分心", "急躁", "心慌", "拖延", "上瘾", "耐心", "太快", "停不下来", "信息过载", "躁动", "急功近利", "一蓑烟雨"]
        },
        {
            word: "烦闷",
            whisper: "感官的闸门关久了，胸口堵着一口散不去的闷气",
            poems: [
                { verse: "若无闲事挂心头，便是人间好时节", source: "无门慧开" },
                { verse: "闲来无事不从容，睡觉东窗日已红", source: "程颢 ·《秋日》" },
                { verse: "小舟从此逝，江海寄余生", source: "苏轼 ·《临江仙》" }
            ],
            pos: { x: 76, y: 42 },
            keywords: ["烦闷", "心烦", "郁闷", "烦躁", "不爽", "憋屈", "闷", "窝火", "委屈", "生气", "情绪", "压抑", "堵得慌", "难受", "想发火", "坏心情", "好时节"]
        },
        {
            word: "无聊",
            whisper: "太久没给大脑喂需要咀嚼的东西，越滑越空",
            poems: [
                { verse: "昼长吟罢蝉鸣树，夜深烬落萤入帷", source: "翁森 ·《四时读书乐》" },
                { verse: "绿蚁新醅酒，红泥小火炉", source: "白居易 ·《问刘十九》" },
                { verse: "因过竹院逢僧话，偷得浮生半日闲", source: "李涉 ·《题鹤林寺僧舍》" }
            ],
            pos: { x: 70, y: 78 },
            keywords: ["无聊", "没事干", "发呆", "消磨", "打发时间", "无趣", "没意思", "摸鱼", "闲着", "空虚", "百无聊赖", "找乐子", "猎奇", "半日闲"]
        },
        {
            word: "疲惫",
            whisper: "不是身体累，是脑子里同时跑着太多别人的课题",
            poems: [
                { verse: "长恨此身非我有，何时忘却营营", source: "苏轼 ·《临江仙》" },
                { verse: "醉后不知天在水，满船清梦压星河", source: "唐温如 ·《题龙阳县青草湖》" },
                { verse: "今夜偏知春气暖，虫声新透绿窗纱", source: "刘方平 ·《月夜》" }
            ],
            pos: { x: 30, y: 78 },
            keywords: ["疲惫", "累", "内耗", "精神内耗", "压力", "加班", "熬夜", "睡眠", "睡不着", "失眠", "社恐", "人际", "讨好", "社交", "崩溃", "筋疲力尽", "好累", "不想说话", "躺平", "星河"]
        },
        {
            word: "厌倦",
            whisper: "对日复一日的轨道生出倦意，想短暂离开片刻",
            poems: [
                { verse: "久在樊笼里，复得返自然", source: "陶渊明 ·《归园田居》" },
                { verse: "且放白鹿青崖间，须行即骑访名山", source: "李白 ·《梦游天姥吟留别》" },
                { verse: "世界微尘里，吾宁爱与憎", source: "李商隐 ·《北青萝》" }
            ],
            pos: { x: 64, y: 62 },
            keywords: ["厌倦", "腻了", "麻木", "重复", "逃离", "辞职", "退学", "没动力", "摆烂", "倦怠", "提不起劲", "敷衍", "无感", "讨厌日常", "复印机", "樊笼"]
        },
        {
            word: "空游无所依",
            whisper: "没有具体的痛处，也没有具体的锚点，像漂浮在半空",
            poems: [
                { verse: "潭中鱼可百许头，皆若空游无所依", source: "柳宗元 ·《小石潭记》" },
                { verse: "人生天地间，忽如远行客", source: "《古诗十九首》" },
                { verse: "孤舟蓑笠翁，独钓寒江雪", source: "柳宗元 ·《江雪》" }
            ],
            pos: { x: 26, y: 42 },
            keywords: ["空游无所依", "孤独", "寂寞", "空荡", "漂浮", "意义", "存在", "虚无", "深夜", "半夜", "睡不着", "失眠", "emo", "疏离", "没人懂", "一个人", "无依", "失重", "流浪", "远方", "远行客"]
        },
        {
            word: "平淡",
            whisper: "日子安静得像白开水，其实正适合重新看见微光",
            poems: [
                { verse: "人间有味是清欢", source: "苏轼 ·《浣溪沙》" },
                { verse: "采菊东篱下，悠然见南山", source: "陶渊明 ·《饮酒》" },
                { verse: "山中无历日，寒尽不知年", source: "太上隐者 ·《答人》" }
            ],
            pos: { x: 28, y: 62 },
            keywords: ["平淡", "平静", "日常", "温柔", "慢下来", "散步", "烟火", "治愈", "生活", "发呆", "晒太阳", "小确幸", "安静", "普通", "琐碎", "微光", "清欢", "南山"]
        }
    ];

    var KEYS = {
        SEEN: "shufang-seen-v2",
        LEGACY_SEEN: "shufang-seen",
        SAVED: "shufang-saved-v2",
        HISTORY: "shufang-history-v2",
        SCALE: "shufang-font-scale",
        DOSE_PREFIX: "shufang-dose-"
    };

    var state = {
        view: "home",
        moodIndex: Math.floor(Math.random() * MOODS.length),
        poemSeed: Math.floor(Math.random() * 3),
        cycleTimer: null,
        interludeTimer: null,
        interludeFinish: null,
        wheelLock: 0,
        starTags: [],
        currentBook: null,
        currentContext: { mode: "tag", tags: [], degraded: false, reason: "", poem: null },
        drawerTab: "catalog",
        drawerQuery: "",
        cardPaper: "paper",
        cardQuoteIdx: 0,
        quoteObserver: null,
        snackbarTimer: null
    };

    // ======== Storage ========
    function storageOk() {
        try { localStorage.setItem("__sf__", "1"); localStorage.removeItem("__sf__"); return true; }
        catch (e) { return false; }
    }

    function readJson(key, fallback) {
        if (!storageOk()) return fallback;
        try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
        catch (e) { return fallback; }
    }

    function writeJson(key, val) {
        if (!storageOk()) return;
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    }

    function getSeenIds() {
        var list = readJson(KEYS.SEEN, null);
        if (!list) { list = readJson(KEYS.LEGACY_SEEN, []); writeJson(KEYS.SEEN, list); }
        return Array.isArray(list) ? list : [];
    }

    function markSeen(bookId) {
        var seen = getSeenIds();
        if (seen.indexOf(bookId) === -1) { seen.push(bookId); writeJson(KEYS.SEEN, seen); }
        var hist = readJson(KEYS.HISTORY, []).filter(function (x) { return x.id !== bookId; });
        hist.unshift({ id: bookId, at: Date.now() });
        if (hist.length > 60) hist = hist.slice(0, 60);
        writeJson(KEYS.HISTORY, hist);
        updateCounters();
    }

    function clearSeenPool() {
        writeJson(KEYS.SEEN, []);
        updateCounters();
        showSnackbar("已重置推荐去重记录");
    }

    function getSavedIds() {
        var list = readJson(KEYS.SAVED, []);
        return Array.isArray(list) ? list : [];
    }

    function toggleSaved(bookId) {
        var list = getSavedIds();
        var idx = list.indexOf(bookId);
        var added;
        if (idx >= 0) { list.splice(idx, 1); added = false; }
        else { list.unshift(bookId); added = true; }
        writeJson(KEYS.SAVED, list);
        updateCounters();
        return added;
    }

    function getTodayIso() {
        var d = new Date();
        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");
    }

    function getDailyDoseId(iso) {
        return storageOk() ? localStorage.getItem(KEYS.DOSE_PREFIX + iso) : null;
    }

    function setDailyDoseId(iso, id) {
        if (!storageOk()) return;
        try {
            localStorage.setItem(KEYS.DOSE_PREFIX + iso, id);
            var now = Date.now();
            var stale = [];
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.indexOf(KEYS.DOSE_PREFIX) === 0) {
                    var ts = Date.parse(k.slice(KEYS.DOSE_PREFIX.length));
                    if (!isNaN(ts) && now - ts > 7 * 86400000) stale.push(k);
                }
            }
            stale.forEach(function (k) { localStorage.removeItem(k); });
        } catch (e) {}
    }

    // ======== Utilities ========
    function escapeHtml(text) {
        var div = document.createElement("div");
        div.textContent = text == null ? "" : String(text);
        return div.innerHTML;
    }

    function getBookById(id) {
        for (var i = 0; i < BOOKS.length; i++) {
            if (BOOKS[i].id === id) return BOOKS[i];
        }
        return null;
    }

    function getMoodObj(word) {
        for (var i = 0; i < MOODS.length; i++) {
            if (MOODS[i].word === word) return MOODS[i];
        }
        return MOODS[0];
    }

    function pickPoemForMood(word, useSeed) {
        var m = getMoodObj(word);
        var list = m.poems || [];
        if (!list.length) return { verse: m.whisper, source: "" };
        var idx = useSeed ? (state.poemSeed % list.length) : Math.floor(Math.random() * list.length);
        return list[idx];
    }

    // ======== 诗引过场（先出诗句，再展书方） ========
    function dismissPoemInterlude() {
        if (state.interludeTimer) { clearTimeout(state.interludeTimer); state.interludeTimer = null; }
        var el = document.getElementById("poem-interlude");
        el.classList.remove("visible");
        el.setAttribute("aria-hidden", "true");
        if (typeof state.interludeFinish === "function") {
            var fn = state.interludeFinish;
            state.interludeFinish = null;
            fn();
        }
    }

    function playPoemInterlude(label, poem, onDone) {
        if (state.interludeTimer) clearTimeout(state.interludeTimer);
        var el = document.getElementById("poem-interlude");
        document.getElementById("interlude-mood").textContent = label || "";
        document.getElementById("interlude-verse").textContent = "「" + poem.verse + "」";
        document.getElementById("interlude-source").textContent = poem.source ? "—— " + poem.source : "";

        state.interludeFinish = onDone;
        el.setAttribute("aria-hidden", "false");
        void el.offsetWidth;
        el.classList.add("visible");

        state.interludeTimer = setTimeout(function () {
            dismissPoemInterlude();
        }, 1600);
    }

    function bookHasTag(book, tag) {
        return book.tags.primary === tag ||
            (book.tags.secondary && book.tags.secondary.indexOf(tag) !== -1);
    }

    function matchCompoundBooks(tagList) {
        if (!tagList || !tagList.length) return [];
        var exact = BOOKS.filter(function (b) {
            return tagList.every(function (t) { return bookHasTag(b, t); });
        });
        if (exact.length) {
            return exact.map(function (b) {
                var score = tagList.reduce(function (s, t) { return s + (b.tags.primary === t ? 2 : 1); }, 0);
                return { book: b, score: score, exact: true };
            }).sort(function (a, b) { return b.score - a.score; });
        }
        return BOOKS.map(function (b) {
            var hits = 0, score = 0;
            tagList.forEach(function (t) {
                if (b.tags.primary === t) { hits++; score += 2; }
                else if (b.tags.secondary && b.tags.secondary.indexOf(t) !== -1) { hits++; score += 1; }
            });
            return { book: b, hits: hits, score: score, exact: false };
        }).filter(function (x) { return x.hits > 0; })
          .sort(function (a, b) { return b.score - a.score; });
    }

    function pickBestBook(tags, excludeId) {
        var seen = getSeenIds();
        if (!tags || !tags.length || tags[0] === "random") {
            var pool = BOOKS.filter(function (b) { return b.id !== excludeId; });
            var fresh = pool.filter(function (b) { return seen.indexOf(b.id) === -1; });
            var list = fresh.length ? fresh : pool;
            return { book: list[Math.floor(Math.random() * list.length)], degraded: false, reason: "" };
        }
        if (tags.length === 1) {
            var tag = tags[0];
            var primary = BOOKS.filter(function (b) { return b.tags.primary === tag && b.id !== excludeId; });
            var freshP = primary.filter(function (b) { return seen.indexOf(b.id) === -1; });
            if (freshP.length) return { book: freshP[Math.floor(Math.random() * freshP.length)], degraded: false, reason: "" };

            var secondary = BOOKS.filter(function (b) {
                return b.tags.secondary && b.tags.secondary.indexOf(tag) !== -1 && b.id !== excludeId;
            });
            var freshS = secondary.filter(function (b) { return seen.indexOf(b.id) === -1; });
            if (freshS.length) {
                return { book: freshS[Math.floor(Math.random() * freshS.length)], degraded: true, reason: "本日「" + tag + "」主治之药已尽，以下为相近之方" };
            }
            var fallback = primary.concat(secondary);
            if (!fallback.length) fallback = BOOKS;
            return { book: fallback[Math.floor(Math.random() * fallback.length)], degraded: true, reason: "「" + tag + "」之方已悉数阅遍，为你重温此味" };
        }

        var ranked = matchCompoundBooks(tags).filter(function (r) { return r.book.id !== excludeId; });
        if (!ranked.length) ranked = matchCompoundBooks(tags);
        var exactPool = ranked.filter(function (r) { return r.exact; });
        var freshE = exactPool.filter(function (r) { return seen.indexOf(r.book.id) === -1; });
        if (freshE.length) {
            var top = freshE[0].score;
            var cands = freshE.filter(function (r) { return r.score === top; });
            return { book: cands[Math.floor(Math.random() * cands.length)].book, degraded: false, reason: "" };
        }
        if (exactPool.length) {
            return { book: exactPool[Math.floor(Math.random() * exactPool.length)].book, degraded: true, reason: "「" + tags.join(" + ") + "」复方已阅遍，为你重温此味" };
        }
        var freshAny = ranked.filter(function (r) { return seen.indexOf(r.book.id) === -1; });
        var pick = freshAny.length ? freshAny[0] : ranked[0];
        return { book: pick.book, degraded: true, reason: "暂无单册覆盖全部心境，以下为最贴近之方" };
    }

    function showSnackbar(msg) {
        var el = document.getElementById("snackbar");
        el.textContent = msg;
        el.classList.add("show");
        if (state.snackbarTimer) clearTimeout(state.snackbarTimer);
        state.snackbarTimer = setTimeout(function () { el.classList.remove("show"); }, 2300);
    }

    function copyText(text, msg) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () { showSnackbar(msg); })
                .catch(function () { fallbackCopy(text, msg); });
        } else {
            fallbackCopy(text, msg);
        }
    }

    function fallbackCopy(text, msg) {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); showSnackbar(msg); } catch (e) {}
        document.body.removeChild(ta);
    }

    function applyFontScale(scale) {
        document.documentElement.style.setProperty("--reading-scale", String(scale));
        if (storageOk()) localStorage.setItem(KEYS.SCALE, String(scale));
        document.querySelectorAll(".font-size-btn").forEach(function (b) {
            b.classList.toggle("active", Number(b.dataset.scale) === Number(scale));
        });
    }

    function updateCounters() {
        var seen = getSeenIds();
        var saved = getSavedIds();
        var hist = readJson(KEYS.HISTORY, []);

        var drawerBtn = document.getElementById("btn-open-drawer");
        if (drawerBtn) drawerBtn.classList.toggle("text-link-dot", saved.length > 0);

        var tabCat = document.getElementById("tab-catalog-label");
        if (tabCat) tabCat.textContent = "全部 (" + BOOKS.length + ")";
        document.getElementById("tab-saved-label").textContent = "收藏 (" + saved.length + ")";
        document.getElementById("tab-history-label").textContent = "足迹 (" + hist.length + ")";
        document.getElementById("drawer-progress-text").textContent = "已服 " + seen.length + " / " + BOOKS.length + " 味";

        var savedDaily = getDailyDoseId(getTodayIso());
        var dailyBook = savedDaily ? getBookById(savedDaily) : null;
        document.getElementById("daily-sub").textContent = dailyBook ? "· 《" + dailyBook.title + "》" : "";
    }

    // ======== Home Breathing Mirror + Quiet Mood Strip ========
    function renderMoodStrip() {
        var strip = document.getElementById("mood-strip");
        strip.innerHTML = "";
        MOODS.forEach(function (m, idx) {
            var btn = document.createElement("button");
            btn.className = "mood-word-link";
            btn.textContent = m.word;
            btn.dataset.index = String(idx);
            btn.addEventListener("mouseenter", function () {
                if (state.moodIndex !== idx) selectHeroMood(idx, true);
            });
            btn.addEventListener("click", function () {
                openPrescriptionByTags([m.word], null, true);
            });
            strip.appendChild(btn);
        });
    }

    function renderHeroWord() {
        var mood = MOODS[state.moodIndex];
        var poem = pickPoemForMood(mood.word, true);
        var wordEl = document.getElementById("emotion-display");
        wordEl.className = "emotion-word " + (mood.word.length > 2 ? "word-long" : "word-short");
        wordEl.textContent = mood.word;
        void wordEl.offsetWidth;
        wordEl.classList.add("animate-in");

        document.getElementById("emotion-whisper").textContent = "「" + poem.verse + "」";
        document.getElementById("emotion-poem-source").textContent = poem.source;

        document.querySelectorAll(".mood-word-link").forEach(function (el, idx) {
            el.classList.toggle("active", idx === state.moodIndex);
        });
    }

    function stopCycleTimer() {
        if (state.cycleTimer) { clearTimeout(state.cycleTimer); state.cycleTimer = null; }
    }

    function scheduleCycle() {
        stopCycleTimer();
        if (state.view !== "home") return;
        state.cycleTimer = setTimeout(function () {
            if (document.activeElement && document.activeElement.id === "symptom-search") {
                scheduleCycle();
                return;
            }
            state.moodIndex = (state.moodIndex + 1) % MOODS.length;
            renderHeroWord();
            scheduleCycle();
        }, 6200);
    }

    function selectHeroMood(index, resetTimer) {
        state.moodIndex = (index + MOODS.length) % MOODS.length;
        renderHeroWord();
        if (resetTimer) scheduleCycle();
    }

    // ======== Google Pill Search (支持自然语言、多词复方、书名/作者) ========
    function initSearch() {
        var input = document.getElementById("symptom-search");
        var clearBtn = document.getElementById("search-clear");
        var dropdown = document.getElementById("search-dropdown");

        function closeDropdown() { dropdown.classList.add("hidden"); }

        function renderResults(raw) {
            var q = raw.trim().toLowerCase();
            clearBtn.classList.toggle("hidden", !q);
            if (!q) { closeDropdown(); return; }

            // Split spaces/commas to support natural compound input like "迷茫 疲惫"
            var tokens = q.split(/[\s,，+、]+/).filter(Boolean);

            var matchedMoods = [];
            MOODS.forEach(function (m) {
                var hit = tokens.some(function (tok) {
                    return m.keywords.some(function (kw) {
                        var k = kw.toLowerCase();
                        return tok.indexOf(k) !== -1 || k.indexOf(tok) !== -1;
                    }) || m.whisper.indexOf(tok) !== -1;
                });
                if (hit) matchedMoods.push(m);
            });

            var matchedBooks = BOOKS.filter(function (b) {
                var hay = (b.title + " " + b.author + " " + b.summary + " " + b.tags.primary + " " + (b.tags.secondary || []).join(" ")).toLowerCase();
                return tokens.every(function (tok) { return hay.indexOf(tok) !== -1; });
            }).slice(0, 5);

            var html = "";
            if (matchedMoods.length >= 2) {
                var combo = [matchedMoods[0].word, matchedMoods[1].word];
                var cList = matchCompoundBooks(combo);
                var exactCount = cList.filter(function (x) { return x.exact; }).length;
                var cSub = exactCount > 0
                    ? "精准兼治两味心境，共 " + exactCount + " 味"
                    : "综合此刻的多重状态，推荐相近书方";
                html += '<div class="dropdown-label">复方配伍</div>';
                html +=
                    '<button class="dropdown-item" data-action="compound" data-tags="' + escapeHtml(combo.join(",")) + '">' +
                        '<div class="dropdown-item-main">' +
                            '<span class="dropdown-item-title">' + escapeHtml(combo.join(" + ")) + '</span>' +
                            '<span class="dropdown-item-sub">' + cSub + '</span>' +
                        '</div>' +
                        '<span class="dropdown-hint">入方 →</span>' +
                    '</button>';
            }

            if (matchedMoods.length) {
                html += '<div class="dropdown-label">匹配心境</div>';
                matchedMoods.slice(0, 3).forEach(function (m) {
                    html +=
                        '<button class="dropdown-item" data-action="mood" data-tag="' + escapeHtml(m.word) + '">' +
                            '<div class="dropdown-item-main">' +
                                '<span class="dropdown-item-title">' + escapeHtml(m.word) + '</span>' +
                                '<span class="dropdown-item-sub">' + escapeHtml(m.whisper) + '</span>' +
                            '</div>' +
                            '<span class="dropdown-hint">→</span>' +
                        '</button>';
                });
            }

            if (matchedBooks.length) {
                html += '<div class="dropdown-label">典藏书方</div>';
                matchedBooks.forEach(function (b) {
                    html +=
                        '<button class="dropdown-item" data-action="book" data-id="' + escapeHtml(b.id) + '">' +
                            '<div class="dropdown-item-main">' +
                                '<span class="dropdown-item-title">《' + escapeHtml(b.title) + '》 <span style="color:var(--text-light);font-size:12px;">' + escapeHtml(b.author.split("（")[0]) + '</span></span>' +
                                '<span class="dropdown-item-sub">' + escapeHtml(b.summary) + '</span>' +
                            '</div>' +
                            '<span class="dropdown-hint">' + escapeHtml(b.tags.primary) + '</span>' +
                        '</button>';
                });
            }

            if (!html) {
                html =
                    '<div class="dropdown-empty">' +
                        '未寻见完全相符之词，<button class="inline-book-link" data-action="random">随缘取一味</button>' +
                    '</div>';
            }

            dropdown.innerHTML = html;
            dropdown.classList.remove("hidden");

            dropdown.querySelectorAll("[data-action]").forEach(function (btn) {
                btn.addEventListener("click", function () {
                    var act = btn.dataset.action;
                    closeDropdown();
                    input.value = "";
                    clearBtn.classList.add("hidden");
                    if (act === "mood") openPrescriptionByTags([btn.dataset.tag], null, true);
                    else if (act === "compound") openPrescriptionByTags(btn.dataset.tags.split(","), null, true);
                    else if (act === "book") openPrescriptionById(btn.dataset.id, null, false);
                    else if (act === "random") openPrescriptionByTags(["random"], null, true);
                });
            });
        }

        input.addEventListener("input", function () { renderResults(input.value); });
        input.addEventListener("focus", function () { if (input.value.trim()) renderResults(input.value); });
        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                var first = dropdown.querySelector("[data-action]");
                if (first) { e.preventDefault(); first.click(); }
                else if (!input.value.trim()) {
                    e.preventDefault();
                    openPrescriptionByTags([MOODS[state.moodIndex].word]);
                }
            } else if (e.key === "Escape") {
                closeDropdown();
                input.blur();
            }
        });
        clearBtn.addEventListener("click", function () {
            input.value = "";
            clearBtn.classList.add("hidden");
            closeDropdown();
            input.focus();
        });
        document.addEventListener("click", function (e) {
            if (!e.target.closest(".search-pill-wrap")) closeDropdown();
        });
    }

    // ======== Unified Fullscreen「心境图」（散落星空 × 二维情绪空间） ========
    function initStarSpace() {
        var overlay = document.getElementById("star-overlay");
        var canvas = document.getElementById("star-canvas");
        var ring = document.getElementById("star-cursor-ring");
        var readout = document.getElementById("star-readout");

        canvas.innerHTML = "";
        MOODS.forEach(function (m, idx) {
            var btn = document.createElement("button");
            btn.className = "star-node";
            btn.dataset.tag = m.word;
            btn.style.left = m.pos.x + "%";
            btn.style.top = m.pos.y + "%";
            btn.style.setProperty("--dur", (5 + (idx % 4) * 0.7) + "s");
            btn.style.setProperty("--delay", (-0.9 * idx) + "s");
            var isLong = m.word.length > 2;
            var p0 = m.poems && m.poems[0] ? m.poems[0].verse : m.whisper;
            btn.innerHTML =
                '<span class="star-node-word' + (isLong ? " is-long" : "") + '">' + escapeHtml(m.word) + "</span>" +
                '<span class="star-node-sub">' + escapeHtml(p0) + "</span>";
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                closeStarOverlay();
                openPrescriptionByTags([m.word], null, true);
            });
            canvas.appendChild(btn);
        });

        function evalPos(clientX, clientY) {
            var rect = canvas.getBoundingClientRect();
            var px = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
            var py = Math.max(8, Math.min(92, ((clientY - rect.top) / rect.height) * 100));

            ring.style.left = clientX + "px";
            ring.style.top = clientY + "px";
            ring.classList.add("active");

            var ranked = MOODS.map(function (m) {
                var dx = m.pos.x - px, dy = m.pos.y - py;
                return { mood: m, dist: Math.sqrt(dx * dx + dy * dy) };
            }).sort(function (a, b) { return a.dist - b.dist; });

            var chosen = [ranked[0].mood.word];
            if (ranked[0].dist > 9 && (ranked[1].dist < 30 || ranked[1].dist - ranked[0].dist < 14)) {
                chosen.push(ranked[1].mood.word);
            }
            state.starTags = chosen;

            canvas.querySelectorAll(".star-node").forEach(function (el) {
                el.classList.toggle("near", chosen.indexOf(el.dataset.tag) !== -1);
            });

            readout.textContent = chosen.length > 1
                ? "落于两念之间 · 轻点配取复方「" + chosen.join(" + ") + "」"
                : "轻点取一味「" + chosen[0] + "」";
        }

        overlay.addEventListener("pointermove", function (e) {
            if (!overlay.classList.contains("visible")) return;
            evalPos(e.clientX, e.clientY);
        });

        overlay.addEventListener("click", function (e) {
            if (e.target.closest(".star-overlay-bar") || e.target.closest(".star-node")) return;
            evalPos(e.clientX, e.clientY);
            if (state.starTags.length) {
                closeStarOverlay();
                openPrescriptionByTags(state.starTags.slice(), null, true);
            }
        });
    }

    function openStarOverlay() {
        var overlay = document.getElementById("star-overlay");
        overlay.classList.add("visible");
        overlay.setAttribute("aria-hidden", "false");
        stopCycleTimer();
    }

    function closeStarOverlay() {
        var overlay = document.getElementById("star-overlay");
        overlay.classList.remove("visible");
        overlay.setAttribute("aria-hidden", "true");
        document.getElementById("star-cursor-ring").classList.remove("active");
        if (state.view === "home") scheduleCycle();
    }

    // ======== Prescription View ========
    function formatIfYouLike(text, currentId) {
        var escaped = escapeHtml(text);
        BOOKS.forEach(function (b) {
            if (b.id === currentId) return;
            var shortTitle = b.title.split("：")[0];
            var pattern = "《" + escapeHtml(shortTitle) + "》";
            if (escaped.indexOf(pattern) !== -1) {
                var html = '<button class="inline-book-link" data-jump-book="' + escapeHtml(b.id) + '" title="翻开《' + escapeHtml(b.title) + '》">' + pattern + "</button>";
                escaped = escaped.split(pattern).join(html);
            }
        });
        return escaped;
    }

    function estimateReadMinutes(book) {
        var chars = (book.guide || "").length + (book.quotes || []).join("").length;
        return Math.max(1, Math.round(chars / 480));
    }

    function updateBookmarkIcon() {
        if (!state.currentBook) return;
        var saved = getSavedIds().indexOf(state.currentBook.id) !== -1;
        var btn = document.getElementById("btn-bookmark");
        btn.classList.toggle("active", saved);
        btn.title = saved ? "已收入药匣（点击移出）" : "收入药匣";
        btn.querySelector("svg").setAttribute("fill", saved ? "currentColor" : "none");
    }

    function initQuoteObserver() {
        if (state.quoteObserver) state.quoteObserver.disconnect();
        var items = document.querySelectorAll(".quote-item");
        if (!("IntersectionObserver" in window)) {
            items.forEach(function (c) { c.classList.add("in-view"); });
            return;
        }
        state.quoteObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
        items.forEach(function (c) { state.quoteObserver.observe(c); });
    }

    function renderDoseView(book, ctx) {
        state.view = "dose";
        state.currentBook = book;
        state.currentContext = ctx;
        stopCycleTimer();
        closeMoreMenu();
        markSeen(book.id);

        document.getElementById("brand-home-btn").classList.add("hidden");
        document.getElementById("home-top-right").classList.add("hidden");
        document.getElementById("dose-top-left").classList.remove("hidden");
        document.getElementById("dose-top-right").classList.remove("hidden");
        document.getElementById("dose-scroll-title").textContent = "《" + book.title + "》";
        document.getElementById("dose-scroll-title").classList.remove("visible");
        document.getElementById("reading-progress-track").classList.add("active");

        var hintEl = document.getElementById("degraded-hint");
        if (ctx.degraded && ctx.reason) {
            document.getElementById("degraded-hint-text").textContent = ctx.reason;
            hintEl.classList.remove("hidden");
        } else {
            hintEl.classList.add("hidden");
        }

        var poem = ctx.poem || pickPoemForMood(book.tags.primary, false);
        var epiEl = document.getElementById("render-poem-epigraph");
        if (poem && poem.verse) {
            epiEl.innerHTML = "「" + escapeHtml(poem.verse) + "」" +
                (poem.source ? '<span class="rx-poem-epigraph-src">—— ' + escapeHtml(poem.source) + "</span>" : "");
            epiEl.classList.remove("hidden");
        } else {
            epiEl.classList.add("hidden");
        }

        document.getElementById("render-id").textContent = book.id;
        document.getElementById("render-read-time").textContent = "约 " + estimateReadMinutes(book) + " 分钟";
        document.getElementById("render-title").textContent = book.title;
        document.getElementById("render-author").textContent = book.author;

        var summaryEl = document.getElementById("render-summary");
        summaryEl.textContent = book.summary || "";
        summaryEl.classList.toggle("hidden", !book.summary);

        updateBookmarkIcon();

        document.getElementById("render-guide").innerHTML = book.guide.split("\n")
            .filter(function (p) { return p.trim(); })
            .map(function (p) { return "<p>" + escapeHtml(p) + "</p>"; })
            .join("");

        var quotesWrap = document.getElementById("render-quotes");
        quotesWrap.innerHTML = "";
        book.quotes.forEach(function (q, idx) {
            var item = document.createElement("div");
            item.className = "quote-item";
            item.innerHTML =
                '<div class="quote-text">' + escapeHtml(q) + "</div>" +
                '<div class="quote-hover-tools">' +
                    '<button class="whisper-action btn-copy-quote">复制</button>' +
                    '<button class="whisper-action btn-quote-card">制笺</button>' +
                "</div>";
            item.querySelector(".btn-copy-quote").addEventListener("click", function () {
                copyText(q + "\n—— " + book.author + "《" + book.title + "》", "已复制摘录");
            });
            item.querySelector(".btn-quote-card").addEventListener("click", function () {
                openCardModal(idx);
            });
            quotesWrap.appendChild(item);
        });

        var extrasEl = document.getElementById("render-extras");
        extrasEl.innerHTML =
            "<div>" + escapeHtml(book.extras.availability) + "</div>" +
            "<div>如果你喜欢：" + formatIfYouLike(book.extras.ifYouLike, book.id) + "</div>";
        extrasEl.querySelectorAll("[data-jump-book]").forEach(function (btn) {
            btn.addEventListener("click", function () { openPrescriptionById(btn.dataset.jumpBook, null); });
        });

        var nextText = "换一味 →";
        if (ctx.mode === "compound" && ctx.tags.length > 1) nextText = "再换一味「" + ctx.tags.join(" + ") + "」→";
        else if (ctx.mode === "tag" && ctx.tags.length === 1) nextText = "再换一味「" + ctx.tags[0] + "」→";
        document.getElementById("nav-next").textContent = nextText;

        var hv = document.getElementById("home-view");
        var dv = document.getElementById("dose-view");
        hv.classList.remove("active");
        hv.classList.add("hidden");
        dv.classList.remove("hidden");
        void dv.offsetWidth;
        dv.classList.add("active");
        window.scrollTo({ top: 0, behavior: "instant" });
        updateScrollChrome();
        initQuoteObserver();
    }

    function renderHomeView() {
        state.view = "home";
        state.currentBook = null;
        closeMoreMenu();

        document.getElementById("brand-home-btn").classList.remove("hidden");
        document.getElementById("home-top-right").classList.remove("hidden");
        document.getElementById("dose-top-left").classList.add("hidden");
        document.getElementById("dose-top-right").classList.add("hidden");
        document.getElementById("reading-progress-track").classList.remove("active");
        document.getElementById("reading-progress-fill").style.width = "0%";

        var hv = document.getElementById("home-view");
        var dv = document.getElementById("dose-view");
        dv.classList.remove("active");
        dv.classList.add("hidden");
        hv.classList.remove("hidden");
        void hv.offsetWidth;
        hv.classList.add("active");

        renderHeroWord();
        updateCounters();
        scheduleCycle();
        window.scrollTo({ top: 0, behavior: "instant" });
        updateScrollChrome();
    }

    // ======== Router ========
    function updateUrl(paramsObj) {
        try {
            var url = new URL(window.location.href);
            ["tag", "tags", "book"].forEach(function (k) { url.searchParams.delete(k); });
            Object.keys(paramsObj || {}).forEach(function (k) {
                if (paramsObj[k]) url.searchParams.set(k, paramsObj[k]);
            });
            window.history.pushState({}, "", url.toString());
        } catch (e) {}
    }

    function openPrescriptionById(bookId, ctx, withInterlude) {
        var book = getBookById(bookId);
        if (!book) { goHome(); return; }
        var context = ctx || { mode: "book", tags: [book.tags.primary], degraded: false, reason: "" };
        var moodKey = (context.tags && context.tags.length && context.tags[0] !== "daily" && context.tags[0] !== "random")
            ? context.tags[0]
            : book.tags.primary;
        if (!context.poem) {
            context.poem = pickPoemForMood(moodKey, false);
        }
        var p = { book: book.id };
        if (context.mode === "daily") p.tag = "daily";
        else if (context.mode === "compound") p.tags = context.tags.join(",");
        else if (context.mode === "tag" && context.tags.length === 1) p.tag = context.tags[0];

        var enter = function () {
            updateUrl(p);
            renderDoseView(book, context);
        };

        if (withInterlude) {
            stopCycleTimer();
            var label = context.mode === "daily"
                ? "今日一味 · " + book.tags.primary
                : (context.mode === "compound" ? context.tags.join(" · ") : moodKey);
            playPoemInterlude(label, context.poem, enter);
        } else {
            enter();
        }
    }

    function openPrescriptionByTags(tagList, excludeId, withInterlude) {
        var clean = (tagList || []).filter(Boolean);
        var res = pickBestBook(clean, excludeId);
        if (!res || !res.book) { goHome(); return; }
        var mode = clean.length > 1 ? "compound" : (clean[0] === "random" ? "random" : "tag");
        var moodKey = (clean.length && clean[0] !== "random") ? clean[0] : res.book.tags.primary;
        var poem = (mode === "tag" && MOODS[state.moodIndex] && MOODS[state.moodIndex].word === moodKey)
            ? pickPoemForMood(moodKey, true)
            : pickPoemForMood(moodKey, false);
        openPrescriptionById(res.book.id, {
            mode: mode,
            tags: clean,
            degraded: res.degraded,
            reason: res.reason,
            poem: poem
        }, !!withInterlude);
    }

    function openDailyDose(withInterlude) {
        var today = getTodayIso();
        var savedId = getDailyDoseId(today);
        var book = savedId ? getBookById(savedId) : null;
        if (!book) {
            var res = pickBestBook(["random"], null);
            book = res.book;
            if (book) setDailyDoseId(today, book.id);
        }
        if (book) {
            openPrescriptionById(book.id, {
                mode: "daily",
                tags: ["daily"],
                degraded: false,
                reason: "",
                poem: pickPoemForMood(book.tags.primary, false)
            }, !!withInterlude);
        }
    }

    function goHome() {
        updateUrl({});
        renderHomeView();
    }

    function handleUrl() {
        var params = new URLSearchParams(window.location.search);
        var bookId = params.get("book");
        var tag = params.get("tag");
        var tagsParam = params.get("tags");

        if (bookId && getBookById(bookId)) {
            var b = getBookById(bookId);
            var ctx = { mode: "book", tags: [b.tags.primary], degraded: false, reason: "" };
            if (tag === "daily") ctx = { mode: "daily", tags: ["daily"], degraded: false, reason: "" };
            else if (tagsParam) ctx = { mode: "compound", tags: tagsParam.split(","), degraded: false, reason: "" };
            else if (tag) ctx = { mode: "tag", tags: [tag], degraded: false, reason: "" };
            renderDoseView(b, ctx);
            return;
        }
        if (tag === "daily") { openDailyDose(); return; }
        if (tagsParam) { openPrescriptionByTags(tagsParam.split(",")); return; }
        if (tag) { openPrescriptionByTags([tag]); return; }
        renderHomeView();
    }

    // ======== Popover More Menu ========
    function closeMoreMenu() {
        var menu = document.getElementById("more-menu");
        var btn = document.getElementById("btn-more-menu");
        if (menu) menu.classList.add("hidden");
        if (btn) btn.setAttribute("aria-expanded", "false");
    }

    function toggleMoreMenu() {
        var menu = document.getElementById("more-menu");
        var btn = document.getElementById("btn-more-menu");
        var open = menu.classList.contains("hidden");
        menu.classList.toggle("hidden", !open);
        btn.setAttribute("aria-expanded", String(open));
    }

    // ======== Drawer (药匣) ========
    function openDrawer(tab) {
        closeMoreMenu();
        if (tab) state.drawerTab = tab;
        document.getElementById("drawer-backdrop").classList.add("open");
        var sheet = document.getElementById("drawer-sheet");
        sheet.classList.add("open");
        sheet.setAttribute("aria-hidden", "false");
        syncDrawerTabs();
        renderDrawerBody();
    }

    function closeDrawer() {
        document.getElementById("drawer-backdrop").classList.remove("open");
        var sheet = document.getElementById("drawer-sheet");
        sheet.classList.remove("open");
        sheet.setAttribute("aria-hidden", "true");
    }

    function syncDrawerTabs() {
        document.querySelectorAll(".drawer-tab").forEach(function (t) {
            t.classList.toggle("active", t.dataset.tab === state.drawerTab);
        });
        document.getElementById("drawer-search-bar").classList.toggle("hidden", state.drawerTab !== "catalog");
    }

    function renderDrawerBody() {
        var body = document.getElementById("drawer-body");
        var seen = getSeenIds();
        var saved = getSavedIds();
        var items = [];

        if (state.drawerTab === "catalog") {
            var q = state.drawerQuery.trim().toLowerCase();
            items = BOOKS.filter(function (b) {
                if (!q) return true;
                return (b.title + " " + b.author + " " + b.summary + " " + b.tags.primary + " " + (b.tags.secondary || []).join(" ")).toLowerCase().indexOf(q) !== -1;
            });
        } else if (state.drawerTab === "saved") {
            items = saved.map(getBookById).filter(Boolean);
        } else {
            items = readJson(KEYS.HISTORY, []).map(function (h) { return getBookById(h.id); }).filter(Boolean);
        }

        if (!items.length) {
            body.innerHTML = '<div class="drawer-empty">' +
                (state.drawerTab === "saved" ? "药匣尚空，读到合心之方点右上角书签即可收入。"
                    : state.drawerTab === "history" ? "尚无服方足迹。"
                    : "未找到符合条件的书方。") +
                "</div>";
            return;
        }

        body.innerHTML = "";
        items.forEach(function (b) {
            var btn = document.createElement("button");
            btn.className = "book-row";
            var marks = [];
            if (seen.indexOf(b.id) !== -1) marks.push("已服");
            if (saved.indexOf(b.id) !== -1) marks.push("已藏");
            btn.innerHTML =
                '<div class="book-row-top">' +
                    '<span class="book-row-title">' + escapeHtml(b.id) + " · 《" + escapeHtml(b.title) + "》</span>" +
                    '<span class="book-row-tag">' + escapeHtml(b.tags.primary) + "</span>" +
                "</div>" +
                '<div class="book-row-meta">' + escapeHtml(b.author.split("（")[0]) + (marks.length ? " · " + marks.join(" / ") : "") + "</div>" +
                '<div class="book-row-summary">' + escapeHtml(b.summary) + "</div>";
            btn.addEventListener("click", function () {
                closeDrawer();
                openPrescriptionById(b.id, { mode: "book", tags: [b.tags.primary], degraded: false, reason: "" });
            });
            body.appendChild(btn);
        });
    }

    // ======== Share Card Modal ========
    function openCardModal(qIdx) {
        if (!state.currentBook) return;
        closeMoreMenu();
        state.cardQuoteIdx = typeof qIdx === "number" ? qIdx : 0;
        var bd = document.getElementById("card-modal-backdrop");
        bd.classList.add("open");
        bd.setAttribute("aria-hidden", "false");
        drawShareCard();
    }

    function closeCardModal() {
        var bd = document.getElementById("card-modal-backdrop");
        bd.classList.remove("open");
        bd.setAttribute("aria-hidden", "true");
    }

    function wrapLines(ctx, text, maxW) {
        var lines = [];
        text.split("\n").forEach(function (para, idx, arr) {
            var cur = "";
            for (var i = 0; i < para.length; i++) {
                var test = cur + para[i];
                if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = para[i]; }
                else cur = test;
            }
            if (cur) lines.push(cur);
            if (idx < arr.length - 1) lines.push("");
        });
        return lines;
    }

    function drawShareCard() {
        var book = state.currentBook;
        if (!book) return;
        var canvas = document.getElementById("share-card-canvas");
        var ctx = canvas.getContext("2d");
        var W = canvas.width, H = canvas.height;
        var palettes = {
            paper: { bg: "#FAFAF9", card: "#FFFFFF", text: "#1A1A1A", muted: "#8A8A86", border: "#E8E6E3" },
            warm:  { bg: "#F4EFE6", card: "#FBF8F1", text: "#221F1A", muted: "#847B6F", border: "#E5DDD0" },
            ink:   { bg: "#141413", card: "#1B1B1A", text: "#EAE8E3", muted: "#8E8C86", border: "#2E2E2B" }
        };
        var t = palettes[state.cardPaper] || palettes.paper;

        ctx.fillStyle = t.bg;
        ctx.fillRect(0, 0, W, H);

        var pad = 56;
        ctx.fillStyle = t.card;
        ctx.strokeStyle = t.border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pad + 20, pad);
        ctx.arcTo(W - pad, pad, W - pad, H - pad, 20);
        ctx.arcTo(W - pad, H - pad, pad, H - pad, 20);
        ctx.arcTo(pad, H - pad, pad, pad, 20);
        ctx.arcTo(pad, pad, W - pad, pad, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.font = '400 22px "PingFang SC", "Noto Sans SC", sans-serif';
        ctx.fillStyle = t.muted;
        ctx.fillText("书 方  ·  " + book.id, pad + 64, pad + 104);

        var tagW = ctx.measureText(book.tags.primary).width;
        ctx.fillText(book.tags.primary, W - pad - 64 - tagW, pad + 104);

        var quoteText = book.quotes[state.cardQuoteIdx % book.quotes.length] || book.summary;
        var fs = quoteText.length > 150 ? 28 : (quoteText.length > 90 ? 32 : 36);
        var lh = Math.round(fs * 1.9);
        ctx.font = '400 ' + fs + 'px "Noto Serif SC", "Songti SC", serif';
        ctx.fillStyle = t.text;
        var lines = wrapLines(ctx, quoteText, W - pad * 2 - 128);
        if (lines.length > 11) {
            lines = lines.slice(0, 11);
            lines[10] = lines[10].slice(0, -1) + "…";
        }
        lines.forEach(function (line, i) { ctx.fillText(line, pad + 64, pad + 240 + i * lh); });

        var fy = H - pad - 196;
        ctx.strokeStyle = t.border;
        ctx.beginPath();
        ctx.moveTo(pad + 64, fy);
        ctx.lineTo(W - pad - 64, fy);
        ctx.stroke();

        ctx.font = '500 30px "Noto Serif SC", "Songti SC", serif';
        ctx.fillStyle = t.text;
        ctx.fillText("《" + book.title + "》", pad + 64, fy + 64);

        ctx.font = '400 22px "Noto Serif SC", "Songti SC", serif';
        ctx.fillStyle = t.muted;
        ctx.fillText(book.author, pad + 64, fy + 108);

        ctx.font = '400 18px "PingFang SC", "Noto Sans SC", sans-serif';
        ctx.fillText(getTodayIso(), pad + 64, fy + 154);
    }

    // ======== Scroll & Gestures ========
    function updateScrollChrome() {
        var y = window.scrollY || window.pageYOffset || 0;
        document.getElementById("top-bar").classList.toggle("scrolled", y > 14);
        if (state.view === "dose") {
            var docH = document.documentElement.scrollHeight - window.innerHeight;
            var pct = docH > 0 ? Math.min(100, Math.max(0, (y / docH) * 100)) : 0;
            document.getElementById("reading-progress-fill").style.width = pct + "%";
            document.getElementById("dose-scroll-title").classList.toggle("visible", y > 130);
        }
    }

    function initHomeGestures() {
        var hv = document.getElementById("home-view");
        var sx = 0, sy = 0;

        hv.addEventListener("touchstart", function (e) {
            if (!e.touches.length) return;
            sx = e.touches[0].clientX;
            sy = e.touches[0].clientY;
        }, { passive: true });

        hv.addEventListener("touchend", function (e) {
            if (!e.changedTouches.length) return;
            var dx = e.changedTouches[0].clientX - sx;
            var dy = e.changedTouches[0].clientY - sy;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
                selectHeroMood(state.moodIndex + (dx < 0 ? 1 : -1), true);
            }
        }, { passive: true });

        // Gentle mouse-wheel mood stepping on home canvas (ignore when scrolling dropdown)
        hv.addEventListener("wheel", function (e) {
            if (e.target.closest(".search-dropdown")) return;
            var now = Date.now();
            if (now - state.wheelLock < 360) return;
            if (Math.abs(e.deltaY) > 18 || Math.abs(e.deltaX) > 18) {
                state.wheelLock = now;
                var dir = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) > 0 ? 1 : -1;
                selectHeroMood(state.moodIndex + dir, true);
            }
        }, { passive: true });
    }

    // ======== Wire Events ========
    function bindEvents() {
        document.getElementById("brand-home-btn").addEventListener("click", goHome);
        document.getElementById("nav-back").addEventListener("click", goHome);
        document.getElementById("nav-home").addEventListener("click", goHome);

        document.getElementById("btn-open-stars").addEventListener("click", openStarOverlay);
        document.getElementById("btn-close-stars").addEventListener("click", closeStarOverlay);
        document.getElementById("btn-open-drawer").addEventListener("click", function () { openDrawer("catalog"); });

        document.getElementById("zone-prev").addEventListener("click", function () { selectHeroMood(state.moodIndex - 1, true); });
        document.getElementById("zone-next").addEventListener("click", function () { selectHeroMood(state.moodIndex + 1, true); });
        document.getElementById("zone-enter").addEventListener("click", function () {
            openPrescriptionByTags([MOODS[state.moodIndex].word], null, true);
        });
        document.getElementById("zone-enter").addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openPrescriptionByTags([MOODS[state.moodIndex].word], null, true);
            }
        });
        document.getElementById("btn-daily-dose").addEventListener("click", function () { openDailyDose(true); });
        document.getElementById("poem-interlude").addEventListener("click", dismissPoemInterlude);

        // Dose top bar & popover menu
        document.getElementById("btn-bookmark").addEventListener("click", function () {
            if (!state.currentBook) return;
            var added = toggleSaved(state.currentBook.id);
            updateBookmarkIcon();
            showSnackbar(added ? "已收入药匣" : "已从药匣移出");
        });
        document.getElementById("btn-more-menu").addEventListener("click", function (e) {
            e.stopPropagation();
            toggleMoreMenu();
        });
        document.getElementById("menu-card").addEventListener("click", function () { openCardModal(0); });
        document.getElementById("menu-copy-link").addEventListener("click", function () {
            closeMoreMenu();
            copyText(window.location.href, "已复制书方链接");
        });
        document.getElementById("menu-open-drawer").addEventListener("click", function () { openDrawer("catalog"); });

        document.querySelectorAll(".font-size-btn").forEach(function (b) {
            b.addEventListener("click", function () { applyFontScale(parseFloat(b.dataset.scale)); });
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest("#dose-top-right")) closeMoreMenu();
        });

        document.getElementById("btn-reset-seen-inline").addEventListener("click", function () {
            clearSeenPool();
            document.getElementById("degraded-hint").classList.add("hidden");
        });

        document.getElementById("nav-next").addEventListener("click", function () {
            var curId = state.currentBook ? state.currentBook.id : null;
            var ctx = state.currentContext;
            if (ctx.mode === "compound" && ctx.tags.length > 1) openPrescriptionByTags(ctx.tags, curId);
            else if (ctx.mode === "tag" && ctx.tags.length === 1) openPrescriptionByTags(ctx.tags, curId);
            else openPrescriptionByTags(["random"], curId);
        });

        // Drawer
        document.getElementById("btn-close-drawer").addEventListener("click", closeDrawer);
        document.getElementById("drawer-backdrop").addEventListener("click", closeDrawer);
        document.querySelectorAll(".drawer-tab").forEach(function (tab) {
            tab.addEventListener("click", function () {
                state.drawerTab = tab.dataset.tab;
                syncDrawerTabs();
                renderDrawerBody();
            });
        });
        document.getElementById("drawer-search").addEventListener("input", function (e) {
            state.drawerQuery = e.target.value;
            renderDrawerBody();
        });
        document.getElementById("btn-clear-seen").addEventListener("click", function () {
            clearSeenPool();
            renderDrawerBody();
        });

        // Card modal
        document.getElementById("btn-close-card-modal").addEventListener("click", closeCardModal);
        document.getElementById("btn-cancel-card").addEventListener("click", closeCardModal);
        document.getElementById("card-modal-backdrop").addEventListener("click", function (e) {
            if (e.target.id === "card-modal-backdrop") closeCardModal();
        });
        document.querySelectorAll("#card-theme-pills button").forEach(function (b) {
            b.addEventListener("click", function () {
                state.cardPaper = b.dataset.paper;
                document.querySelectorAll("#card-theme-pills button").forEach(function (x) { x.classList.toggle("active", x === b); });
                drawShareCard();
            });
        });
        document.getElementById("btn-switch-card-quote").addEventListener("click", function () {
            if (!state.currentBook) return;
            state.cardQuoteIdx = (state.cardQuoteIdx + 1) % state.currentBook.quotes.length;
            drawShareCard();
        });
        document.getElementById("btn-download-card").addEventListener("click", function () {
            if (!state.currentBook) return;
            var link = document.createElement("a");
            link.download = "书方笺-" + state.currentBook.title + ".png";
            link.href = document.getElementById("share-card-canvas").toDataURL("image/png");
            link.click();
            showSnackbar("书方笺已保存");
        });

        window.addEventListener("scroll", updateScrollChrome, { passive: true });
        window.addEventListener("popstate", handleUrl);

        document.addEventListener("keydown", function (e) {
            var tag = document.activeElement ? document.activeElement.tagName : "";
            var typing = tag === "INPUT" || tag === "TEXTAREA";

            if (document.getElementById("poem-interlude").classList.contains("visible")) {
                if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    dismissPoemInterlude();
                }
                return;
            }
            if (e.key === "Escape") {
                if (document.getElementById("card-modal-backdrop").classList.contains("open")) { closeCardModal(); return; }
                if (document.getElementById("drawer-sheet").classList.contains("open")) { closeDrawer(); return; }
                if (document.getElementById("star-overlay").classList.contains("visible")) { closeStarOverlay(); return; }
                if (!document.getElementById("more-menu").classList.contains("hidden")) { closeMoreMenu(); return; }
                if (state.view === "dose" && !typing) { goHome(); return; }
            }
            if (typing) return;

            if (e.key === "/" && state.view === "home") {
                e.preventDefault();
                document.getElementById("symptom-search").focus();
                return;
            }
            if (state.view === "home") {
                if (e.key === "ArrowLeft") selectHeroMood(state.moodIndex - 1, true);
                else if (e.key === "ArrowRight") selectHeroMood(state.moodIndex + 1, true);
                else if (e.key === "Enter") openPrescriptionByTags([MOODS[state.moodIndex].word]);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        if (!BOOKS.length) {
            document.body.innerHTML = '<div style="text-align:center;margin-top:80px;">书目数据加载失败</div>';
            return;
        }
        var savedScale = storageOk() ? parseFloat(localStorage.getItem(KEYS.SCALE)) : 1;
        applyFontScale(savedScale && !isNaN(savedScale) ? savedScale : 1);

        renderMoodStrip();
        initSearch();
        initStarSpace();
        initHomeGestures();
        bindEvents();
        updateCounters();
        handleUrl();
    });
})();
