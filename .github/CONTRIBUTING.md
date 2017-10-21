# 用户贡献指南

首先感谢大家使用 hexo-generator-mip ，请先阅读以下内容帮助大家了解如何快速向项目提交贡献。

### 如何获得帮助？

如果您在使用过程中遇到问题，可以在 [GitHub issue](https://github.com/xuexb/hexo-generator-mip/issues/new) 上提问。

### 如何提交代码？

首先需要 Fork [xuexb/hexo-generator-mip](https://github.com/xuexb/hexo-generator-mip) 项目，然后将项目克隆到本地。执行 `npm install` 安装依赖，然后提供以下命令：

```bash
# 运行单元测试
npm run test

# 监听文件改动并运行单元测试，方便本地编写测试用例
npm run test:watch

# 运行代码覆盖率测试
npm run test:cov
```

项目使用 [mochajs](http://mochajs.org/) 提供测试环境，使用 [chaijs](http://chaijs.com/api/bdd/) 提供 `BDD` 风格的断言，使用 [sinonjs](http://sinonjs.org/) 提供测试桩。

### 代码风格

代码使用 [fecs](http://fecs.baidu.com/) 规范，在提交代码之前，一定要使用 `npm run lint` 检查自己的代码风格规范是否符合项目的规范。当代码风格完全正常后，就可以继续你的提交了！

### 提交信息规范

参考 MIP 的 [提交信息规范](https://github.com/mipengine/spec/blob/master/commit-message-spec.md)

### 后记

开源是神圣的，我们期待您的参与，也感谢您的参与！
