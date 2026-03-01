// ==UserScript==
// @name         Linux.do 手机助手 - 返回顶部
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  为 Linux.do 手机网页提供返回顶部按钮
// @author       jpzuo
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const BTN_ID = 'linuxdo-mobile-back-to-top';
    const SHOW_AFTER = 280;
    const css = `
#${BTN_ID}{
  position:fixed;
  right:14px;
  bottom:calc(14px + env(safe-area-inset-bottom));
  width:46px;
  height:46px;
  border:none;
  border-radius:999px;
  background:rgba(35,35,35,.9);
  color:#fff;
  font-size:20px;
  line-height:1;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 4px 12px rgba(0,0,0,.24);
  z-index:9999;
  opacity:0;
  visibility:hidden;
  transform:translateY(10px);
  transition:opacity .2s ease, transform .2s ease, visibility .2s ease;
  -webkit-tap-highlight-color:transparent;
}
#${BTN_ID}.show{opacity:1;visibility:visible;transform:translateY(0)}
#${BTN_ID}:active{transform:scale(.96)}
@media (prefers-color-scheme: dark){
  #${BTN_ID}{background:rgba(245,245,245,.92);color:#111}
}
`;

    function init() {
        document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
        const btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.type = 'button';
        btn.title = '返回顶部';
        btn.setAttribute('aria-label', '返回顶部');
        btn.textContent = '↑';
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        document.body.appendChild(btn);

        let ticking = 0;
        const updateVisibility = () => {
            btn.classList.toggle('show', window.scrollY > SHOW_AFTER);
            ticking = 0;
        };

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = window.requestAnimationFrame(updateVisibility);
        }, { passive: true });

        updateVisibility();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
