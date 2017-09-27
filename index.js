/**
 * @file hexo-generator-mip
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

/* global hexo */

var extend = require('extend');
var defaults = require('./config');

hexo.extend.generator.register('mip', function (locals) {
    var config = extend({}, defaults, hexo.theme.config.mip, hexo.config.mip);
    if (config.enable) {
        require('./lib/style.js')(hexo, config);
        require('./lib/fix-a-href.js')(hexo, config);
        require('./lib/a.js')(hexo, config);
        require('./lib/img.js')(hexo, config);
        require('./lib/canonical.js')(hexo, config);
    }
});
