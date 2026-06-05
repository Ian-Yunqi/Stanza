const SEEN_KEY = "shufang-seen";
const DOSE_PREFIX = "shufang-dose-";

function isStorageAvailable() {
    try {
        const test = "__test__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

export function getSeenBooks() {
    if (!isStorageAvailable()) return [];
    try {
        const data = localStorage.getItem(SEEN_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

export function pushSeenBook(id) {
    if (!isStorageAvailable()) return;
    try {
        let seen = getSeenBooks();
        if (!seen.includes(id)) {
            seen.push(id);
            if (seen.length > 5) seen.shift();
            localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
        }
    } catch (e) {}
}

export function getDailyDose(dateStr) {
    if (!isStorageAvailable()) return null;
    return localStorage.getItem(DOSE_PREFIX + dateStr);
}

export function setDailyDose(dateStr, id) {
    if (!isStorageAvailable()) return;
    try {
        localStorage.setItem(DOSE_PREFIX + dateStr, id);
        cleanOldDoses(dateStr);
    } catch (e) {}
}

function cleanOldDoses(currentDateStr) {
    const today = new Date(currentDateStr).getTime();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DOSE_PREFIX)) {
            const keyDateStr = key.replace(DOSE_PREFIX, "");
            const keyTime = new Date(keyDateStr).getTime();
            if (today - keyTime > 7 * 24 * 60 * 60 * 1000) {
                localStorage.removeItem(key);
            }
        }
    }
}
