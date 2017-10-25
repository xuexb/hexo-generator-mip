# hexo-generator-mip

统一处理 Hexo 模板中的 MIP 标签

[![NPM Version](https://img.shields.io/npm/v/hexo-generator-mip.svg)](https://www.npmjs.com/package/hexo-generator-mip)
[![NPM Downloads](https://img.shields.io/npm/dm/hexo-generator-mip.svg)](https://www.npmjs.com/package/hexo-generator-mip)
[![Linux Build](https://img.shields.io/travis/xuexb/hexo-generator-mip/master.svg?label=linux)](https://travis-ci.org/xuexb/hexo-generator-mip)
[![Windows Build](https://img.shields.io/appveyor/ci/xuexb/hexo-generator-mip/master.svg?label=windows)](https://ci.appveyor.com/project/xuexb/hexo-generator-mip)
[![Test Coverage](https://img.shields.io/coveralls/xuexb/hexo-generator-mip/master.svg)](https://coveralls.io/r/xuexb/hexo-generator-mip?branch=master)

## 安装

``` bash
npm install --save hexo-generator-mip
```

## 配置

``` yaml
# _config.yml
mip:
  key: value
```

配置名称 | 描述 | 默认值
--- | --- | ---
`mip.enable` | 是否开启 MIP 规范处理 | `false`
`mip.css` | 指定加载的样式文件，以 `主题目录/souce/css/` 为基础路径<br>如果没有配置，默认加载 `souce/css/**/*.css` 忽略以 `_` 开头的文件 | `''`
`mip.cssmin` | 是否开启样式压缩 | `true`
`mip.canonical` | 替换 canonical 地址 | `''`

### 处理 css

> [MIP style 标签文档](https://www.mipengine.org/doc/2-tech/1-mip-html.html)

#### 1. 默认全部加载

默认情况下将加载主题目录下 `souce/css/**/!(_*).css` 的文件，并合并添加到页面的 `<head>` 标签结束前。

#### 2. 配置加载文件的名单

配置 `mip.css` 则直接加载配置的文件，如：

``` yaml
mip:
  css:
    - reset.css
    - main.css
```

#### 3. 主动调用 mipcss 函数加载指定文件 - v0.4.0 新增

可以主动在模板内加载指定的文件，使用 `{{ mipcss(file1 [, file2]) }}` ，以主题目录下 `souce/css/` 为基础路径加载，如：

```
# page.swig
<head>
    {{ mipcss('reset.css', 'page.css') }}
</head>

# index.swig
<head>
    {{ mipcss('reset.css', 'index.css') }}
</head>
```

> 注意：使用该方式加载样式后，将忽略 **#1 默认全部加载** 和 **#2 主动调用 mipcss 函数加载指定文件** ，因为页面已经存在 `<style mip-custom>` 标签。

### 处理 a 标签

> [MIP a 标签文档](https://www.mipengine.org/examples/mip-extensions/mip-link.html)

统一替换页面中的 `<a>` 标签，如果是当前网站的，则添加 `data-type="mip"` 。

### 处理 img 链接

> [MIP img 标签文档](https://www.mipengine.org/examples/mip/mip-img.html)

统一替换页面中的 `<img>` 标签为 `<mip-img>` ，根据 MIP 规范，图片必须设置 `width` 和 `height` 。

### 处理 canonical

> [MIP canonical 规范文档](https://www.mipengine.org/doc/2-tech/5-show-your-page.html) ，思路来自 [@HyunSeob/hexo-auto-canonical](https://github.com/HyunSeob/hexo-auto-canonical)

在主题模板内 `<head>` 标签结束前使用 `mipcanonical(page)` 引入。如果需要自定义 canonical 的域名或者路径前缀，可以配置：

``` yaml
# 自定义域名
mip:
  canonical: 'https://mip.example.com'

# 自定义路径
mip:
  canonical: 'https://example.com/mip'
```

## contributors

> [用户贡献指南](.github/CONTRIBUTING.md)

- [@yugasun](https://github.com/yugasun/)
- [@xuexb](https://github.com/xuexb/)

## License

[MIT](./LICENSE)
