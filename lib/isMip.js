/**
 * @file 处理 Hexo 模板中的 img 标签
 * @author xuexb <fe.xiaowu@gmail.com>
 */

'use strict';

module.exports = function (content) {
    return /<html\s+([\s\S]*?)mip[\s\S]*?>/i.test(content);
};
