<p align="center">
  <img alt="logo" src="image\lg.jpg" width="200" style="margin-bottom: 5px;">
</p>
<h3 align="center">云端打卡南工大</h3>

## 介绍

“**云端打卡南工大**”微信小程序，为21级新生服务，让无法进校的家长与孩子云端合影。目前主要实现了如下功能：

- 【背景选择】
  - 用户可自由选择打卡图片背景
- 【自动人像抠图】
  - 用户可上传任意含有人像的图片，服务器调用<a href="https://ai.baidu.com/tech/body/seg">百度人像分割API</a>实现
- 【图片合成】
  - 用户可对去背景的人像进行 缩放 旋转 平移操作
  - 点击生成图片，将人像与背景进行合成
  - 点击保存照片，将图片保存到本地

## 快速体验

<p align="center">
  <img src="image\code.jpg" width="200" style="margin-bottom: 10px;">
</p>

## 效果图

<p align="center">
  <img alt="logo" src="image\rs.jpg" width="200" style="margin-bottom: 5px;">
  <img alt="logo" src="image\rs1.jpg" width="200" style="margin-bottom: 5px;">
</p>

## 开发工具

[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html )、[微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)、VS Code

## 使用之前

在使用本项目之前，请确保已经对微信官方的 [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)有所了解，本仓库为项目的前端部分。后端程序由<a href="https://github.com/Mr-Lobster">@Mr-Lobster</a>负责，移步后端项目仓库<a href="https://github.com/Mr-Lobster/beautify_school_bg">beautify_school_bg</a>

小程序分为前后端，前端采用**微信小程序**开发，后端部署在自己的服务器上。后端主要负责 人像分割，图片合成，前端将图片的相对位移，旋转角，相对缩放，人像图片数据以及背景id号传给服务器，服务器将合成后的图片数据传回前端

## 版本

`v1.2.1`，`2021-10-09`

- `添加`请求失败err

`v1.2.0` ，`2021-10-09`

- `优化`小程序界面
- `增加`跳转 校招办AR云游校园界面 按钮

`v1.1.0`，`2021-10-08`

- `实现`图片旋转，缩放，平移
- `实现`自由选择背景图片
- `实现`合成图片并保存至本地

## 鸣谢

感谢<a href="https://github.com/BamLubi">@BamLubi</a> <a href="https://github.com/Mr-Lobster">@Mr-Lobster</a>的技术支持
