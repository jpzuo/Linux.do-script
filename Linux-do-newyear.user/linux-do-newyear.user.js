// ==UserScript==
// @name         Linux.do 新春氛围背景
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  为 Linux.do 增加有年味的红金背景与轻量动态效果
// @author       jpzuo
// @match        https://linux.do/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const STYLE_ID = "linuxdo-newyear-style";
  const TOGGLE_STYLE_ID = "linuxdo-newyear-toggle-style";
  const STORAGE_KEY = "linuxdo_newyear_enabled";
  const TOGGLE_ID = "linuxdo-newyear-toggle";
  const LANTERN_LAYER_ID = "linuxdo-newyear-lanterns";

  function createStyleText() {
    return `
:root{
  --ny-red-1:#4b0000;
  --ny-red-2:#8b0000;
  --ny-red-3:#c20f1f;
  --ny-gold-1:#d4a017;
  --ny-gold-2:#f5d76e;
}

html, body{
  background:
    radial-gradient(circle at 12% 10%, rgba(245,215,110,.18), transparent 28%),
    radial-gradient(circle at 88% 20%, rgba(212,160,23,.16), transparent 30%),
    radial-gradient(circle at 50% 108%, rgba(75,0,0,.88), rgba(40,0,0,1) 66%),
    linear-gradient(145deg, var(--ny-red-1), var(--ny-red-2) 45%, var(--ny-red-3));
  background-repeat:no-repeat !important;
}

body::after{
  content:"";
  position:absolute;
  left:0;
  right:0;
  top:0;
  height:96px;
  z-index:0;
  pointer-events:none;
  background:
    radial-gradient(circle at 8% -26px, rgba(245,215,110,.26), transparent 40%),
    radial-gradient(circle at 50% -34px, rgba(245,215,110,.2), transparent 42%),
    radial-gradient(circle at 92% -26px, rgba(245,215,110,.26), transparent 40%);
}

.d-header,
.topic-body,
.topic-map,
.topic-post,
.list-container,
.navigation-container,
.user-main .about,
.category-box,
.categories-and-latest{
  background:rgba(255,246,228,.95) !important;
  border:1px solid rgba(212,160,23,.35) !important;
  box-shadow:none !important;
}

a,
.link-top-line,
.topic-list .main-link a.title{
  color:#701010 !important;
}

.topic-list .main-link a.title,
.fancy-title,
.topic-title a{
  color:#651010 !important;
  font-weight:600;
}

#topic-title h1 a,
.topic-title .fancy-title,
.title-wrapper .fancy-title{
  color:#fff1b3 !important;
  font-weight:700 !important;
  text-shadow:0 1px 2px rgba(0,0,0,.45);
}

#topic-title{
  border-left:4px solid rgba(245, 215, 110, .9);
  padding-left:10px;
}

.topic-list .link-bottom-line,
.topic-excerpt,
.topic-list .num,
.topic-list .posters a,
.names span,
.badge-notification,
.category-list .category-description{
  color:#6e5c49 !important;
}

.discourse-tag,
.discourse-tag.box,
.topic-list .discourse-tags .discourse-tag{
  color:#7c2600 !important;
  background:rgba(245, 215, 110, .35) !important;
  border-color:rgba(212,160,23,.55) !important;
}

.btn-primary,
.badge-category,
.nav-pills>li>a.active{
  background:linear-gradient(145deg, #b50d16, #8e0b12) !important;
  border-color:#7a090f !important;
  color:#ffe9b0 !important;
}

.select-kit.is-expanded .select-kit-options,
.select-kit-options,
.select-kit.collection .select-kit-row,
.d-menu,
.menu-panel{
  z-index:12000 !important;
}

.select-kit.is-expanded{
  z-index:12000 !important;
}

.list-container,
.navigation-container,
.topic-body,
.topic-post,
.topic-map{
  overflow:visible !important;
}

#${LANTERN_LAYER_ID}{
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:0;
}

#${LANTERN_LAYER_ID} .ny-lantern{
  position:fixed;
  width:42px;
  height:56px;
  border-radius:21px 21px 18px 18px;
  background:
    linear-gradient(180deg, #d82621 0%, #b31212 70%, #8d0e10 100%);
  border:1px solid rgba(245,215,110,.75);
  box-shadow:inset 0 0 0 1px rgba(120,0,0,.35);
}

#${LANTERN_LAYER_ID} .ny-lantern::before{
  content:"";
  position:absolute;
  left:50%;
  top:-14px;
  width:2px;
  height:14px;
  transform:translateX(-50%);
  background:rgba(245,215,110,.85);
}

#${LANTERN_LAYER_ID} .ny-lantern::after{
  content:"";
  position:absolute;
  left:50%;
  bottom:-11px;
  width:2px;
  height:11px;
  transform:translateX(-50%);
  background:rgba(245,215,110,.85);
}

#${LANTERN_LAYER_ID} .ny-lantern i{
  position:absolute;
  left:7px;
  right:7px;
  height:1px;
  background:rgba(245,215,110,.55);
}

#${LANTERN_LAYER_ID} .ny-lantern i:nth-child(1){ top:16px; }
#${LANTERN_LAYER_ID} .ny-lantern i:nth-child(2){ top:27px; }
#${LANTERN_LAYER_ID} .ny-lantern i:nth-child(3){ top:38px; }

#${LANTERN_LAYER_ID} .ny-l-1{ left:12px; top:94px; }
#${LANTERN_LAYER_ID} .ny-l-2{ left:26px; top:214px; transform:scale(.9); opacity:.95; }
#${LANTERN_LAYER_ID} .ny-r-1{ right:12px; top:94px; }
#${LANTERN_LAYER_ID} .ny-r-2{ right:26px; top:214px; transform:scale(.9); opacity:.95; }

@media (max-width: 980px){
  #${LANTERN_LAYER_ID} .ny-l-2,
  #${LANTERN_LAYER_ID} .ny-r-2{
    display:none;
  }
}
`;
  }

  function ensureToggleStyle() {
    if (document.getElementById(TOGGLE_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = TOGGLE_STYLE_ID;
    style.textContent = `
#${TOGGLE_ID}{
  position:fixed;
  right:14px;
  bottom:14px;
  z-index:10000;
  border:none;
  border-radius:999px;
  padding:8px 12px;
  font-size:12px;
  line-height:1;
  cursor:pointer;
  color:#ffe9b0;
  background:linear-gradient(145deg,#ba1620,#8d0f16);
  box-shadow:0 6px 16px rgba(0,0,0,.25);
}

#${TOGGLE_ID}:hover{
  filter:brightness(1.06);
}
`;
    document.documentElement.appendChild(style);
  }

  function setEnabled(enabled) {
    const styleEl = document.getElementById(STYLE_ID);
    if (enabled) {
      if (styleEl) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = createStyleText();
      document.documentElement.appendChild(style);
      setLanternsVisible(true);
      return;
    }
    if (styleEl) styleEl.remove();
    setLanternsVisible(false);
  }

  function ensureLanternLayer() {
    if (document.getElementById(LANTERN_LAYER_ID)) return;
    const layer = document.createElement("div");
    layer.id = LANTERN_LAYER_ID;
    layer.innerHTML = `
<div class="ny-lantern ny-l-1"><i></i><i></i><i></i></div>
<div class="ny-lantern ny-l-2"><i></i><i></i><i></i></div>
<div class="ny-lantern ny-r-1"><i></i><i></i><i></i></div>
<div class="ny-lantern ny-r-2"><i></i><i></i><i></i></div>`;
    document.body.appendChild(layer);
  }

  function setLanternsVisible(visible) {
    const layer = document.getElementById(LANTERN_LAYER_ID);
    if (!layer) return;
    layer.style.display = visible ? "block" : "none";
  }

  function createToggle() {
    if (document.getElementById(TOGGLE_ID)) return;
    const btn = document.createElement("button");
    btn.id = TOGGLE_ID;
    const enabled = localStorage.getItem(STORAGE_KEY) !== "0";
    btn.textContent = enabled ? "年味: 开" : "年味: 关";
    btn.addEventListener("click", () => {
      const nextEnabled = localStorage.getItem(STORAGE_KEY) === "0";
      localStorage.setItem(STORAGE_KEY, nextEnabled ? "1" : "0");
      setEnabled(nextEnabled);
      btn.textContent = nextEnabled ? "年味: 开" : "年味: 关";
    });
    document.body.appendChild(btn);
  }

  function init() {
    ensureToggleStyle();
    ensureLanternLayer();
    const enabled = localStorage.getItem(STORAGE_KEY) !== "0";
    setEnabled(enabled);
    createToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
