// 메인 화면 효과: 배치도가 화면에 35% 보이면 드로잉 시퀀스를 한 번 재생합니다.
// 시작 전 숨김 상태는 html.anim 이 붙었을 때만 적용되므로(css/main.css),
// 스크립트가 없거나 '동작 줄이기'가 켜져 있으면 완성된 지도가 그대로 보입니다.
(function () {
    const map = document.querySelector(".campus-map");
    if (!map || !("IntersectionObserver" in window))
        return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
    document.documentElement.classList.add("anim");
    const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
            map.classList.add("is-drawn");
            io.disconnect();
        }
    }, { threshold: 0.35 });
    io.observe(map);
})();

// 전시 사이트 제작 중 팝업: 호버가 없는 터치 기기에서는 입장 링크를 탭하면 잠시 보여 줍니다.
// (PC의 호버 표시는 css/main.css가 맡습니다.) 하단 고정 바는 썸네일로 이동한 뒤 띄웁니다.
(function () {
    const preview = document.querySelector(".site-preview");
    if (!preview)
        return;
    let timer;
    document.querySelectorAll(".site-preview, .enter-small, .enter-bar a").forEach((link) => {
        link.addEventListener("click", () => {
            if (!window.matchMedia("(hover: none)").matches)
                return;
            if (link.closest(".enter-bar")) {
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                preview.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
            }
            preview.classList.add("is-open");
            clearTimeout(timer);
            timer = setTimeout(() => preview.classList.remove("is-open"), 2500);
        });
    });
})();
