# Linux.do 新春氛围脚本

为 `https://linux.do/*` 提供春节主题视觉风格的油猴脚本，强调轻量和可开关。

## 功能

- 红金主题背景与顶部光晕装饰
- 左右侧静态灯笼装饰（移动端自动减少数量）
- 标题、标签、副标题分层配色，提升阅读区分度
- 右下角开关按钮 `年味: 开/关`，状态持久化到 `localStorage`
- 兼容常见下拉菜单层级，避免被主题层遮挡

## 性能策略

- 不使用滚动监听
- 不使用高频动画
- 不使用 `backdrop-filter`
- 灯笼为固定定位静态元素，渲染开销低

## 安装

1. 安装浏览器扩展：Tampermonkey / Violentmonkey / Greasemonkey
2. 新建脚本并粘贴 `linux-do-newyear.user.js` 内容
3. 保存后访问 `https://linux.do/`

## 使用说明

- 右下角按钮可随时切换主题开关
- 关闭后仅保留开关按钮本身，方便再次开启
- 若页面已打开，修改脚本后建议刷新页面查看效果

## 文件

- 主脚本：`Linux-do-newyear.user/linux-do-newyear.user.js`

## 已知说明

- 本脚本主要覆盖常见 Discourse 结构；若站点主题发生较大变化，部分选择器可能需要调整。
