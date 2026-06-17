const path = require('path');
const {
  GenVersionWebPlugin,
  GenVersionMpPlugin,
} = require('@plugin-light/webpack-plugin-gen-version');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// GitHub Pages 仓库名，如果是 用户名.github.io 则设置为 '/'
// 如果是 用户名.github.io/仓库名 则设置为 '/仓库名/'
const GITHUB_PAGES_PATH = process.env.GITHUB_PAGES_PATH || '/tdesign-uniapp-starter-vue2-hx/';

const plugins = []

if (process.env.VUE_APP_PLATFORM !== 'h5') {
  plugins.push(new GenVersionMpPlugin());
} else {
  plugins.push(new GenVersionWebPlugin());
}

module.exports = {
  // 生产环境下设置 publicPath，用于 GitHub Pages 部署
  publicPath: process.env.NODE_ENV === 'production' ? GITHUB_PAGES_PATH : '/',
  transpileDependencies: ['tdesign-uniapp', 'tdesign-uniapp-chat'],
  configureWebpack: {
    plugins,
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@tdesign/uniapp', resolve('./uni_modules/tdesign-uniapp/components'))
      .set('@tdesign/uniapp-chat', resolve('./uni_modules/tdesign-uniapp-chat/components'));
  },
};
