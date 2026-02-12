// ==UserScript==
// @name         Linux.do 社区助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  为 Linux.do 添加快捷评论和回到顶部
// @author       You
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'linuxdo_quick_comments',
        FLOAT_BAR_WIDTH: '40px',
        BUTTON_SIZE: '40px'
    };

    const UI = {
        TITLE: '常用评论',
        QUICK_COMMENT: '快捷评论',
        BACK_TO_TOP: '回到顶部',
        PLACEHOLDER: '输入新的常用评论...',
        ADD: '添加',
        EMPTY: '暂无常用评论<br>请先添加',
        NO_REPLY_BUTTON: '未找到回复按钮，请确保在帖子页面',
        WAIT_TIMEOUT: '等待元素超时',
        POST_FAILED: '发送评论失败: '
    };

    const SELECTORS = {
        reply: [
            'button.btn-primary.create',
            'button[aria-label*="回复"]',
            '.topic-footer-main-buttons button.create',
            '#topic-footer-buttons button.create',
            'button.reply'
        ],
        textarea: [
            '.d-editor-input',
            'textarea.d-editor-input',
            '#reply-control textarea',
            'textarea[aria-label*="评论"]'
        ],
        submit: [
            '#reply-control button.btn-primary.create',
            'button.btn-primary.create',
            'button[aria-label*="发送"]',
            '.submit-panel button.create'
        ]
    };

    class QuickComments {
        constructor() {
            this.comments = this.load();
        }

        load() {
            try {
                return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '[]');
            } catch (error) {
                console.error('加载评论失败:', error);
                return [];
            }
        }

        save() {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.comments));
            } catch (error) {
                console.error('保存评论失败:', error);
            }
        }

        add(text) {
            const normalized = text && text.trim();
            if (!normalized) return false;
            this.comments.push({ id: Date.now(), text: normalized });
            this.save();
            return true;
        }

        remove(id) {
            this.comments = this.comments.filter((item) => item.id !== id);
            this.save();
        }

        getAll() {
            return this.comments;
        }
    }

    const qs = (selector, root = document) => root.querySelector(selector);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const isVisible = (el) => el && el.offsetParent !== null;
    const findFirst = (selectors) => {
        for (const selector of selectors) {
            const el = qs(selector);
            if (el) return el;
        }
        return null;
    };
    const findFirstVisible = (selectors) => {
        for (const selector of selectors) {
            const el = qs(selector);
            if (isVisible(el)) return el;
        }
        return null;
    };

    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
