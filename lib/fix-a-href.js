/**
 * @file 修复 Hexo 模板中的 a 标签没有 href 属性
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

module.exports = function (hexo) {
    hexo.extend.filter.register('after_render:html', function (html) {
        return html.replace(/<a\s+([^>]+)>/ig, function (link, attr) {
            if (link.indexOf('href=') > 0) {
                return link;
            }

            return '<a href="#" ${attr}>'.replace('${attr}', attr.trim());
        });
    }, 6);
};
