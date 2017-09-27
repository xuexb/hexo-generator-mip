/**
 * @file 处理 Hexo 模板中的 style
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

var path = require('path');
var fs = require('fs');
var glob = require('glob');
var CleanCSS = require('clean-css');

module.exports = function (hexo, config) {
    hexo.extend.filter.register('after_render:html', function (html) {
        if (html.indexOf('<style mip-custom>') > 0) {
            return html;
        }

        var cwd = path.resolve(hexo.theme_dir, './source/css');
        var files = config.css;
        var content = '';

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

        if (content) {
            content = '<style mip-custom>' + content + '</style>';
        }

        return html.replace('</head>', content + '</head>');
    }, 8);

    // 提示升级
    hexo.extend.helper.register('mipcss', function () {
        console.log([
            '`mipcss` method in v0.3.1 has been abandoned, ',
            'will be automatically injected into </head> before, please delete!'
        ].join(''));

        return '';
    });
};
