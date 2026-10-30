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
