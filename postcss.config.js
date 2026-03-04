const path = require('path');
const postcss = require('postcss');

// HBuilderX 编译时，UNI_CLI_CONTEXT 指向 plugins/uniapp-cli/ 目录
// 通过它来 require HBuilderX 内置的三方 postcss 包，避免在项目中额外安装
function requireFromCli(id) {
  const cliContext = process.env.UNI_CLI_CONTEXT;
  if (cliContext) {
    try {
      return require(require.resolve(id, { paths: [cliContext] }));
    } catch (e) { /* fallback */ }
  }
  return require(id);
}

// 自定义 PostCSS 插件：将 Vue3 的 :deep() 转换为 Vue2 的 ::v-deep
// 使用 PostCSS 7 兼容的插件格式
const deepSelectorPlugin = postcss.plugin('postcss-deep-to-v-deep', () => {
  
  return (root) => {
    root.walkRules((rule) => {
      // 检查选择器中是否包含 :deep(
      if (rule.selector.includes(':deep(')) {
  
        // 转换 :deep(xxx) 为 ::v-deep xxx
        // 支持多种情况：
        // 1. :deep(.class) -> ::v-deep .class
        // 2. .parent :deep(.child) -> .parent ::v-deep .child
        // 3. :deep(.a .b) -> ::v-deep .a .b
        rule.selector = rule.selector.replace(
          /:deep\(([^)]+)\)/g,
          (match, innerSelector) => {
            return `::v-deep ${innerSelector.trim()}`;
          }
        );
      }
      
      // 同时处理 ::v-deep() 带括号的写法（某些情况下可能存在）
      if (rule.selector.includes('::v-deep(')) {
        rule.selector = rule.selector.replace(
          /::v-deep\(([^)]+)\)/g,
          (match, innerSelector) => {
            return `::v-deep ${innerSelector.trim()}`;
          }
        );
      }

      // 处理 :slotted() -> 直接移除（Vue2 不支持）
      if (rule.selector.includes(':slotted(')) {
        rule.selector = rule.selector.replace(
          /:slotted\(([^)]+)\)/g,
          (match, innerSelector) => innerSelector.trim()
        );
      }

      // 处理 :global() -> 直接提取内容（Vue2 不支持）
      if (rule.selector.includes(':global(')) {
        rule.selector = rule.selector.replace(
          /:global\(([^)]+)\)/g,
          (match, innerSelector) => innerSelector.trim()
        );
      }
    });
  };
});

// 自定义 PostCSS 插件：rpx 转 px (仅处理 node_modules/tdesign-uniapp)
// 使用 PostCSS 7 兼容的插件格式
const rpxToPxPlugin = postcss.plugin('postcss-rpx-to-px', () => {
  return (root) => {
    root.walkDecls((decl) => {
      // 只处理包含 rpx 的值
      if (decl.value.includes('rpx')) {
  
        // 将 rpx 转换为 px，比例 1rpx = 0.5px (基于 750 设计稿)
        decl.value = decl.value.replace(/(\d*\.?\d+)rpx/gi, (match, num) => {
          return `${(parseFloat(num) * 0.5).toFixed(2).replace(/\.?0+$/, '')}px`;
        });
  
      }
    });
  };
});

// 导出函数形式，避免 postcss-load-config 的 Object.assign 覆盖
module.exports = (ctx) => {
  const plugins = [
    requireFromCli('postcss-import')({
      resolve(id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3));
        } else if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2));
        } else if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1));
        }
        return id;
      },
    }),
    requireFromCli('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5',
    }),
    deepSelectorPlugin(),
  ];

  if (process.env.UNI_PLATFORM === 'h5') {
    plugins.push(rpxToPxPlugin());
  }

  plugins.push(require('@dcloudio/vue-cli-plugin-uni/packages/postcss'));

  return {
    parser: requireFromCli('postcss-comment'),
    plugins,
  };
};
