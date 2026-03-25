const path = require('path');

// 项目根目录
const ROOT_DIR = path.resolve(__dirname, '../../');

// 需要添加 ~ 前缀的 alias 列表（适配 Vue2 的 less 引入方式）
const ALIAS_LIST = [
  '@tdesign/uniapp',
  '@tdesign/uniapp-chat',
];

// 支持的文件扩展名（仅处理样式相关文件）
const SUPPORTED_EXTENSIONS = ['.less', '.css', '.scss', '.vue'];

// 需要扫描的目录（相对于项目根目录）
const SCAN_DIRS = ['style', 'pages', 'pages-more', 'components', 'mixins', 'uni_modules/tdesign-uniapp-chat/components'];

// 需要扫描的根目录文件
const SCAN_ROOT_FILES = ['App.vue'];

module.exports = {
  ROOT_DIR,
  ALIAS_LIST,
  SUPPORTED_EXTENSIONS,
  SCAN_DIRS,
  SCAN_ROOT_FILES,
};
