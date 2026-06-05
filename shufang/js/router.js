import { renderHome, renderDose } from "./render.js";
import { matchBook } from "./matcher.js";
import { getSeenBooks, pushSeenBook, getDailyDose, setDailyDose } from "./storage.js";

let appBooks = [];

export async function initRouter(books) {
    appBooks = books;
    handleUrlChange();
    window.addEventListener("popstate", handleUrlChange);
}

export function navigateToTag(tag) {
    const url = new URL(window.location);
    url.searchParams.set("tag", tag);
    window.history.pushState({}, "", url);
    handleUrlChange();
}

export function goHome() {
    const url = new URL(window.location);
    url.searchParams.delete("tag");
    window.history.pushState({}, "", url);
    handleUrlChange();
}

function handleUrlChange() {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get("tag");

    if (!tag) {
        renderHome();
        return;
    }

    let matchResult;

    if (tag === "daily") {
        const today = new Date().toLocaleDateString("zh-CN");
        const savedDailyId = getDailyDose(today);

        if (savedDailyId) {
            const book = appBooks.find(b => b.id === savedDailyId);
            matchResult = book ? { book, degraded: false } : null;
        }

        if (!matchResult) {
            matchResult = matchBook("daily", appBooks, getSeenBooks());
            if (matchResult.book) {
                setDailyDose(today, matchResult.book.id);
            }
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
