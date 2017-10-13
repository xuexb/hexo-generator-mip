/**
 * @file check canonical
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* eslint-disable fecs-camelcase */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var exec = require('../lib/canonical');
var extend = require('extend');
var expect = chai.expect;

chai.use(sinonChai);

describe('canonical.js', function () {
    var spy;
    var callback;

    /**
     * 注册 helper
     *
     * @param  {Ojbect | undefined} data 注入数据
     * @param {Object | undefined} config 注入配置数据
     */
    var register = function (data, config) {
        var hexo = {};
        hexo.extend = {};
        hexo.extend.helper = {};
        hexo.extend.helper.register = function () {};

        extend(hexo, data);

        spy = sinon.spy(hexo.extend.helper, 'register');
        exec(hexo, config || {});
        callback = spy.getCall(0).args[1];
    };

    it('register helper', function () {
        register();

        expect(spy).to.have.been.calledOnce;
        expect(spy).to.have.been.calledWith('mipcanonical');
    });

    it('callback function', function () {
        register();
        expect(callback).to.be.a('function');
    });

    it('replace default index.html', function () {
        register({}, {
            canonical: 'https://xuexb.com'
        });

        expect(callback({
            canonical_path: 'index.html'
        })).to.equal('<link rel="canonical" href="https://xuexb.com/"/>');
    });

    describe('mip.config.canonical', function () {
        it('url', function () {
            register({}, {
                canonical: 'https://xuexb.com'
            });

            expect(callback({
                canonical_path: 'list.html'
            })).to.equal('<link rel="canonical" href="https://xuexb.com/list.html"/>');
        });

        it('url and has last /', function () {
            register({}, {
                canonical: 'https://xuexb.com/'
            });

            expect(callback({
                canonical_path: 'list.html'
            })).to.equal('<link rel="canonical" href="https://xuexb.com/list.html"/>');
        });

        it('path', function () {
            register({}, {
                canonical: 'https://xuexb.com/mip'
            });

            expect(callback({
                canonical_path: 'list.html'
            })).to.equal('<link rel="canonical" href="https://xuexb.com/mip/list.html"/>');
        });
    });

    describe('hexo.config.url', function () {
        it('url', function () {
            register({
                config: {
                    url: 'https://xuexb.com'
                }
            });

            expect(callback({
                canonical_path: 'list.html'
            })).to.equal('<link rel="canonical" href="https://xuexb.com/list.html"/>');
        });

        it('url and has last /', function () {
            register({
                config: {
                    url: 'https://xuexb.com/'
                }
            });

            expect(callback({
                canonical_path: 'list.html'
            })).to.equal('<link rel="canonical" href="https://xuexb.com/list.html"/>');
        });

        it('path', function () {
            register({
                config: {
                    url: 'https://xuexb.com/mip'
                }
            });

            expect(callback({
                canonical_path: 'list.html'
            })).to.equal('<link rel="canonical" href="https://xuexb.com/mip/list.html"/>');
        });
    });
});
/* eslint-enable fecs-camelcase */
