/**
 * @file check img
 * @author xuexb <fe.xiaowu@gmail.com>
 */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var extend = require('extend');
var exec = require('../lib/img');
var expect = chai.expect;

chai.use(sinonChai);

describe('img.js', function () {
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

    it('replace img', function () {
        register();

        var result = callback([
            '<img>',
            '<img/>',
            '<IMG src="1"   / >',
            '<IMG src=1   / >',
            '<div>',
                '<img',
                    ' width="1"',
                    ' height="1"',
                    ' src="https://xuexb.com/1.png"',
                '>',
                '<IMG',
                    ' width="1"',
                    ' height="1"',
                    ' src="https://xuexb.com"',
                '>',
                '<img src="https://xuexb.com/2.png">',
                '<img src="https://xuexb.com/3.png"/>',
                '<img src="https://xuexb.com/4.png" />',
                '<img src="https://xuexb.com/5.png" / >',
            '</div>'
        ].join('\n'));

        expect(result).to.equal([
            '<mip-img></mip-img>',
            '<mip-img></mip-img>',
            '<mip-img src="1"></mip-img>',
            '<mip-img src=1></mip-img>',
            '<div>',
                '<mip-img',
                    ' width="1"',
                    ' height="1"',
                    ' src="https://xuexb.com/1.png"></mip-img>',
                '<mip-img',
                    ' width="1"',
                    ' height="1"',
                    ' src="https://xuexb.com"></mip-img>',
                '<mip-img src="https://xuexb.com/2.png"></mip-img>',
                '<mip-img src="https://xuexb.com/3.png"></mip-img>',
                '<mip-img src="https://xuexb.com/4.png"></mip-img>',
                '<mip-img src="https://xuexb.com/5.png"></mip-img>',
            '</div>'
        ].join('\n'));
    });
});
