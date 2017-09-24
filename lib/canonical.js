/**
 * @file 处理 Hexo 模板中的 canonical 标签
 * @author xuexb <fe.xiaowu@gmail.com>
 * @link https://github.com/HyunSeob/hexo-auto-canonical/blob/master/index.js
 */

'use strict';

module.exports = function (hexo) {
    hexo.extend.helper.register('mipcanonical', function (page) {
        var config = hexo.config;
        var baseUrl = config.url;

        if (config.url.charAt(config.url.length - 1) !== '/') {
            baseUrl += '/';
        }

        return '<link rel="canonical" href="' + baseUrl + page.canonical_path.replace('index.html', '') + '"/>';
    });
};
