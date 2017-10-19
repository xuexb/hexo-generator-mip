/**
 * @file 修复 Hexo 模板中的 a 标签没有 href 属性
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

module.exports = function (hexo) {
    hexo.extend.filter.register('after_render:html', function (html) {
        return html.replace(/<a((\s*>)|(\s+([^>]+)>))/gi, function (link, attr) {
            if (attr.indexOf('href=') > 0) {
                return link;
            }

            var tagName = link.indexOf('<a') === 0 ? 'a' : 'A';

            return '<${tagName} href="#"${attr}'
                .replace('${tagName}', tagName)
                .replace('${attr}', attr);
        });
    }, 6);
};
