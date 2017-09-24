/**
 * @file 获取配置
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

var extend = require('extend');

/**
 * 默认配置
 *
 * @type {Object}
 */
var defaults = {
    css: null,
    cssmin: true
};

module.exports = function (hexo) {
    return extend({}, defaults, hexo.theme.config.mip, hexo.config.mip);
};
