# hexo-generator-mip

统一处理 Hexo 模板中的 MIP 标签

> 注意: [hexo-generator-mip](https://github.com/xuexb/hexo-generator-mip) 模块会处理 MIP 规范的标签, 如抽离 `<style>`、处理 `<a>` 标签、处理 `<img>` 标签, 如果不使用 Hexo MIP 相关模板, 请不要安装该模块

## 使用

安装

``` bash
npm install --save hexo-generator-mip
```

## 配置

``` yaml
# _config.yml
mip:
    # 是否开启 css 压缩, 默认为 false
    cssmin: false

    # 指定加载的文件, 以 `souce/css/` 为基础路径, 不配置则加载 `source/css` 下所有样式, 忽略以 `_` 开头的文件.
    css:
        - reset.css
        - demo.css
```

### 处理 css

如果配置了 `mip.css` 则直接加载配置的文件, 否则会加载主题目录下 `souce/css/**/*.css`, 最终打包成一个 `<style mip-custom>` 标签, 忽略以 `_` 开头的文件.

在主题模板内 `<head>` 标签结束前使用 `mipcss()` 引入.

[MIP style 标签文档](https://www.mipengine.org/doc/2-tech/1-mip-html.html)

### 处理 a 标签

统一替换页面中的 `<a>` 标签, 如果是当前网站的, 则添加 `data-type="mip"`. 

[MIP a 标签文档](https://www.mipengine.org/examples/mip-extensions/mip-link.html)

### 处理 img 链接

根据 MIP 规范, 图片必须设置 `width` 和 `height` , 统一替换页面中的 `<img>` 标签为 `<mip-img>` .

[MIP img 标签文档](https://www.mipengine.org/examples/mip/mip-img.html)

### 处理 canonical

在主题模板内 `<head>` 标签结束前使用 `mipcanonical()` 引入.

感谢 [@HyunSeob/hexo-auto-canonical](https://github.com/HyunSeob/hexo-auto-canonical)

## License

[MIT](./LICENSE)
