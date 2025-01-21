# 闻达下载器

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 项目简介

闻达下载器是一个基于aria2的批量下载工具，专门用于从Hugging Face（HF）及其镜像网站下载模型文件。该项目采用Vue.js和Vuetify构建，提供了简洁易用的Web界面。

## 功能特性

- 支持批量下载HF模型文件
- 自动识别镜像网站，提高下载速度
- 断点续传功能
- 多线程下载
- 实时下载进度显示
- 支持自定义下载路径

## 技术栈

- 前端框架：Vue.js
- UI组件库：Vuetify
- 图标库：Material Design Icons
- 下载引擎：aria2

## 项目结构

```
.
├── index.html          # 项目入口文件
├── main.js             # 主逻辑文件
├── manifest.json       # Web应用配置文件
├── wd.png              # 应用图标
├── static/             # 静态资源目录
│   ├── vue.js          # Vue.js框架
│   ├── vuetify.js      # Vuetify组件库
│   ├── vuetify.min.css # Vuetify样式
│   └── mdi_font/       # Material Design Icons字体文件
```

## 使用方法

1. 确保已安装aria2
2. 打开index.html文件
3. 在输入框中输入模型名称或URL
4. 点击"开始下载"按钮
5. 查看下载进度

## 注意事项

- 请确保网络连接稳定
- 下载大文件时建议使用有线网络
- 部分镜像网站可能需要科学上网
- 下载路径需要有写权限

## 许可证

本项目采用MIT许可证，详情请参阅LICENSE文件。