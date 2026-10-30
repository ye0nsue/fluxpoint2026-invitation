(function () {
  const root = document.getElementById("fpsplash");
  const PAGE_IMAGES_MAX_WAIT_MS = 6000;
  let hasEntered = false;
  // 뒤로/앞으로 가기로 돌아왔을 때 브라우저가 기억해 둔 예전 화면(bfcache)을
  // 보여주지 않고, 새로 불러와 최신 내용과 스플래시부터 다시 시작합니다.
  window.addEventListener("pageshow", (e) => {
      if (e.persisted)
          location.reload();
  });
  // 새로고침·뒤로 가기 때 이전 스크롤 위치를 되살리지 않습니다.
  if ("scrollRestoration" in history)
      history.scrollRestoration = "manual";
const $ = (s) => root.querySelector(s);
const NS = "http://www.w3.org/2000/svg";
const stage = $("#stage");
const cv = $("#dots");
const ctx = cv.getContext("2d");
const photo = $("#photo");
const art = $("#art");
const gridSvg = $("#gridSvg");
const gridG = $("#gridG");
const bldG = $("#bldG");
const title = $("#title");
const maskCv = document.createElement("canvas");
const mctx = maskCv.getContext("2d");
const PH = {
    w: 1500,
    h: 2544,
    coast: [
        179.0, 176.0, 171.0, 170.0, 164.0, 161.0, 158.0, 154.0, 151.0, 147.0, 143.0, 139.0, 138.0,
        137.0, 134.0, 129.0, 126.0, 126.0, 121.0, 115.0, 111.0, 102.0, 97.0, 88.0, 74.0, 71.0,
        73.0, 70.0, 66.0, 64.0, 66.0, 63.0, 60.0, 58.0, 58.0, 62.0, 64.0, 70.0, 70.0, 72.0,
        85.0, 87.0, 59.0, 51.0, 43.0, 40.0, 49.0, 41.0, 34.0, 27.0, 20.0, 16.0, 10.0, 10.0,
        10.0, 10.0, 5.0, 0.0, 19.0, 284.0, 958.0, 897.0, 913.0, 938.0,
    ],
};
// 사진 실루엣·띠·전환 점 색: 컬러는 레드, 모노는 블랙(#1b191a)
const tint = () => (root.classList.contains("mono") ? "#1b191a" : "#e52525");
let gridStart = 4.6;
const WAVE_START = 5500;
const WAVE_DUR = 1900;
// 시안(2000x1250) 좌표계
const D = { photoX: 1051.5, photoScale: 0.6323, photoY: 0, gx: 94.7, gy: 92.2, gy0: 71.5, titleX: 71.5, titleTop: 54.2, titleW: 780.6 };
const B = [
    { d: [[830.9, 303.0], [881.3, 424.0], [853.7, 418.7], [844.8, 453.4], [825.9, 449.2], [822.1, 479.8], [848.3, 490.6], [862.9, 472.8], [868.2, 473.2], [889.3, 484.5], [884.2, 500.0], [919.0, 505.2], [923.6, 496.9], [1004.5, 525.3], [1015.7, 529.1], [1017.9, 528.1], [1028.3, 487.0], [937.7, 455.8], [940.8, 446.7], [920.5, 434.7], [863.6, 293.9], [860.6, 292.8]], m: "tri", x: 910.9, y: 466.6, t: 1.6 },
    { d: [[796.0, 596.2], [750.7, 588.1], [725.8, 673.7], [719.1, 667.2], [720.5, 614.8], [695.3, 612.7], [688.0, 614.4], [683.4, 731.1], [710.1, 729.3], [713.2, 726.0], [719.0, 704.4], [725.6, 706.3], [726.1, 807.2], [759.0, 808.1], [771.2, 686.2], [795.9, 603.4]], m: "sq", x: 749.0, y: 693.8, t: 1.85 },
    { d: [[764.1, 812.1], [746.5, 816.2], [744.1, 811.1], [732.8, 811.1], [726.2, 813.5], [745.9, 909.1], [744.4, 911.2], [715.9, 917.2], [721.2, 928.9], [708.6, 934.3], [713.6, 961.7], [715.6, 962.5], [795.3, 948.7], [790.6, 913.9], [777.2, 917.5], [775.4, 915.2], [774.0, 918.9], [768.4, 920.5]], m: null, t: 1.85 },
    { d: [[1351.9, 665.5], [1345.1, 683.6], [1322.8, 677.6], [1235.3, 928.1], [1264.6, 937.0], [1262.3, 946.6], [1354.0, 979.0], [1363.7, 955.0], [1380.6, 956.5], [1385.0, 935.1], [1417.7, 944.7], [1436.3, 866.5], [1446.3, 865.0], [1453.4, 847.2], [1443.2, 842.4], [1448.1, 826.6], [1429.6, 821.0], [1433.6, 809.6], [1446.0, 773.3], [1435.8, 766.3], [1445.6, 744.1], [1428.8, 729.1], [1438.9, 698.3]], m: "dot", x: 1348.3, y: 820.1, t: 2.1 },
];
function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs)
        n.setAttribute(k, String(attrs[k]));
    if (parent)
        parent.appendChild(n);
    return n;
}
function pathD(a) {
    return "M" + a.map((p) => p.join(" ")).join("L") + "Z";
}
function marker(b, parent, cls) {
    const x = b.x, y = b.y;
    let n;
    if (b.m === "tri")
        n = el("polygon", { points: x + "," + (y - 11.6) + " " + (x + 9) + "," + (y + 5.8) + " " + (x - 9) + "," + (y + 5.8) }, parent);
    else if (b.m === "sq")
        n = el("rect", { x: x - 7, y: y - 7.3, width: 14, height: 14.6 }, parent);
    else if (b.m === "dot")
        n = el("circle", { cx: x, cy: y, r: 8.5 }, parent);
    if (n)
        n.setAttribute("class", cls);
    return n;
}
function buildBuildings() {
    bldG.innerHTML = "";
    const groups = B.map(() => el("g", {}, bldG));
    const per = B.map((b) => {
        const d2 = b.d;
        let t = 0;
        for (let k = 0; k < d2.length; k++) {
            const a = d2[k], c = d2[(k + 1) % d2.length];
            t += Math.hypot(a[0] - c[0], a[1] - c[1]);
        }
        return t;
    });
    const avg = per.reduce((x, y) => x + y, 0) / per.length;
    const dur = per.map((t) => 1.1 * Math.sqrt(t / avg));
    const st = [2.6, 2.93, 0, 3.26];
    st[2] = st[1] + 0.6 * dur[1];
    const end = st.map((t, k) => t + dur[k]);
    gridStart = Math.max.apply(null, end) + 0.15;
    const lg = root.querySelectorAll("#legend p");
    lg.forEach((pp) => {
        if (pp.dataset.d0 === undefined)
            pp.dataset.d0 = String(parseFloat(pp.style.getPropertyValue("--d")) - 3.6);
        pp.style.setProperty("--d", (gridStart + 2.3 + parseFloat(pp.dataset.d0) * 0.55).toFixed(2) + "s");
    });
    B.forEach((b, i) => {
        const f = el("path", { d: pathD(b.d), class: "bf" }, groups[i]);
        f.style.setProperty("--d", (end[i] - 0.1).toFixed(2) + "s");
        const o = el("path", { d: pathD(b.d), pathLength: 1, class: "ol" }, groups[i]);
        o.style.setProperty("--d", st[i].toFixed(2) + "s");
        o.style.setProperty("--dur", dur[i].toFixed(2) + "s");
    });
    let seq = 0;
    B.forEach((b, i) => {
        if (!b.m)
            return;
        const h = marker(b, groups[i], "hol");
        h.style.setProperty("--d", 0.6 + seq * 0.6 + "s");
        const m = marker(b, groups[i], "mk");
        m.style.setProperty("--d", (end[i] - 0.05).toFixed(2) + "s");
        if (b.m === "tri")
            m.id = "triMark";
        const r = marker(b, groups[i], "ring");
        r.style.setProperty("--d", "5.5s");
        seq++;
    });
}
let startAt = 0, W = 0, H = 0, dpr = 1, S = 10, ox = 0, oy = 0, maxD = 0, band = 0, bandX = 0, raf = 0, done = false, run = 0;
let box = { x: 0, y: 0, w: 1, h: 1 };
function buildGrid() {
    gridG.innerHTML = "";
    const compact = stage.classList.contains("compact"), mob = stage.classList.contains("mobile");
    const k = W / 2000, km = W / 780;
    const gx = mob ? 136.4 * km : compact ? W / 8 : D.gx * k;
    const gy = mob ? 132.7 * km : compact ? W / 8 : D.gy * k;
    const y0 = mob ? 103.3 * km : compact ? gy : D.gy0 * k;
    let n = 0;
    function line(x1, y1, x2, y2) {
        const l = el("line", { x1, y1, x2, y2, pathLength: 1, class: "gl" }, gridG);
        l.style.setProperty("--d", gridStart + ((n++ % 14) * 0.02 - (performance.now() - startAt) / 1000) + "s");
    }
    for (let x = gx; x <= bandX + 0.5; x += gx)
        line(x, 0, x, H);
    for (let y = y0; y < H; y += gy)
        line(0, y, bandX, y);
}
function coastAvg() {
    const c = PH.coast;
    let s = 0;
    for (let i = 0; i < c.length; i++)
        s += c[i];
    return s / c.length;
}
function layout() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    [cv, maskCv].forEach((c) => {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S = Math.max(5, Math.round(Math.min(W, H) / 110));
    const mob = W / H < 0.62, compact = !mob && W / H < 1.35;
    let k = W / 2000;
    const km = W / 780;
    stage.classList.toggle("compact", compact);
    stage.classList.toggle("mobile", mob);
    if (mob)
        k = km;
    stage.style.setProperty("--k", k.toFixed(4));
    art.setAttribute("viewBox", "0 0 " + W + " " + H);
    gridSvg.setAttribute("viewBox", "0 0 " + W + " " + H);
    let sc = 0, px = 0, py = 0;
    if (mob) {
        px = 205.2 * km;
        py = 0;
        box = { x: px, y: py, w: 843.6 * km, h: 1430.7 * km };
    }
    else if (!compact) {
        sc = D.photoScale * k;
        px = D.photoX * k;
        py = D.photoY * k;
    }
    else {
        sc = Math.max(H / PH.h, (0.6 * W) / (PH.w - coastAvg()));
        px = 0.4 * W - coastAvg() * sc;
        py = 0;
    }
    if (!mob)
        box = { x: px, y: py, w: PH.w * sc, h: PH.h * sc };
    bandX = Math.min(W, box.x + box.w);
    photo.style.left = box.x + "px";
    photo.style.top = box.y + "px";
    photo.style.width = box.w + "px";
    photo.style.height = box.h + "px";
    const MT = [[-592.7, 113.6], [-594.4, 124.6], [-594.8, 125.4], [-775.2, 121.3]];
    Array.prototype.forEach.call(bldG.children, (g, i) => {
        if (mob && MT[i])
            g.setAttribute("transform", "translate(" + MT[i][0] + " " + MT[i][1] + ") scale(0.979)");
        else
            g.removeAttribute("transform");
    });
    let tf;
    if (mob)
        tf = "scale(" + km + ")";
    else if (!compact)
        tf = "scale(" + k + ")";
    else {
        let kb = Math.min((0.92 * W) / 776, (0.5 * H) / 705);
        // ●건물만 사진 위에 올라가도록: ●건물 왼쪽 끝을 그 높이의 사진 경계에 맞추고, ▲■건물은 흰 배경에 둠
        const cy = 0.2 * H + (820 - 280) * kb;
        const ci = Math.max(0, Math.min(PH.coast.length - 1, Math.round(((cy - box.y) / box.h) * PH.coast.length - 0.5)));
        const coastX = box.x + PH.coast[ci] * sc;
        if (coastX - (1240 - 680) * kb < 0.03 * W)
            kb = (coastX - 0.03 * W) / (1240 - 680);
        tf = "translate(" + (coastX - 1240 * kb + 100) + " " + (0.2 * H - 280 * kb) + ") scale(" + kb + ")";
    }
    bldG.setAttribute("transform", tf);
    // 빈 도형 선 굵기 = 건물 라인 굵기
    stage.style.setProperty("--ow", (2.3 * parseFloat(/scale\(([\d.]+)\)\s*$/.exec(tf)[1])).toFixed(3) + "px");
    const tw = mob ? 649 * km : compact ? 0.67 * W : D.titleW * k;
    title.style.width = tw + "px";
    title.style.left = (mob ? 65 * km : compact ? 0.045 * W : D.titleX * k) + "px";
    title.style.top = (mob ? 64 * km : compact ? 0.045 * H : D.titleTop * k) + "px";
    const dt = $("#date");
    if (mob) {
        let f2 = 53.7 * km;
        dt.style.fontSize = f2 + "px";
        dt.style.lineHeight = "1.45";
        dt.style.width = "auto";
        const s1 = dt.firstChild, w1 = s1.getBoundingClientRect().width, t1 = 288 * km + 0.09 * f2;
        if (w1 > 0)
            f2 = f2 * Math.max(0.85, Math.min(1.15, t1 / w1));
        dt.style.fontSize = f2 + "px";
        const wd = dt.getBoundingClientRect().width;
        dt.style.left = 746 * km + 0.07 * f2 - wd + "px";
        dt.style.top = 1573 * km - 1.089 * f2 + "px";
    }
    else {
        const kk = W / 2000;
        let f1 = 84 * kk;
        dt.style.fontSize = f1 + "px";
        dt.style.lineHeight = "1";
        const w0d = dt.getBoundingClientRect().height;
        const t0 = 741 * kk + 0.09 * f1;
        if (w0d > 0)
            f1 = f1 * Math.max(0.85, Math.min(1.15, t0 / w0d));
        dt.style.fontSize = f1 + "px";
        dt.style.left = 1947 * kk + 0.137 * f1 + "px";
        dt.style.top = 58.3 * kk - 0.06 * f1 + "px";
    }
    const m = $("#triMark").getBoundingClientRect(), sr = stage.getBoundingClientRect();
    ox = m.left + m.width / 2 - sr.left;
    oy = m.top + m.height / 2 - sr.top;
    maxD = Math.max(Math.hypot(ox, oy), Math.hypot(W - ox, oy), Math.hypot(ox, H - oy), Math.hypot(W - ox, H - oy));
    band = maxD * 0.3;
    mctx.clearRect(0, 0, W, H);
    mctx.fillStyle = "#000";
    if (bandX < W)
        mctx.fillRect(bandX, 0, W - bandX, H);
    mctx.drawImage(photo, box.x, box.y, box.w, box.h);
}
function hash(i, j) {
    const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
    return v - Math.floor(v);
}
function clip() {
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(maskCv, 0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";
}
function draw(R) {
    ctx.clearRect(0, 0, W, H);
    const p1 = new Path2D(), p2 = new Path2D();
    const cols = Math.ceil(W / S) + 1, rows = Math.ceil(H / S) + 1;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * S, y = j * S;
            const k = (R - Math.hypot(x - ox, y - oy)) / band - hash(i, j) * 0.3;
            if (k <= 0.05)
                continue;
            const r = Math.min(1, k) * S * 0.82, p = x < bandX ? p1 : p2;
            p.moveTo(x + r, y);
            p.arc(x, y, r, 0, 6.2832);
        }
    }
    ctx.fillStyle = tint();
    ctx.fill(p1);
    ctx.fill(p2);
    clip();
}
function finish() {
    done = true;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = tint();
    ctx.fillRect(0, 0, W, H);
    clip();
}
function skip() {
    cancelAnimationFrame(raf);
    run++;
    stage.classList.add("skip");
    finish();
}
function start() {
    cancelAnimationFrame(raf);
    const my = ++run;
    done = false;
    endTrans(false);
    showMain(false);
    stage.classList.remove("go", "skip", "leave");
    startAt = performance.now();
    buildBuildings();
    layout();
    buildGrid();
    ctx.clearRect(0, 0, W, H);
    void stage.offsetWidth;
    stage.classList.add("go");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
    }
    const t0 = performance.now();
    function tick(now) {
        if (my !== run)
            return;
        const t = now - t0 - WAVE_START;
        if (t < 0) {
            raf = requestAnimationFrame(tick);
            return;
        }
        const p = Math.min(1, t / WAVE_DUR);
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        draw(e * (maxD + band * 1.3) + band * 0.45 * (1 - p));
        if (p < 1)
            raf = requestAnimationFrame(tick);
        else
            finish();
    }
    raf = requestAnimationFrame(tick);
}
photo.src = "assets/intro-photo.webp";
const LOGO_TEMPLATE = '<svg viewBox="0 0 1123.36 185.7" role="img" aria-label="Flux Point"><path d="M0,181.64h44.97v-70.62h75.45v-36.33H44.97v-36.84h90.18V0H0v181.64Z" style="--d:{D0}"/><path d="M150.64,181.64h41.92V0h-41.92v181.64Z" style="--d:{D1}"/><path d="M257.34,185.45c18.04,0,29.47-7.11,38.87-19.82h.76v16h39.63V51.57h-41.41v72.66c0,15.5-8.64,26.17-22.86,26.17-13.21,0-19.56-7.88-19.56-22.1V51.57h-41.15v85.36c0,28.96,15.75,48.52,45.73,48.52" style="--d:{D2}"/><path d="M348.29,181.64h45.22l23.63-38.87h.51l21.34,38.87h48.01l-44.2-68.84,38.61-61.22h-43.44l-18.29,33.53h-.51l-19.31-33.53h-47.25l40.9,61.73-45.22,68.34Z" style="--d:{D3}"/><path d="M586.32,85.36v-47.51h33.28c16,0,25.4,8.89,25.4,23.37s-9.15,24.13-25.4,24.13h-33.28ZM540.59,181.64h45.73v-60.72h42.42c37.34,0,61.48-24.64,61.48-59.45,0-18.29-6.6-33.79-18.29-44.71-11.18-10.67-27.44-16.77-49.54-16.77h-81.8v181.64Z" style="--d:{D4}"/><path d="M762.37,185.7c41.92,0,69.35-29.72,69.35-68.85s-27.44-68.85-69.35-68.85-69.61,29.72-69.61,68.85,27.94,68.85,69.61,68.85M762.12,156.24c-18.04,0-27.44-15.75-27.44-39.38s9.4-39.63,27.44-39.63,27.69,16.01,27.69,39.63-9.65,39.38-27.69,39.38" style="--d:{D5}"/><path d="M845.7,33.53h41.41V0h-41.41v33.53ZM845.7,181.64h41.41V51.57h-41.41v130.07Z" style="--d:{D6}"/><path d="M906.92,181.64h41.41v-71.89c0-16,9.15-27.44,22.86-27.44s20.32,9.4,20.32,23.12v76.21h41.41v-84.6c0-28.96-16.77-49.28-45.22-49.28-18.04,0-30.48,7.62-40.14,21.59h-.76v-17.78h-39.89v130.07Z" style="--d:{D7}"/><path d="M1100.75,183.16c11.18,0,19.05-1.02,22.61-2.03v-30.23c-1.52,0-5.59.25-9.15.25-8.89,0-14.48-2.54-14.48-12.7v-60.97h23.63v-25.91h-23.63V10.42h-40.39v41.15h-17.27v25.91h17.27v69.86c0,27.95,17.28,35.82,41.41,35.82" style="--d:{D8}"/></svg>';
let logo = LOGO_TEMPLATE;
for (let q = 0; q < 9; q++)
    logo = logo.replace("{D" + q + "}", (6.6 + q * 0.06).toFixed(2) + "s");
