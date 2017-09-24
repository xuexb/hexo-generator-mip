/**
 * @file 处理 Hexo 模板中的 style
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

var path = require('path');
var fs = require('fs');
var extend = require('extend');
var glob = require('glob');
var CleanCSS = require('clean-css');

var content = '';

module.exports = function (hexo) {
    hexo.extend.filter.register('before_generate', function () {
        content = '';
    });

    hexo.extend.filter.register('after_generate', function () {
        var config = extend({
            css: null,
            cssmin: false
        }, hexo.theme.config.mip, hexo.config.mip);
        var cwd = path.resolve(hexo.theme_dir, './source/css');
        var data = config.css;

        if ('string' === typeof data) {
            data = String(config.css || '').split(/\s+/);
        }

        if (!data || !data.length) {
            data = glob.sync('**/!(_*).css', {
                cwd: cwd
            });
        }

        content = data.map(function (uri) {
            return path.resolve(cwd, uri);
        }).map(function (filepath) {
            return fs.readFileSync(filepath).toString();
        }).join('');

        if (config.cssmin) {
            content = new CleanCSS().minify(content).styles;
        }

    });

    hexo.extend.helper.register('mipcss', function () {
        if (!content) {
            return '';
        }

        return '<style mip-custom>' + content + '</style>';
    });
};
