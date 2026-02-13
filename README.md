# Linux.do 社区侧边栏助手

一个为 [Linux.do](https://linux.do) 社区设计的油猴脚本，提供快捷评论和便捷操作功能。

## ✨ 功能特性

### 🎯 核心功能
- **快捷评论** - 鼠标悬浮即可展开常用评论面板，一键发送
- **常用评论管理** - 添加、删除和本地存储常用评论
- **返回顶部** - 快速滚动到页面顶部
- **登录状态检测** - 未登录用户仅显示返回顶部按钮

### 🎨 界面设计
- 小巧精致的悬浮工具栏（40px 按钮）
- 流畅的动画效果和交互体验
- 智能的面板显示/隐藏逻辑

### ⚡ 性能优化
- 使用 MutationObserver 监听 DOM 变化
- 节流优化登录状态检查（500ms）
- 高效的元素等待机制
- localStorage 本地存储

## 📦 安装

### 前置要求
- 浏览器扩展：[Tampermonkey](https://www.tampermonkey.net/) 或 [Greasemonkey](https://www.greasespot.net/)

### 安装步骤
1. 安装 Tampermonkey 浏览器扩展
2. 点击 [安装脚本](./linux-do-helper.user.js)
3. 在弹出的页面中点击"安装"按钮
4. 访问 [Linux.do](https://linux.do) 即可使用

## 🚀 使用指南

### 快捷评论
1. 鼠标悬浮在右侧悬浮栏的 💬 按钮上
2. 在弹出的面板中添加常用评论
3. 点击任意常用评论即可自动发送

### 添加常用评论
1. 在评论面板底部的输入框中输入内容
2. 点击"添加"按钮或按 Enter 键
3. 评论将保存到本地浏览器存储

### 删除常用评论
- 点击评论项右侧的 × 按钮即可删除

### 返回顶部
- 点击右侧悬浮栏的 ⬆️ 按钮即可平滑滚动到页面顶部

## 🎯 适配说明

### 支持平台
- ✅ Tampermonkey
- ✅ Greasemonkey
- ✅ Violentmonkey

### 浏览器兼容
- ✅ Chrome/Edge (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## 🔧 技术实现

### 核心技术
- **MutationObserver** - 监听 DOM 变化，等待元素加载
- **localStorage** - 本地存储常用评论数据
- **Event Delegation** - 高效的事件处理

### 针对 Discourse 优化
- 智能识别 Discourse 论坛结构
- 多选择器兼容不同版本
- 自动触发必要的事件确保内容识别

## 📝 更新日志

### v1.0.1 (2024-02-11)
- ✨ 实现快捷评论功能
- ✨ 添加常用评论管理
- ✨ 支持鼠标悬浮触发
- ✨ 添加登录状态检测
- ⚡ 优化性能和交互体验

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Linux.do](https://linux.do) - 优秀的技术社区
- [Discourse](https://www.discourse.org/) - 强大的论坛系统
- 所有贡献者和用户

## 📮 联系方式

- 提交 Issue: [GitHub Issues](https://github.com/zb-zd/Linux.do-sidebar-script/issues)
- 讨论交流: [Linux.do 社区](https://linux.do)

---

**注意**: 本脚本仅用于个人学习和提升使用体验，请遵守社区规则，合理使用。

