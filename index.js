/**
 * @file hexo-generator-mip
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

/* global hexo */

require('./lib/style.js')(hexo);
require('./lib/fix-a-href.js')(hexo);
require('./lib/a.js')(hexo);
require('./lib/img.js')(hexo);
require('./lib/canonical.js')(hexo);
