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

/**
 * 处理样式标签合并
 *
 * @param {Object} data 配置参数
 * @param {string|undefined} data.source 头部追加的样式代码
 * @param {boolean} data.cssmin 是否压缩样式
 * @return {string}
 */
var mergeStyles = function (data) {
    var styles = '';
    var html = data.html;

    html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, function (matched, attr, content) {
        // 如果是 <style mip-officialrelease> 则不处理
        if (String(attr).indexOf('mip-officialrelease') > -1) {
            return matched;
        }
        styles += content;
        return '';
    });

    // 追加源数据
    if (data.source) {
        styles = data.source + styles;
    }

    // 压缩代码
    if (data.cssmin) {
        styles = new CleanCSS().minify(styles).styles;
    }

    if (!styles) {
        return html;
    }

    styles = '<style mip-custom>' + styles + '</style>';

    if (/<noscript>([\s\S]+?)<\/noscript>([\s\S]*?)<\/head>/.test(html)) {
        html = html.replace('<noscript>', styles + '<noscript>');
    }
    else {
        html = html.replace('</head>', styles + '</head>');
    }

    return html;
};

module.exports = function (hexo, config) {
    hexo.extend.filter.register('after_render:html', function (html) {
        if (!isMip(html)) {
            return html;
        }

        // 如果 <head> 标签内存在 <style> 则忽略
        if (/<head>(?:[\s\S]*?)<style\s+mip-custom[^>]*>(?:[\s\S]*?)<\/style>(?:[\s\S]*?)<\/head>/.test(html)) {
            return mergeStyles({
                html: html,
                cssmin: config.cssmin
            });
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

        return mergeStyles({
            html: html,
            source: content,
            cssmin: config.cssmin
        });
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
