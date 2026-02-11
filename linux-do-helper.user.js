// ==UserScript==
// @name         Linux.do 社区助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  为 Linux.do 社区添加快捷评论、返回顶部等功能
// @author       You
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'linuxdo_quick_comments',
        FLOAT_BAR_WIDTH: '40px',
        BUTTON_SIZE: '40px'
    };

    class QuickComments {
        constructor() {
            this.comments = this.load();
        }

        load() {
            try {
                const data = localStorage.getItem(CONFIG.STORAGE_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                console.error('加载常用评论失败:', e);
                return [];
            }
        }

        save() {
            try {
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.comments));
            } catch (e) {
                console.error('保存常用评论失败:', e);
            }
        }

        add(text) {
            if (!text || !text.trim()) return false;
            this.comments.push({
                id: Date.now(),
                text: text.trim()
            });
            this.save();
            return true;
        }

        remove(id) {
            this.comments = this.comments.filter(c => c.id !== id);
            this.save();
        }

        getAll() {
            return this.comments;
        }
    }

    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #linuxdo-float-bar {
                position: fixed;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                width: ${CONFIG.FLOAT_BAR_WIDTH};
                background: rgba(255, 255, 255, 0.95);
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                padding: 6px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .linuxdo-btn {
                width: ${CONFIG.BUTTON_SIZE};
                height: ${CONFIG.BUTTON_SIZE};
                border: none;
                border-radius: 8px;
                background: #f0f0f0;
                color: #333;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .linuxdo-btn:hover {
                background: #e0e0e0;
                transform: scale(1.08);
            }

            #linuxdo-comments-panel {
                position: fixed;
                right: 80px;
                top: 50%;
                transform: translateY(-50%);
                width: 280px;
                max-height: 480px;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                z-index: 9998;
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            #linuxdo-comments-panel.show {
                display: flex;
            }

            .comments-panel-header {
                padding: 12px 14px;
                border-bottom: 1px solid #e8e8e8;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                font-size: 14px;
            }

            .comments-panel-header span:last-child {
                cursor: pointer;
                opacity: 0.6;
                font-size: 18px;
            }

            .comments-panel-header span:last-child:hover {
                opacity: 1;
            }

            .comments-panel-body {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }

            .comments-panel-body::-webkit-scrollbar {
                width: 6px;
            }

            .comments-panel-body::-webkit-scrollbar-thumb {
                background: #ccc;
                border-radius: 3px;
            }

            .comment-item {
                padding: 8px 10px;
                margin-bottom: 6px;
                background: #f8f8f8;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
            }

            .comment-item:hover {
                background: #ececec;
                transform: translateX(-2px);
            }

            .comment-text {
                flex: 1;
                word-break: break-word;
                font-size: 12px;
                color: #555;
                line-height: 1.4;
            }

            .comment-delete {
                color: #ff6b6b;
                cursor: pointer;
                padding: 2px 6px;
                margin-left: 8px;
                font-size: 16px;
                opacity: 0.6;
            }

            .comment-delete:hover {
                opacity: 1;
            }

            .comments-panel-footer {
                padding: 8px;
                border-top: 1px solid #e8e8e8;
            }

            .add-comment-input {
                width: 100%;
                padding: 8px 10px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                margin-bottom: 6px;
                font-size: 12px;
                box-sizing: border-box;
            }

            .add-comment-input:focus {
                outline: none;
                border-color: #999;
            }

            .add-comment-btn {
                width: 100%;
                padding: 8px;
                background: #333;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
            }

            .add-comment-btn:hover {
                background: #444;
            }

            .empty-message {
                text-align: center;
                color: #999;
                padding: 20px;
                font-size: 12px;
            }

            @media (prefers-color-scheme: dark) {
                #linuxdo-float-bar {
                    background: rgba(30, 30, 30, 0.95);
                }
                .linuxdo-btn {
                    background: #2a2a2a;
                    color: #e0e0e0;
                }
                .linuxdo-btn:hover {
                    background: #3a3a3a;
                }
                #linuxdo-comments-panel {
                    background: #1e1e1e;
                }
                .comments-panel-header {
                    border-bottom-color: #333;
                    color: #e0e0e0;
                }
                .comments-panel-body::-webkit-scrollbar-thumb {
                    background: #444;
                }
                .comment-item {
                    background: #2a2a2a;
                }
                .comment-item:hover {
                    background: #333;
                }
                .comment-text {
                    color: #ccc;
                }
                .comments-panel-footer {
                    border-top-color: #333;
                }
                .add-comment-input {
                    background: #2a2a2a;
                    border-color: #444;
                    color: #e0e0e0;
                }
                .add-comment-input:focus {
                    border-color: #666;
                }
                .add-comment-btn {
                    background: #4a4a4a;
                }
                .add-comment-btn:hover {
                    background: #5a5a5a;
                }
                .empty-message {
                    color: #666;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function createFloatBar() {
        const floatBar = document.createElement('div');
        floatBar.id = 'linuxdo-float-bar';
        floatBar.innerHTML = `
            <button class="linuxdo-btn" id="quick-comment-btn" title="快捷评论">💬</button>
            <button class="linuxdo-btn" id="back-to-top-btn" title="返回顶部">⬆️</button>
        `;
        document.body.appendChild(floatBar);
    }

    function createCommentsPanel() {
        const panel = document.createElement('div');
        panel.id = 'linuxdo-comments-panel';
        panel.innerHTML = `
            <div class="comments-panel-header">
                <span>常用评论</span>
                <span id="close-panel">✕</span>
            </div>
            <div class="comments-panel-body" id="comments-list"></div>
            <div class="comments-panel-footer">
                <input type="text" class="add-comment-input" id="new-comment-input" placeholder="输入新的常用评论...">
                <button class="add-comment-btn" id="add-comment-btn">添加</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    function renderComments(quickComments) {
        const listEl = document.getElementById('comments-list');
        const comments = quickComments.getAll();

        if (comments.length === 0) {
            listEl.innerHTML = '<div class="empty-message">暂无常用评论<br>请先添加</div>';
            return;
        }

        listEl.innerHTML = comments.map(comment => `
            <div class="comment-item" data-id="${comment.id}">
                <span class="comment-text">${comment.text}</span>
                <span class="comment-delete" data-id="${comment.id}">×</span>
            </div>
        `).join('');
    }

    // 等待元素出现的辅助函数（使用 MutationObserver）
    function waitForElement(selectors, timeout = 5000) {
        return new Promise((resolve, reject) => {
            // 先检查元素是否已经存在
            for (const selector of selectors) {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    console.log('找到元素:', selector);
                    resolve(element);
                    return;
                }
            }

            // 设置超时
            const timeoutId = setTimeout(() => {
                observer.disconnect();
                reject(new Error('等待元素超时'));
            }, timeout);

            // 创建 MutationObserver 监听 DOM 变化
            const observer = new MutationObserver(() => {
                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element && element.offsetParent !== null) {
                        console.log('找到元素:', selector);
                        clearTimeout(timeoutId);
                        observer.disconnect();
                        resolve(element);
                        return;
                    }
                }
            });

            // 开始观察整个 body 的子树变化
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
        });
    }

    async function postComment(text) {
        console.log('开始发送评论:', text);

        try {
            // 查找回复按钮
            const replySelectors = [
                'button.btn-primary.create',
                'button[aria-label*="回复"]',
                '.topic-footer-main-buttons button.create',
                '#topic-footer-buttons button.create',
                'button.reply'
            ];

            let replyButton = null;
            for (const selector of replySelectors) {
                replyButton = document.querySelector(selector);
                if (replyButton) {
                    console.log('找到回复按钮:', selector);
                    break;
                }
            }

            if (!replyButton) {
                console.error('未找到回复按钮');
                alert('未找到回复按钮，请确保在帖子页面');
                return;
            }

            replyButton.click();
            console.log('已点击回复按钮，等待编辑器加载...');

            // 等待编辑器出现
            const textareaSelectors = [
                '.d-editor-input',
                'textarea.d-editor-input',
                '#reply-control textarea',
                'textarea[aria-label*="评论"]'
            ];

            const textarea = await waitForElement(textareaSelectors, 5000);
            console.log('编辑器已加载');

            // 设置内容
            textarea.value = text;
            textarea.focus();

            // 触发多种事件确保 Discourse 识别到变化
            const events = ['input', 'change', 'keyup'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true, cancelable: true });
                textarea.dispatchEvent(event);
            });

            console.log('已填充内容:', text);

            // 等待一小段时间让 Discourse 处理内容
            await new Promise(resolve => setTimeout(resolve, 300));

            // 查找并点击提交按钮
            const submitSelectors = [
                '#reply-control button.btn-primary.create',
                'button.btn-primary.create',
                'button[aria-label*="发送"]',
                '.submit-panel button.create'
            ];

            const submitBtn = await waitForElement(submitSelectors, 3000);
            submitBtn.click();
            console.log('已点击提交按钮');

        } catch (error) {
            console.error('发送评论失败:', error);
            alert('发送评论失败: ' + error.message);
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function init() {
        const quickComments = new QuickComments();

        createStyles();
        createFloatBar();
        createCommentsPanel();
        renderComments(quickComments);

        const panel = document.getElementById('linuxdo-comments-panel');
        const commentBtn = document.getElementById('quick-comment-btn');
        const input = document.getElementById('new-comment-input');
        let hideTimer = null;
        let isInputFocused = false;

        // 检查用户是否登录
        const checkLoginStatus = () => {
            const isLoggedIn = document.querySelector('#current-user, .current-user');
            if (commentBtn) {
                commentBtn.style.display = isLoggedIn ? 'flex' : 'none';
            }
        };

        // 初始检查
        checkLoginStatus();

        // 监听 DOM 变化，处理单页应用路由切换（使用节流避免频繁检查）
        let checkTimer = null;
        const observer = new MutationObserver(() => {
            if (checkTimer) return;
            checkTimer = setTimeout(() => {
                checkLoginStatus();
                checkTimer = null;
            }, 500);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 鼠标悬浮显示面板
        commentBtn.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            panel.classList.add('show');
        });

        // 鼠标离开按钮，延迟隐藏
        commentBtn.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(() => {
                if (!panel.matches(':hover') && !isInputFocused) {
                    panel.classList.remove('show');
                }
            }, 200);
        });

        // 鼠标进入面板，取消隐藏
        panel.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
        });

        // 鼠标离开面板，延迟隐藏（考虑输入框焦点）
        panel.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(() => {
                if (!isInputFocused) {
                    panel.classList.remove('show');
                }
            }, 100);
        });

        // 输入框获得焦点
        input.addEventListener('focus', () => {
            isInputFocused = true;
            clearTimeout(hideTimer);
        });

        // 输入框失去焦点
        input.addEventListener('blur', () => {
            isInputFocused = false;
            hideTimer = setTimeout(() => {
                if (!panel.matches(':hover')) {
                    panel.classList.remove('show');
                }
            }, 200);
        });

        document.getElementById('close-panel').addEventListener('click', () => {
            panel.classList.remove('show');
        });

        document.getElementById('back-to-top-btn').addEventListener('click', scrollToTop);

        document.getElementById('add-comment-btn').addEventListener('click', () => {
            const text = input.value.trim();
            if (text && quickComments.add(text)) {
                input.value = '';
                renderComments(quickComments);
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('add-comment-btn').click();
            }
        });

        document.getElementById('comments-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('comment-delete')) {
                quickComments.remove(parseInt(e.target.dataset.id));
                renderComments(quickComments);
                return;
            }

            const commentItem = e.target.closest('.comment-item');
            if (commentItem) {
                const comment = quickComments.getAll().find(c => c.id === parseInt(commentItem.dataset.id));
                if (comment) {
                    postComment(comment.text);
                    panel.classList.remove('show');
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
