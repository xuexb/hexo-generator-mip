/**
 * @file hexo-generator-mip
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

/* global hexo */

var getConfig = require('./lib/config');
var config = getConfig(hexo);

if (config.enable) {
    require('./lib/style.js')(hexo, config);
    require('./lib/fix-a-href.js')(hexo, config);
    require('./lib/a.js')(hexo, config);
    require('./lib/img.js')(hexo, config);
    require('./lib/canonical.js')(hexo, config);
}
