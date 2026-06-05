export function initQuoteObserver() {
    if (window.quoteObserver) {
        window.quoteObserver.disconnect();
    }

    window.quoteObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transition = "opacity 0.6s ease";
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll(".quote-item").forEach(el => {
        window.quoteObserver.observe(el);
    });
}
