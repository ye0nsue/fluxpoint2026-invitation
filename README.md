# Flux Point 2026 — 서양화과 졸업전시 온라인 초대장

빌드 과정 없는 정적 사이트입니다. Vercel에서 Framework Preset을 **Other**로 두고 그대로 배포합니다.

```
index.html        스플래시 + 메인 화면(#main)
css/splash.css    스플래시 스타일
css/main.css      메인 화면 스타일
js/splash.js      스플래시 애니메이션·입장 전환
assets/           이미지
```

스플래시는 화면 위를 덮는 오버레이이고, 입장 전환이 끝나면 아래에 깔린 `<main id="main">`이 드러납니다.

로컬 미리보기: `python3 -m http.server 8000` 후 http://localhost:8000
