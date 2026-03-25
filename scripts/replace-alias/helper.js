const fs = require('fs');
const { ALIAS_LIST } = require('./config');

/**
 * 构建匹配正则：匹配 @import 语句中不带 ~ 前缀的 alias
 * 例如：@import '@tdesign/uniapp/common/...' => @import '~@tdesign/uniapp/common/...'
 */
function buildRegex(alias) {
  const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // 匹配 @import 后跟引号，引号内以 alias 开头（但前面没有 ~）
  return new RegExp(`(@import\\s+['"])(?!~)(${escaped})`, 'g');
}

/**
 * 替换单个文件中的 alias
 * @param {string} filePath 文件路径
 * @returns {{ replaced: boolean, error?: string }}
 */
function replaceAliasInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    for (const alias of ALIAS_LIST) {
      const regex = buildRegex(alias);
      newContent = newContent.replace(regex, `$1~$2`);
    }

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return { replaced: true };
    }

    return { replaced: false };
  } catch (err) {
    return { replaced: false, error: err.message };
  }
}

module.exports = { replaceAliasInFile };