#linuxdo-float-bar{position:fixed;right:16px;top:50%;transform:translateY(-50%);width:${CONFIG.FLOAT_BAR_WIDTH};background:rgba(255,255,255,.95);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.1);padding:6px;z-index:9999;display:flex;flex-direction:column;gap:6px}
.linuxdo-btn{width:${CONFIG.BUTTON_SIZE};height:${CONFIG.BUTTON_SIZE};border:none;border-radius:8px;background:#f0f0f0;color:#333;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}
.linuxdo-btn:hover{background:#e0e0e0;transform:scale(1.08)}
#linuxdo-comments-panel{position:fixed;right:80px;top:50%;transform:translateY(-50%);width:280px;max-height:480px;background:#fff;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.15);z-index:9998;display:none;flex-direction:column;overflow:hidden}
#linuxdo-comments-panel.show{display:flex}
.comments-panel-header{padding:12px 14px;border-bottom:1px solid #e8e8e8;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:14px}
.comments-panel-header span:last-child{cursor:pointer;opacity:.6;font-size:18px}
.comments-panel-header span:last-child:hover{opacity:1}
.comments-panel-body{flex:1;overflow-y:auto;padding:8px}
.comments-panel-body::-webkit-scrollbar{width:6px}
.comments-panel-body::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}
.comment-item{padding:8px 10px;margin-bottom:6px;background:#f8f8f8;border-radius:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:all .2s}
.comment-item:hover{background:#ececec;transform:translateX(-2px)}
.comment-text{flex:1;word-break:break-word;font-size:12px;color:#555;line-height:1.4}
.comment-delete{color:#ff6b6b;cursor:pointer;padding:2px 6px;margin-left:8px;font-size:16px;opacity:.6}
.comment-delete:hover{opacity:1}
.comments-panel-footer{padding:8px;border-top:1px solid #e8e8e8}
.add-comment-input{width:100%;padding:8px 10px;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:6px;font-size:12px;box-sizing:border-box}
.add-comment-input:focus{outline:none;border-color:#999}
.add-comment-btn{width:100%;padding:8px;background:#333;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500}
.add-comment-btn:hover{background:#444}
.empty-message{text-align:center;color:#999;padding:20px;font-size:12px}
@media (prefers-color-scheme: dark){
  #linuxdo-float-bar{background:rgba(30,30,30,.95)}
  .linuxdo-btn{background:#2a2a2a;color:#e0e0e0}
  .linuxdo-btn:hover{background:#3a3a3a}
  #linuxdo-comments-panel{background:#1e1e1e}
  .comments-panel-header{border-bottom-color:#333;color:#e0e0e0}
  .comments-panel-body::-webkit-scrollbar-thumb{background:#444}
  .comment-item{background:#2a2a2a}
  .comment-item:hover{background:#333}
  .comment-text{color:#ccc}
  .comments-panel-footer{border-top-color:#333}
  .add-comment-input{background:#2a2a2a;border-color:#444;color:#e0e0e0}
  .add-comment-input:focus{border-color:#666}
  .add-comment-btn{background:#4a4a4a}
  .add-comment-btn:hover{background:#5a5a5a}
  .empty-message{color:#666}
}`;
        document.head.appendChild(style);
    }

    function createUI() {
        const floatBar = document.createElement('div');
        floatBar.id = 'linuxdo-float-bar';
        floatBar.innerHTML = `
<button class="linuxdo-btn" id="quick-comment-btn" title="${UI.QUICK_COMMENT}">💬</button>
<button class="linuxdo-btn" id="back-to-top-btn" title="${UI.BACK_TO_TOP}">⬆️</button>`;

        const panel = document.createElement('div');
        panel.id = 'linuxdo-comments-panel';
        panel.innerHTML = `
<div class="comments-panel-header">
  <span>${UI.TITLE}</span>
  <span id="close-panel">✕</span>
</div>
<div class="comments-panel-body" id="comments-list"></div>
<div class="comments-panel-footer">
  <input type="text" class="add-comment-input" id="new-comment-input" placeholder="${UI.PLACEHOLDER}">
  <button class="add-comment-btn" id="add-comment-btn">${UI.ADD}</button>
</div>`;

        const fragment = document.createDocumentFragment();
        fragment.appendChild(floatBar);
        fragment.appendChild(panel);
        document.body.appendChild(fragment);
    }

    function renderComments(store) {
        const listEl = qs('#comments-list');
        if (!listEl) return;
        const comments = store.getAll();
        if (!comments.length) {
            listEl.innerHTML = `<div class="empty-message">${UI.EMPTY}</div>`;
            return;
        }

        listEl.innerHTML = comments.map((comment) => `
<div class="comment-item" data-id="${comment.id}">
  <span class="comment-text">${comment.text}</span>
  <span class="comment-delete" data-id="${comment.id}">×</span>
</div>`).join('');
    }

    function waitForElement(selectors, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const foundNow = findFirstVisible(selectors);
            if (foundNow) {
                resolve(foundNow);
                return;
            }

            const observer = new MutationObserver(() => {
                const found = findFirstVisible(selectors);
                if (!found) return;
                clearTimeout(timeoutId);
                observer.disconnect();
                resolve(found);
            });

            const timeoutId = setTimeout(() => {
                observer.disconnect();
                reject(new Error(UI.WAIT_TIMEOUT));
            }, timeout);

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
    }

    function fireEditorEvents(textarea) {
        ['input', 'change', 'keyup'].forEach((type) => {
            textarea.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
        });
    }

    async function postComment(text) {
        try {
            const replyButton = findFirst(SELECTORS.reply);
            if (!replyButton) {
                alert(UI.NO_REPLY_BUTTON);
                return;
            }

            replyButton.click();
            const textarea = await waitForElement(SELECTORS.textarea, 5000);
            textarea.value = text;
            textarea.focus();
            fireEditorEvents(textarea);
            await sleep(300);
            (await waitForElement(SELECTORS.submit, 3000)).click();
        } catch (error) {
            console.error('发送评论失败:', error);
            alert(UI.POST_FAILED + error.message);
        }
    }

    function init() {
        const store = new QuickComments();
        createStyles();
        createUI();
        renderComments(store);

        const panel = qs('#linuxdo-comments-panel');
        const commentBtn = qs('#quick-comment-btn');
        const topBtn = qs('#back-to-top-btn');
        const closeBtn = qs('#close-panel');
        const addBtn = qs('#add-comment-btn');
        const input = qs('#new-comment-input');
        const commentsList = qs('#comments-list');
        if (!panel || !commentBtn || !topBtn || !closeBtn || !addBtn || !input || !commentsList) return;

        let hideTimer = null;
        let isInputFocused = false;
        const clearHide = () => clearTimeout(hideTimer);
        const hidePanelIf = (delay, predicate) => {
            hideTimer = setTimeout(() => {
                if (predicate()) panel.classList.remove('show');
            }, delay);
        };

        const checkLoginStatus = () => {
            commentBtn.style.display = qs('#current-user, .current-user') ? 'flex' : 'none';
        };
        checkLoginStatus();

        let checkTimer = null;
        const observer = new MutationObserver(() => {
            if (checkTimer) return;
            checkTimer = setTimeout(() => {
                checkLoginStatus();
                checkTimer = null;
            }, 500);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        commentBtn.addEventListener('mouseenter', () => {
            clearHide();
            panel.classList.add('show');
        });
        commentBtn.addEventListener('mouseleave', () => hidePanelIf(200, () => !panel.matches(':hover') && !isInputFocused));
        panel.addEventListener('mouseenter', clearHide);
        panel.addEventListener('mouseleave', () => hidePanelIf(100, () => !isInputFocused));

        input.addEventListener('focus', () => {
            isInputFocused = true;
            clearHide();
        });
        input.addEventListener('blur', () => {
            isInputFocused = false;
            hidePanelIf(200, () => !panel.matches(':hover'));
        });

        closeBtn.addEventListener('click', () => panel.classList.remove('show'));
        topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        addBtn.addEventListener('click', () => {
            if (!store.add(input.value)) return;
            input.value = '';
            renderComments(store);
        });
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') addBtn.click();
        });

        commentsList.addEventListener('click', (event) => {
            const deleteBtn = event.target.closest('.comment-delete');
            if (deleteBtn) {
                store.remove(parseInt(deleteBtn.dataset.id, 10));
                renderComments(store);
                return;
            }

            const commentItem = event.target.closest('.comment-item');
            if (!commentItem) return;
            const id = parseInt(commentItem.dataset.id, 10);
            const comment = store.getAll().find((item) => item.id === id);
            if (!comment) return;
            postComment(comment.text);
            panel.classList.remove('show');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
