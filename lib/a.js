/**
 * @file 处理 Hexo 模板中的 a 标签
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

var isMip = require('./isMip');

module.exports = function (hexo) {
    hexo.extend.filter.register('after_render:html', function (html) {
        if (!hexo.config.url || !isMip(html)) {
            return html;
        }

        return html.replace(/<a\s+([^>]+)>/ig, function (link) {
            if (link.indexOf('data-type') > 0) {
                return link;
            }
            link = link.replace(/href=['"]?(.+?)['"]?(\s|>)/, function (match, href) {
                if (href.substr(0, 1) === '/' && href.substr(0, 2) !== '//') {
                    href = hexo.config.url + href;
                }

                if (!/\.xml$/.test(href) && href.indexOf(hexo.config.url) === 0) {
                    match = 'data-type="mip" ' + match;
                }

                return match;
            });

            return link;
        });
    });
};
