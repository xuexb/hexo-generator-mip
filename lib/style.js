/**
 * @file 处理 Hexo 模板中的 style
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

var path = require('path');
var fs = require('fs');
var glob = require('glob');
var CleanCSS = require('clean-css');
var getConfig = require('./config');

var content = '';

module.exports = function (hexo) {
    hexo.extend.filter.register('before_generate', function () {
        content = '';
    });

    hexo.extend.filter.register('after_generate', function () {
        var config = getConfig(hexo);
        var cwd = path.resolve(hexo.theme_dir, './source/css');
        var files = config.css;

        if ('string' === typeof files) {
            files = String(config.css || '').split(/\s+/);
        }

        if (!files || !files.length) {
            files = glob.sync('**/!(_*).css', {
                cwd: cwd
            });
        }

        content = files.map(function (uri) {
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
