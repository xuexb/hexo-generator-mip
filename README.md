# hexo-generator-mip

统一处理 Hexo 模板中的 MIP 标签

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
`mip.css` | 指定加载的样式文件, 以 `主题目录/souce/css/` 为基础路径<br>如果没有配置, 默认加载 `souce/css/**/*.css` 忽略以 `_` 开头的文件 | `''`
`mip.cssmin` | 是否开启样式压缩 | `true`
`mip.canonical` | 替换 canonical 地址 | `''`

### 处理 css

> [MIP style 标签文档](https://www.mipengine.org/doc/2-tech/1-mip-html.html)

如果配置了 `mip.css` 则直接加载配置的文件, 否则会加载主题目录下 `souce/css/**/*.css`, 最终打包成一个 `<style mip-custom>` 标签, 忽略以 `_` 开头的文件. 可以按顺序加载指定文件, 如:

``` yaml
mip:
  css:
    reset.css
    main.css
```

在主题模板内 `<head>` 标签结束前使用 `mipcss()` 引入.

### 处理 a 标签

> [MIP a 标签文档](https://www.mipengine.org/examples/mip-extensions/mip-link.html)

统一替换页面中的 `<a>` 标签, 如果是当前网站的, 则添加 `data-type="mip"`.

### 处理 img 链接

> [MIP img 标签文档](https://www.mipengine.org/examples/mip/mip-img.html)

根据 MIP 规范, 图片必须设置 `width` 和 `height` , 统一替换页面中的 `<img>` 标签为 `<mip-img>` .

### 处理 canonical

> [MIP canonical 规范文档](https://www.mipengine.org/doc/2-tech/5-show-your-page.html) , 思路来自 [@HyunSeob/hexo-auto-canonical](https://github.com/HyunSeob/hexo-auto-canonical)

在主题模板内 `<head>` 标签结束前使用 `mipcanonical()` 引入. 如果需要自定义 canonical 的域名或者路径前缀 , 可以配置:

``` yaml
# 自定义域名
mip:
  canonical: 'https://mip.example.com'

# 自定义路径
mip:
  canonical: 'https://example.com/mip'
```

## contributors

- [@yugasun](https://github.com/yugasun/)
- [@xuexb](https://github.com/xuexb/)

## License

[MIT](./LICENSE)
