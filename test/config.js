/**
 * @file check config
 * @author xuexb <fe.xiaowu@gmail.com>
 */

var chai = require('chai');
var config = require('../config');
var expect = chai.expect;

describe('config.js', function () {
    it('.css', function () {
        expect(config.css).to.be.null;
    });

    it('.cssmin', function () {
        expect(config.cssmin).to.be.true;
    });

    it('.canonical', function () {
        expect(config.canonical).to.be.a('string').and.empty;
    });

    it('.enable', function () {
        expect(config.enable).to.be.false;
    });
});
