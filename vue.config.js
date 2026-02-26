const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// GitHub Pages 仓库名，如果是 用户名.github.io 则设置为 '/'
// 如果是 用户名.github.io/仓库名 则设置为 '/仓库名/'
const GITHUB_PAGES_PATH = process.env.GITHUB_PAGES_PATH || '/tdesign-uniapp-starter-vue2-hx/';

module.exports = {
  // 生产环境下设置 publicPath，用于 GitHub Pages 部署
  publicPath: process.env.NODE_ENV === 'production' ? GITHUB_PAGES_PATH : '/',
  transpileDependencies: ['tdesign-uniapp', 'tdesign-uniapp-chat'],
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@tdesign/uniapp', resolve('./uni_modules/tdesign-uniapp/components'))
      .set('@tdesign/uniapp-chat', resolve('./uni_modules/tdesign-uniapp-chat/components'));
  },
};
