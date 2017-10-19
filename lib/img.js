/**
 * @file 处理 Hexo 模板中的 img 标签
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

module.exports = function (hexo) {
    hexo.extend.filter.register('after_render:html', function (html) {
        return html.replace(/<img(>|([^>]+)>)/ig, function (match, tag) {
            // 去除 />
            tag = tag.replace(/\s*\/?\s*>$/, '');

            return '<mip-img{tag}></mip-img>'.replace('{tag}', tag);
        });
    });
};
