/**
 * @file 处理 Hexo 模板中的 img 标签
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

var isMip = require('./isMip');

module.exports = function (hexo) {
    hexo.extend.filter.register('after_render:html', function (html) {
        if (!isMip(html)) {
            return html;
        }

        return html.replace(/<img(>|([^>]+)>)/ig, function (match, tag) {
            // 去除 />
            tag = tag.replace(/\s*\/?\s*>$/, '');

            return '<mip-img{tag}></mip-img>'.replace('{tag}', tag);
        });
    });
};
