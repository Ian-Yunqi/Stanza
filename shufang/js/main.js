import { initRouter, navigateToTag, goHome } from "./router.js";
import { initMirror } from "./mirror.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("data/books.json");
        const books = await response.json();

        // 启动呼吸镜面（传入回调打破循环引用）
        initMirror(navigateToTag);

        // 处方页按钮
        document.getElementById("nav-back").addEventListener("click", goHome);
        document.getElementById("nav-home").addEventListener("click", goHome);

        document.getElementById("nav-next").addEventListener("click", () => {
            const currentTag = new URLSearchParams(window.location.search).get("tag");
            navigateToTag(currentTag || "daily");
        });

        // 滚动隐藏箭头
        window.addEventListener("scroll", () => {
            const arrow = document.getElementById("scroll-arrow");
            if (window.scrollY > 150) {
                arrow.style.opacity = "0";
                arrow.style.transition = "opacity 0.3s";
            } else {
                arrow.style.opacity = "";
                arrow.style.transition = "";
            }
        });

        // 启动路由
        initRouter(books);
    } catch (error) {
        console.error("书籍数据加载失败", error);
        document.body.innerHTML =
            '<div style="text-align:center;margin-top:50px;">系统初始化失败，请稍后再试。</div>';
    }
});