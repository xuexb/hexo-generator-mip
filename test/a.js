/**
 * @file check a
 * @author xuexb <fe.xiaowu@gmail.com>
 */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var exec = require('../lib/a');
var extend = require('extend');
var expect = chai.expect;

chai.use(sinonChai);

describe('a.js', function () {
    var spy;
    var callback;

    /**
     * 注册 filter
     *
     * @param  {Ojbect | undefined} data 注入数据
     */
    var register = function (data) {
        var hexo = {};
        hexo.extend = {};
        hexo.extend.filter = {};
        hexo.extend.filter.register = function () {};

        extend(hexo, data);

        spy = sinon.spy(hexo.extend.filter, 'register');
        exec(hexo);
        callback = spy.getCall(0).args[1];
    };

    it('register filter', function () {
        register();

        expect(spy).to.have.been.calledOnce;
        expect(spy).to.have.been.calledWith('after_render:html');
    });

    it('callback function', function () {
        register();
        expect(callback).to.be.a('function');
    });

    it('hexo.config.url is null', function () {
        register({
            config: {
                url: null
            }
        });
        expect(callback(true)).to.be.true;

        register({
            config: {
                url: ''
            }
        });
        expect(callback(true)).to.be.true;
    });

    describe('replace a tag', function () {
        it('not find href', function () {
            var str = [
                '<div>',
                    '<a class="test"></a>',
                '</div>',
                '<div>',
                    '<a class="test" href=></a>',
                '</div>',
                '<div>',
                    '<a class="test" href=\'\'></a>',
                '</div>',
                '<div>',
                    '<a class="test" href=""></a>',
                '</div>'
            ].join('');

            register({
                config: {
                    url: 'https://xuexb.com'
                }
            });
            expect(callback(str)).to.equal(str);
        });

        it('not match base url', function () {
            var str = [
                '<div>',
                    '<a href="https://www.xuexb.com" class="test"></a>',
                '</div>',
                '<div>',
                    '<a class="test" href=https://www.xuexb.com></a>',
                '</div>',
                '<div>',
                    '<a class="test" href=\'href=https://www.xuexb.com\'></a>',
                '</div>'
            ].join('');

            register({
                config: {
                    url: 'https://xuexb.com'
                }
            });
            expect(callback(str)).to.equal(str);
        });

        it('a has data-type', function () {
            var str = [
                '<div>',
                    '<a href="https://xuexb.com" data-type="mip" class="test"></a>',
                '</div>',
                '<div>',
                    '<a class="test" data-type href=https://xuexb.com></a>',
                '</div>',
                '<div>',
                    '<a class="test" data-type="xuexb" href=\'href=https://xuexb.com\'></a>',
                '</div>'
            ].join('');

            register({
                config: {
                    url: 'https://xuexb.com'
                }
            });
            expect(callback(str)).to.equal(str);
        });

        it('replace success', function () {
            var str = [
                '<div>',
                    '<a href="https://xuexb.com" class="test"></a>',
                '</div>',
                '<div>',
                    '<a class="test" href="https://xuexb.com/index.html"></a>',
                '</div>'
            ].join('');

            register({
                config: {
                    url: 'https://xuexb.com'
                }
            });
            expect(callback(str)).to.equal([
                '<div>',
                    '<a data-type="mip" href="https://xuexb.com" class="test"></a>',
                '</div>',
                '<div>',
                    '<a class="test" data-type="mip" href="https://xuexb.com/index.html"></a>',
                '</div>'
            ].join(''));
        });

        it('relative url', function () {
            var str = [
                '<div>',
                    '<a href="/index.html"></a>',
                '</div>',
                '<div>',
                    '<a href="../index.html"></a>',
                '</div>',
                '<div>',
                    '<a href="//xuexb.com"></a>',
                '</div>'
            ].join('');

            register({
                config: {
                    url: 'https://xuexb.com'
                }
            });
            expect(callback(str)).to.equal([
                '<div>',
                    '<a data-type="mip" href="/index.html"></a>',
                '</div>',
                '<div>',
                    '<a href="../index.html"></a>',
                '</div>',
                '<div>',
                    '<a href="//xuexb.com"></a>',
                '</div>'
            ].join(''));
        });

        it('xml url', function () {
            var str = [
                '<div>',
                    '<a href="https://xuexb.com/a.xml"></a>',
                '</div>',
                '<div>',
                    '<a href="https://xuexb.com/a.html"></a>',
                '</div>'
            ].join('');

            register({
                config: {
                    url: 'https://xuexb.com'
                }
            });
            expect(callback(str)).to.equal([
                '<div>',
                    '<a href="https://xuexb.com/a.xml"></a>',
                '</div>',
                '<div>',
                    '<a data-type="mip" href="https://xuexb.com/a.html"></a>',
                '</div>'
            ].join(''));
        });
    });
});
