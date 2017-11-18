/**
 * @file check a
 * @author xuexb <fe.xiaowu@gmail.com>
 */

var chai = require('chai');
var isMip = require('../lib/isMip');
var expect = chai.expect;

describe('isMip.js', function () {
    var map = {
        '<html mip>': true,
        '<html>': false,
        '<htmlmip>': false,
        '<html mip="mip">': true,
        '<html mip="">': true,
        '<html mip=>': true,
        '<html lang="zh-cn" mip>': true,
        '<html    lang="zh-cn"mip>': true,
        '<html    lang="zh-cn"\n mip>': true,
        '<!DOCTYPE html><HTML MIP     ><head>': true,
        '<!DOCTYPE html><HTML mip     ><head>': true,
        '<!DOCTYPE html><html mip     ><head>': true
    };

    Object.keys(map).forEach(function (text) {
        it(text, function () {
            expect(isMip(text)).to.equal(map[text]);
        });
    });
});
