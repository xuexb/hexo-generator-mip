/**
 * @file check style
 * @author xuexb <fe.xiaowu@gmail.com>
 */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var extend = require('extend');
var exec = require('../lib/style');
var expect = chai.expect;

chai.use(sinonChai);

describe('style.js', function () {
    var filter;
    var helper;
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
        hexo.extend.filter.register = function () {};
        hexo.extend.helper.register = function () {};

        extend(hexo, data);

        filter = sinon.spy(hexo.extend.filter, 'register');
        helper = sinon.spy(hexo.extend.helper, 'register');
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

        expect(head).to.equal(head);
    });
});
