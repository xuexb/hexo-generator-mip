/**
 * @file check fix-a-href
 * @author xuexb <fe.xiaowu@gmail.com>
 */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var extend = require('extend');
var exec = require('../lib/fix-a-href');
var expect = chai.expect;

chai.use(sinonChai);

describe('fix-a-href.js', function () {
    var spy;
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
        hexo.extend.filter.register = function () {};

        extend(hexo, data);

        spy = sinon.spy(hexo.extend.filter, 'register');
        exec(hexo, config || {});
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

    it('append href', function () {
        register();

        var result = callback([
            '<html mip>',
            '<a href="#">1</a>',
            '<A>1</A>',
            '<a',
            '<div>',
                '<a>2</a>',
                '<a  href="#">2</a>',
                '<a id="id">2</a>',
                '<a id="id"  href="#">2</a>',
                '<a    class="class" name="test">2</a>',
                '<a  href="#"  class="class" name="test">2</a>',
                '<aid="test"></a>',
                '<a   href="test"></a>',
            '</div>'
        ].join(''));

        expect(result).to.equal([
            '<html mip>',
            '<a href="#">1</a>',
            '<A href="#">1</A>',
            '<a',
            '<div>',
                '<a href="#">2</a>',
                '<a  href="#">2</a>',
                '<a href="#" id="id">2</a>',
                '<a id="id"  href="#">2</a>',
                '<a href="#"    class="class" name="test">2</a>',
                '<a  href="#"  class="class" name="test">2</a>',
                '<aid="test"></a>',
                '<a   href="test"></a>',
            '</div>'
        ].join(''));
    });

    describe('isMip', function () {
        it('true', function () {
            var head = [
                '<html mip>',
                '<a>2</a>'
            ].join('');

            expect(callback(head)).to.equal([
                '<html mip>',
                '<a href="#">2</a>'
            ].join(''));
        });

        it('false', function () {
            var head = [
                '<html>',
                '<a>2</a>'
            ].join('');

            expect(callback(head)).to.equal(head);
        });
    });
});
