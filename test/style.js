/**
 * @file check style
 * @author xuexb <fe.xiaowu@gmail.com>
 */

var fs = require('fs');
var path = require('path');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var extend = require('extend');
var del = require('del');
var mkdirp = require('mkdirp');
var exec = require('../lib/style');
var expect = chai.expect;

chai.use(sinonChai);

/* eslint-disable fecs-camelcase */

describe('style.js', function () {
    var filter;
    var helper;
    var callback;
    var mockBase = path.resolve(__dirname, 'mock');
    var styleFilePath = path.resolve(mockBase, 'source/css');
    var HTML_TEMPLATE = [
        '<!doctype html>',
        '<html>',
            '<head>',
                '<title>test</title>',
            '</head>',
            '<body>',
                '<h1>test</h1>',
            '</body>',
        '</html>'
    ].join('');

    /**
     * 写入测试数据
     *
     * @param  {string} content  内容
     * @param  {string | undefined} filename 文件名
     */
    var mock = function (content, filename) {
        filename = path.resolve(styleFilePath, filename || Date.now() + Math.round(Math.random() * 1000) + '.css');
        fs.writeFileSync(filename, content);
    };

    /**
     * 注册 filter
     *
     * @param  {Ojbect | undefined} data 注入数据
     * @param {Object | undefined} config 注入配置数据
     */
    var register = function (data, config) {
        var hexo = {};
        hexo.extend = {};
        hexo.extend.filter = {};
        hexo.extend.helper = {};
        hexo.extend.filter.register = function () {};
        hexo.extend.helper.register = function () {};

        extend(hexo, data);

        filter = sinon.spy(hexo.extend.filter, 'register');
        helper = sinon.spy(hexo.extend.helper, 'register');
        exec(hexo, config || {});
        callback = filter.getCall(0).args[1];
    };

    beforeEach(function () {
        mkdirp.sync(styleFilePath);
        register();
    });

    afterEach(function () {
        del.sync(mockBase);
    });

    it('register filter', function () {
        expect(filter).to.have.been.calledOnce;
        expect(filter).to.have.been.calledWith('after_render:html');
    });

    it('register helper', function () {
        expect(helper).to.have.been.calledOnce;
        expect(helper).to.have.been.calledWith('mipcss');
        expect(helper.getCall(0).args[1]).to.be.a('function');
        expect(helper.getCall(0).args[1]()).to.be.a('string').and.empty;
    });

    it('callback function', function () {
        expect(callback).to.be.a('function');
    });

    it('has <style mip-custom>', function () {
        var head = [
            '<head>',
                '<style mip-custom>body {}</style>',
            '</head>'
        ].join('');

        expect(callback(head)).to.equal(head);
    });

    describe('the default file is loaded under `config.theme_dir`', function () {
        it('css files should be loaded successfully', function () {
            mock('html {width: 0;}');
            mock('body {height: 0;}');

            register({
                theme_dir: mockBase
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.be.a('string');
            expect(result).to.have.string('<style mip-custom>');
            expect(result).to.have.string('html {width: 0;}');
            expect(result).to.have.string('body {height: 0;}');
        });

        it('empty css folders should not be processed', function () {
            register({
                theme_dir: mockBase
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.be.a('string').and.not.have.string('<style mip-custom>');
        });

        it('should ignore the _ at the beginning of the file', function () {
            mock('html {width: 0;}', '_html.css');
            mock('body {height: 0;}');

            register({
                theme_dir: mockBase
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.have.string('<style mip-custom>');
            expect(result).to.have.string('body {height: 0;}').and.not.have.string('html {width: 0;}');
        });
    });

    describe('there are `mip.css` in the configuration file', function () {
        it('`mip.css` is a string', function () {
            mock('html {width: 0;}', 'html.css');

            register({
                theme_dir: mockBase
            }, {
                css: 'html.css'
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.have.string('<style mip-custom>').and.have.string('html {width: 0;}');
        });

        it('`mip.css` is a empty string', function () {
            register({
                theme_dir: mockBase
            }, {
                css: ''
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.not.have.string('<style mip-custom>');
        });

        it('`mip.css` is a array', function () {
            mock('html {width: 0;}', 'html.css');

            register({
                theme_dir: mockBase
            }, {
                css: ['html.css']
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.have.string('<style mip-custom>').and.have.string('html {width: 0;}');
        });

        it('`mip.css` is a empty array', function () {
            register({
                theme_dir: mockBase
            }, {
                css: []
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.not.have.string('<style mip-custom>');
        });

        it('`mip.css` is a non-existent file', function () {
            register({
                theme_dir: mockBase
            }, {
                css: 'error.css'
            });

            expect(function () {
                callback(HTML_TEMPLATE);
            }).to.throw('error.css');
        });

        it('`mip.css` is a empty file', function () {
            mock('', 'html.css');

            register({
                theme_dir: mockBase
            }, {
                css: 'html.css'
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.not.have.string('<style mip-custom>');
        });
    });

    describe('there are `mip.cssmin` in the configuration file', function () {
        it('`mip.cssmin` is a true', function () {
            mock('body {width:0px;} ');

            register({
                theme_dir: mockBase
            }, {
                cssmin: true
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.have.string('<style mip-custom>').and.have.string('body{width:0}');
        });

        it('`mip.cssmin` is a false', function () {
            mock('body {width:0px;} ');

            register({
                theme_dir: mockBase
            }, {
                cssmin: false
            });

            var result = callback(HTML_TEMPLATE);

            expect(result).to.have.string('<style mip-custom>').and.have.string('body {width:0px;} ');
        });
    });

    describe('separate the `<noscript>` tag in `<head>`', function () {
        it('Inserted before `<noscript>`', function () {
            mock('body {width:0px;} ');

            register({
                theme_dir: mockBase
            });

            var result = callback([
                '<!doctype html>',
                '<html>',
                    '<head>',
                        '<title>test</title>',
                        '<noscript>test</noscript>',
                    '</head>',
                    '<body>',
                        '<h1>test</h1>',
                    '</body>',
                '</html>'
            ].join('\n'));

            expect(result).to.have.string('<style mip-custom>').and.have.string('</style><noscript>');
        });

        it('`<noscript>` in body', function () {
            mock('body {width:0px;} ');

            register({
                theme_dir: mockBase
            });

            var result = callback([
                '<!doctype html>',
                '<html>',
                    '<head>',
                        '<title>test</title>',
                    '</head>',
                    '<body>',
                        '<noscript>test</noscript>',
                        '<h1>test</h1>',
                    '</body>',
                '</html>'
            ].join('\n'));

            expect(result).to.have.string('<style mip-custom>').and.not.have.string('</style><noscript>');
        });
    });
});
/* eslint-enable fecs-camelcase */
