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
    var mockBase = path.resolve(__dirname, 'mock');
    var styleFilePath = path.resolve(mockBase, 'source/css');
    var HTML_TEMPLATE = [
        '<!doctype html>',
        '<html mip>',
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

    beforeEach(function () {
        mkdirp.sync(styleFilePath);
    });

    afterEach(function () {
        del.sync(mockBase);
    });

    describe('mipcss()', function () {
        var callback;
        var helper;

        /**
         * 注册 helper
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

            helper = sinon.spy(hexo.extend.helper, 'register');
            exec(hexo, config || {});
            callback = helper.getCall(0).args[1];
        };

        beforeEach(function () {
            register();
        });

        it('register helper', function () {
            expect(helper).to.have.been.calledOnce;
            expect(helper).to.have.been.calledWith('mipcss');
        });

        it('callback function', function () {
            expect(callback).to.be.a('function');
        });

        it('not files', function () {
            expect(callback()).to.equal('');
            expect(callback('', '')).to.equal('');
        });

        it('one file', function () {
            mock('body {height: 0;}', 'one.css');

            register({
                theme_dir: mockBase
            });

            expect(callback('one.css')).to.equal('<style mip-custom>body {height: 0;}</style>');
        });

        it('more file', function () {
            mock('1', '1.css');
            mock('', '2.css');
            mock('3', '3.css');

            register({
                theme_dir: mockBase
            });

            expect(callback('1.css', '2.css', '3.css')).to.equal('<style mip-custom>13</style>');
        });

        it('empty file', function () {
            mock('', 'empty.css');

            register({
                theme_dir: mockBase
            });

            expect(callback('empty.css')).to.equal('');
        });

        describe('there are `mip.cssmin` in the configuration file', function () {
            it('`mip.cssmin` is a true', function () {
                mock('body {width:0px;} ', '1.css');

                register({
                    theme_dir: mockBase
                }, {
                    cssmin: true
                });

                expect(callback('1.css')).to.have.string('<style mip-custom>').and.have.string('body{width:0}');
            });

            it('`mip.cssmin` is a false', function () {
                mock('body {width:0px;} ', '1.css');

                register({
                    theme_dir: mockBase
                }, {
                    cssmin: false
                });

                expect(callback('1.css')).to.have.string('<style mip-custom>').and.have.string('body {width:0px;} ');
            });
        });
    });

    describe('auto append `<style mip-custom>`', function () {
        var filter;
        var callback;

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
            hexo.extend.helper.register = function () {};
            hexo.extend.filter.register = function () {};

            extend(hexo, data);

            filter = sinon.spy(hexo.extend.filter, 'register');
            exec(hexo, config || {});
            callback = filter.getCall(0).args[1];
        };

        beforeEach(function () {
            register();
        });

        it('register filter', function () {
            expect(filter).to.have.been.calledOnce;
            expect(filter).to.have.been.calledWith('after_render:html');
        });

        it('callback function', function () {
            expect(callback).to.be.a('function');
        });

        it('<head> has <style mip-custom>', function () {
            var head = [
                '<html mip>',
                '<head>',
                '<style mip-custom>body {}</style>',
                '</head>'
            ].join('');

            expect(callback(head)).to.equal(head);
        });

        describe('isMip', function () {
            it('true', function () {
                mock('body {height: 0;}');

                register({
                    theme_dir: mockBase
                });

                var head = [
                    '<html mip>',
                    '<head>',
                    '</head>'
                ].join('');

                expect(callback(head)).to.equal([
                    '<html mip>',
                    '<head>',
                    '<style mip-custom>body {height: 0;}</style>',
                    '</head>'
                ].join(''));
            });

            it('false', function () {
                mock('body {height: 0;}');

                register({
                    theme_dir: mockBase
                });

                var head = [
                    '<html>',
                    '<head>',
                    '</head>'
                ].join('');

                expect(callback(head)).to.equal([
                    '<html>',
                    '<head>',
                    '</head>'
                ].join(''));
            });
        });

        it('<body> has <style mip-custom>', function () {
            mock('body {height: 0;}');

            register({
                theme_dir: mockBase
            });

            var head = [
                '<html mip>',
                '<head>',
                '</head>',
                '<body>',
                '<style mip-custom>body {}</style>',
                '</body>'
            ].join('');

            expect(callback(head)).to.equal([
                '<html mip>',
                '<head>',
                '<style mip-custom>body {height: 0;}body {}</style>',
                '</head>',
                '<body>',
                '</body>'
            ].join(''));
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
            it('inserted before `<noscript>`', function () {
                mock('body {width:0px;} ');

                register({
                    theme_dir: mockBase
                });

                var result = callback([
                    '<!doctype html>',
                    '<html mip>',
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
                    '<html mip>',
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

        describe('multiple `<style>` tag', function () {
            it('<head> not has <style mip-custom>', function () {
                register({
                    theme_dir: mockBase
                });

                var head = [
                    '<html mip>',
                    '<head>',
                    '</head>',
                    '<body>',
                        '<style>.demo {}</style>',
                        '<style>.demo2 {}</style>',
                    '</body>'
                ].join('');

                expect(callback(head)).to.equal([
                    '<html mip>',
                    '<head>',
                        '<style mip-custom>.demo {}.demo2 {}</style>',
                    '</head>',
                    '<body>',
                    '</body>'
                ].join(''));
            });

            it('<head> has <style mip-custom>', function () {
                register({
                    theme_dir: mockBase
                });

                var head = [
                    '<html mip>',
                    '<head>',
                        '<style mip-custom>body {}</style>',
                    '</head>',
                    '<body>',
                        '<style>.demo {}</style>',
                        '<style>.demo2 {}</style>',
                    '</body>'
                ].join('');

                expect(callback(head)).to.equal([
                    '<html mip>',
                    '<head>',
                        '<style mip-custom>body {}.demo {}.demo2 {}</style>',
                    '</head>',
                    '<body>',
                    '</body>'
                ].join(''));
            });

            it('<head> has <style mip-officialrelease>', function () {
                register({
                    theme_dir: mockBase
                });

                var head = [
                    '<html mip>',
                    '<head>',
                        '<style mip-officialrelease>body {}</style>',
                    '</head>',
                    '<body>',
                        '<style>.demo {}</style>',
                        '<style>.demo2 {}</style>',
                    '</body>'
                ].join('');

                expect(callback(head)).to.equal([
                    '<html mip>',
                    '<head>',
                        '<style mip-officialrelease>body {}</style>',
                        '<style mip-custom>.demo {}.demo2 {}</style>',
                    '</head>',
                    '<body>',
                    '</body>'
                ].join(''));
            });
        });
    });

});

/* eslint-enable fecs-camelcase */
