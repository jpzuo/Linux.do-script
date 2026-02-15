# Linux.do Script Collection

这是一个面向 `Linux.do` 的油猴脚本集合仓库，当前包含两个脚本：

- 社区助手：快捷评论、常用评论管理、回到顶部
- 新春氛围：红金主题背景、灯笼装饰、主题开关

## 项目结构

- `Linux-do-helper.user/`
- `Linux-do-helper.user/linux-do-helper.user.js`：社区助手源码
- `Linux-do-helper.user/linux-do-helper.min.user.js`：社区助手压缩版
- `Linux-do-helper.user/build.js`：社区助手打包脚本
- `Linux-do-helper.user/README.md`：社区助手说明
- `Linux-do-newyear.user/`
- `Linux-do-newyear.user/linux-do-newyear.user.js`：新春氛围脚本
- `Linux-do-newyear.user/README.md`：新春氛围说明

## 安装方式

1. 安装 Tampermonkey / Violentmonkey / Greasemonkey
2. 选择任意脚本文件，复制内容到新建用户脚本中
3. 保存并访问 `https://linux.do/`

## 开发与构建

仅社区助手脚本需要构建压缩版。

```bash
npm install
npm run build
```

构建命令会执行：

- `node Linux-do-helper.user/build.js`

## 版本与维护建议

- 新功能优先放在对应脚本目录内维护
- 每个脚本保持独立 README，便于单独分发
- 修改样式脚本时优先保证可读性和性能，避免引入滚动卡顿

## 许可证

MIT，见 `LICENSE`。
