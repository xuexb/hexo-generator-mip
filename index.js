/**
 * @file hexo-generator-mip
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

/* global hexo */

var getConfig = require('./lib/config');
var config = getConfig(hexo);

if (config.enable) {
    require('./lib/style.js')(hexo);
    require('./lib/fix-a-href.js')(hexo);
    require('./lib/a.js')(hexo);
    require('./lib/img.js')(hexo);
    require('./lib/canonical.js')(hexo);
}
