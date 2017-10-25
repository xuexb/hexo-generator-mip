/**
 * @file 处理 Hexo 模板中的 style
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

var path = require('path');
var fs = require('fs');
var glob = require('glob');
var CleanCSS = require('clean-css');
var isMip = require('./isMip');

module.exports = function (hexo, config) {
    hexo.extend.filter.register('after_render:html', function (html) {
        if (!isMip(html)) {
            return html;
        }

        // 如果 <head> 标签内存在 <style> 则忽略
        if (/<head>(?:[\s\S]*?)<style\s+mip-custom[^>]*>(?:[\s\S]*?)<\/style>(?:[\s\S]*?)<\/head>/.test(html)) {
            return html;
        }

        var cwd = path.resolve(hexo.theme_dir, './source/css');
        var files = config.css;
        var content = '';

        // 处理为字符时，在 yml 里没有使用 `-` 则为字符串
        if ('string' === typeof files) {
            files = String(files || '').split(/\s+/).filter(function (filename) {
                return !!filename;
            });
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

        if (!content) {
            return html;
        }

        if (config.cssmin) {
            content = new CleanCSS().minify(content).styles;
        }

        content = '<style mip-custom>' + content + '</style>';

        if (/<noscript>([\s\S]+?)<\/noscript>([\s\S]*?)<\/head>/.test(html)) {
            html = html.replace('<noscript>', content + '<noscript>');
        }
        else {
            html = html.replace('</head>', content + '</head>');
        }

        return html;
    }, 8);

    // 主动加载
    hexo.extend.helper.register('mipcss', function () {
        var files = [].slice.call(arguments).filter(function (filename) {
            return !!filename;
        });

        if (!files.length) {
            return '';
        }

        var cwd = path.resolve(hexo.theme_dir, './source/css');
        var content = files.map(function (uri) {
            return path.resolve(cwd, uri);
        }).map(function (filepath) {
            return fs.readFileSync(filepath).toString();
        }).join('');

        if (!content) {
            return '';
        }

        if (config.cssmin) {
            content = new CleanCSS().minify(content).styles;
        }

        return '<style mip-custom>' + content + '</style>';
    });
};
