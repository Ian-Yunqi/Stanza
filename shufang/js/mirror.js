const tags = ["无聊", "迷茫", "厌倦", "浮躁", "疲惫", "空游无所依", "烦闷", "平淡"];
let currentIndex = 0;
let playCount = 0;
let cycleTimer = null;

export function initMirror(navigateFn) {
    const scalerEl = document.getElementById('zone-enter');
    const containerEl = document.getElementById('home-view');
    const dailyBtn = document.getElementById('daily-btn');

    dailyBtn.classList.add('idle-breathe');

    function playWord(index) {
        scalerEl.innerHTML = '';
        const newEl = document.createElement('div');
        newEl.className = 'emotion-word breathing';
        newEl.textContent = tags[index];
        newEl.classList.add(tags[index].length > 2 ? 'word-long' : 'word-short');
        scalerEl.appendChild(newEl);

        if (playCount % tags.length === 2) {
            dailyBtn.classList.remove('idle-breathe');
            dailyBtn.classList.add('flash-highlight');
            setTimeout(() => {
                dailyBtn.classList.remove('flash-highlight');
                dailyBtn.classList.add('idle-breathe');
            }, 2000);
        }

        playCount++;
        clearTimeout(cycleTimer);
        cycleTimer = setTimeout(() => {
            if (playCount <= tags.length) {
                currentIndex = (currentIndex + 1) % tags.length;
            } else {
                const randomStep = Math.floor(Math.random() * 3) + 1;
                currentIndex = (currentIndex + randomStep) % tags.length;
            }
            playWord(currentIndex);
        }, 5500);
    }

    playWord(currentIndex);

    // ==================================
    // 提示语逻辑 (Delayed Whisper)
    // ==================================
    const HINT_KEY = 'shufang-hint-seen';
    const whisperEl = document.getElementById('delayed-whisper');
    let whisperTimer = null;
    let hideTimer = null;

    let hasSeenHint = false;
    try { hasSeenHint = localStorage.getItem(HINT_KEY) === '1'; } catch(e) {}

    if (!hasSeenHint && whisperEl) {
        whisperTimer = setTimeout(() => {
            whisperEl.classList.add('show');
            hideTimer = setTimeout(() => {
                whisperEl.classList.remove('show');
                markHintAsSeen();
            }, 4000);
        }, 11000);
    }

    function markHintAsSeen() {
        if (whisperTimer) clearTimeout(whisperTimer);
        if (hideTimer) clearTimeout(hideTimer);
        if (whisperEl) whisperEl.classList.remove('show');
        try { localStorage.setItem(HINT_KEY, '1'); } catch(e) {}
    }

    // ==================================
    // 页面交互：左右空白翻页 + 中间文字进入
    // ==================================
    document.getElementById('zone-prev').addEventListener('click', () => {
        markHintAsSeen();
        currentIndex = (currentIndex - 1 + tags.length) % tags.length;
        playWord(currentIndex);
    });

    document.getElementById('zone-next').addEventListener('click', () => {
        markHintAsSeen();
        currentIndex = (currentIndex + 1) % tags.length;
        playWord(currentIndex);
    });

    scalerEl.addEventListener('click', () => {
        markHintAsSeen();
        clearTimeout(cycleTimer);
        scalerEl.classList.add('clicked');
        containerEl.style.backgroundColor = 'hsl(40, 20%, 95%)';
        setTimeout(() => {
            scalerEl.classList.remove('clicked');
            containerEl.style.backgroundColor = '';
            navigateFn(tags[currentIndex]);
        }, 300);
    });

    // ==================================
    // 诗集目录弹出逻辑
    // ==================================
    const listOverlay = document.getElementById('list-overlay');
    const closeList = () => listOverlay.classList.remove('visible');

    document.getElementById('btn-show-all').addEventListener('click', () => {
        markHintAsSeen();
        listOverlay.classList.remove('hidden');
        listOverlay.classList.add('visible');
    });

    document.getElementById('btn-close-all').addEventListener('click', closeList);
    document.getElementById('list-backdrop').addEventListener('click', closeList);

    document.querySelectorAll('.poetry-list .poetry-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeList();
            navigateFn(e.target.dataset.tag);
        });
    });

    dailyBtn.addEventListener('click', () => {
        markHintAsSeen();
        navigateFn('daily');
    });
}

export function resetMirror() {
    currentIndex = 0;
    playCount = 0;
    if (cycleTimer) clearTimeout(cycleTimer);
    const scalerEl = document.getElementById('zone-enter');
    if (scalerEl) scalerEl.innerHTML = '';
    const dailyBtn = document.getElementById('daily-btn');
    if (dailyBtn) {
        dailyBtn.classList.remove('flash-highlight');
        dailyBtn.classList.add('idle-breathe');
    }
    const play = (idx) => {
        const sEl = document.getElementById('zone-enter');
        if (!sEl) return;
        sEl.innerHTML = '';
        const newEl = document.createElement('div');
        newEl.className = 'emotion-word breathing';
        newEl.textContent = tags[idx];
        newEl.classList.add(tags[idx].length > 2 ? 'word-long' : 'word-short');
        sEl.appendChild(newEl);
        playCount++;
        clearTimeout(cycleTimer);
        cycleTimer = setTimeout(() => {
            currentIndex = (currentIndex + 1) % tags.length;
            play(currentIndex);
        }, 5500);
    };
    play(0);
}