title.innerHTML = logo;
const trans = $("#trans");
const tctx = trans.getContext("2d");
let inTrans = false, tRaf = 0;
function showMain(on) {
    // Drop the overlay's own background so only the dot canvas still
    // covers the real page while it clears.
    root.classList.toggle("revealed", on);
    stage.classList.toggle("gone", on);
}
function endTrans(showFinal) {
    cancelAnimationFrame(tRaf);
    inTrans = false;
    trans.style.display = "none";
    if (showFinal) {
        showMain(true);
        hasEntered = true;
        // 스플래시가 걷히면 메인 화면은 항상 맨 위에서 시작합니다.
        window.scrollTo(0, 0);
    }
    // Keep the page under the overlay pinned to the top until the reveal
    // has fully settled, then hand scrolling back to it.
    root.classList.toggle("entered", showFinal);
    document.documentElement.style.overflow = showFinal ? "" : "hidden";
}
function transition(ox0, oy0) {
    inTrans = true;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        endTrans(true);
        return;
    }
    const tw = stage.clientWidth, th = stage.clientHeight, td = Math.min(window.devicePixelRatio || 1, 2);
    trans.width = Math.round(tw * td);
    trans.height = Math.round(th * td);
    trans.style.display = "block";
    tctx.setTransform(td, 0, 0, td, 0, 0);
    const Sz = S, cols = Math.ceil(tw / Sz) + 1, rows = Math.ceil(th / Sz) + 1;
    const mD = Math.max(Math.hypot(ox0, oy0), Math.hypot(tw - ox0, oy0), Math.hypot(ox0, th - oy0), Math.hypot(tw - ox0, th - oy0)), bd = mD * 0.3;
    const T1 = 1100, HOLD = 120, T2 = 1500;
    let swapped = false, t0 = 0;
    // The page underneath (e.g. the hero's 1.7MB map) may still be
    // downloading on a slow connection; keep the screen full red past
    // HOLD until its images are ready, so the dots never clear onto a
    // blank page.
    let pageReady = false;
    // Lazy images below the fold won't load until scrolled to, so only
    // wait on the ones the first screen actually shows.
    const pageImages = Array.from(document.images).filter((img) => !root.contains(img) && !img.complete && img.loading !== "lazy");
    Promise.race([
        Promise.all(pageImages.map((img) => img.decode().catch(() => { }))),
        new Promise((resolve) => setTimeout(resolve, PAGE_IMAGES_MAX_WAIT_MS)),
    ]).then(() => { pageReady = true; });
    function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }
    function frame(rad) {
        tctx.clearRect(0, 0, tw, th);
        const path = new Path2D();
        for (let i = 0; i < cols; i++)
            for (let j = 0; j < rows; j++) {
                const x = i * Sz, y = j * Sz, r = Sz * 0.8 * rad(x, y);
                if (r < 0.3)
                    continue;
                path.moveTo(x + r, y);
                path.arc(x, y, r, 0, 6.2832);
            }
        tctx.fillStyle = tint();
        tctx.fill(path);
    }
    function tick(now) {
        if (!inTrans)
            return;
        if (!t0)
            t0 = now;
        const t = now - t0;
        if (t < T1) {
            const R = ease(t / T1) * (mD + bd * 1.3);
            frame((x, y) => Math.min(1, Math.max(0, (R - Math.hypot(x - ox0, y - oy0)) / bd - hash(Math.round(x / Sz), Math.round(y / Sz)) * 0.3)));
        }
        else if (t < T1 + HOLD || !pageReady) {
            if (!swapped) {
                showMain(true);
                swapped = true;
            }
            tctx.clearRect(0, 0, tw, th);
            tctx.fillStyle = tint();
            tctx.fillRect(0, 0, tw, th);
            // Still waiting: pin the clock at the end of HOLD so the reveal
            // starts from its beginning once the images land.
            if (t >= T1 + HOLD)
                t0 = now - (T1 + HOLD);
        }
        else if (t < T1 + HOLD + T2) {
            if (!swapped) {
                showMain(true);
                swapped = true;
            }
            const R2 = ease((t - T1 - HOLD) / T2) * (mD + bd * 1.3);
            frame((x, y) => 1 - Math.min(1, Math.max(0, (R2 - Math.hypot(x - ox0, y - oy0)) / bd - hash(Math.round(x / Sz), Math.round(y / Sz)) * 0.3)));
        }
        else {
            endTrans(true);
            return;
        }
        tRaf = requestAnimationFrame(tick);
    }
    tRaf = requestAnimationFrame(tick);
}
function onStageClick(e) {
    if (!done) {
        skip();
        return;
    }
    if (inTrans || stage.classList.contains("gone"))
        return;
    const r = stage.getBoundingClientRect();
    let x = e.clientX - r.left, y = e.clientY - r.top;
    if (e.detail === 0) {
        const b = $("#enter").getBoundingClientRect();
        x = b.left + b.width / 2 - r.left;
        y = b.top + b.height / 2 - r.top;
    }
    transition(x, y);
}
function onTitleClick(e) {
    e.stopPropagation();
    start();
}
function onTitleKeydown(e) {
    if (e.key !== "Enter" && e.key !== " ")
        return;
    e.preventDefault();
    e.stopPropagation();
    start();
}
function onResize() {
    if (inTrans) {
        endTrans(true);
        return;
    }
    if (!done) {
        layout();
        buildGrid();
        return;
    }
    stage.classList.add("skip");
    layout();
    buildGrid();
    finish();
}
stage.addEventListener("click", onStageClick);
title.addEventListener("click", onTitleClick);
title.addEventListener("keydown", onTitleKeydown);
window.addEventListener("resize", onResize);
window.scrollTo(0, 0);
document.documentElement.style.overflow = "hidden";
let started = false;
let cancelled = false;
function go() {
    if (!started && !cancelled) {
        started = true;
        start();
    }
}
// The intro needs the photo: the halftone mask is cut from it when the
// animation starts, and it fades in at 7.4s. So wait for it however long
// it takes (the stage stays blank until then); only the font wait has a
// timeout. If the photo fails outright, hide it so browsers don't draw a
// broken-image "?" and run the intro without it.
let fallback;
const photoReady = photo.decode().catch(() => { photo.style.visibility = "hidden"; });
const fontsReady = new Promise((resolve) => {
    fallback = setTimeout(resolve, 1500);
    if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(() => resolve());
});
Promise.all([photoReady, fontsReady]).then(go);

// 비교용 컬러/모노 전환: 모노는 스플래시의 레드를 블랙(#1b191a)으로 바꿉니다(css/splash.css .fpsplash.mono).
// 마지막 선택은 이 브라우저에만 기억합니다.
const toneBtns = root.querySelectorAll(".tone button");
const setTone = (tone) => {
    root.classList.toggle("mono", tone === "mono");
    toneBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tone === tone)));
    try { localStorage.setItem("fpsplash-tone", tone); } catch (e) {}
    if (done)
        finish();   // 다 그려진 사진 실루엣도 새 색으로 다시 칠함
};
toneBtns.forEach((b) => b.addEventListener("click", () => setTone(b.dataset.tone)));
try { if (localStorage.getItem("fpsplash-tone") === "mono") setTone("mono"); } catch (e) {}

})();
