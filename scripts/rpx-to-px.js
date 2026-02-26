/**
 * 批量将 tdesign-uniapp CSS 中的 rpx 转换为 px
 * 
 * 使用方法: node scripts/rpx-to-px.js
 * 
 * 说明: 
 * - 将 uni_modules/tdesign-uniapp 目录下所有 .css 和 .vue 文件中的 rpx 转换为 px
 * - 转换比例: 1rpx = 0.5px (基于 750 设计稿，运行在 375 宽度的屏幕)
 */

const fs = require('fs');
const path = require('path');

// 配置
const TARGET_DIR = path.join(__dirname, '../uni_modules/tdesign-uniapp');
const RPX_TO_PX_RATIO = 0.5; // 1rpx = 0.5px

// 需要处理的文件扩展名
const FILE_EXTENSIONS = ['.css', '.vue'];

/**
 * 将 rpx 转换为 px
 * @param {string} content 文件内容
 * @returns {string} 转换后的内容
 */
function convertRpxToPx(content) {
  // 匹配所有 rpx 值，包括小数
  return content.replace(/(\d*\.?\d+)rpx/gi, (match, num) => {
    const pxValue = parseFloat(num) * RPX_TO_PX_RATIO;
    // 保留 2 位小数，去除末尾的 0
    return `${pxValue.toFixed(2).replace(/\.?0+$/, '')}px`;
  });
}

/**
 * 递归获取目录下所有指定扩展名的文件
 * @param {string} dir 目录路径
 * @param {string[]} extensions 文件扩展名数组
 * @returns {string[]} 文件路径数组
 */
function getAllFiles(dir, extensions) {
  let files = [];
  
  if (!fs.existsSync(dir)) {
    console.error(`目录不存在: ${dir}`);
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

/**
 * 处理单个文件
 * @param {string} filePath 文件路径
 * @returns {boolean} 是否有修改
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否包含 rpx
  if (!content.includes('rpx')) {
    return false;
  }
  
  const newContent = convertRpxToPx(content);
  
  // 如果内容有变化，写入文件
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  }
  
  return false;
}

/**
 * 主函数
 */
function main() {
  console.log('开始转换 rpx 为 px...');
  console.log(`目标目录: ${TARGET_DIR}`);
  console.log(`转换比例: 1rpx = ${RPX_TO_PX_RATIO}px`);
  console.log('');
  
  const files = getAllFiles(TARGET_DIR, FILE_EXTENSIONS);
  console.log(`找到 ${files.length} 个文件需要检查`);
  console.log('');
  
  let modifiedCount = 0;
  
  for (const file of files) {
    const relativePath = path.relative(TARGET_DIR, file);
    const modified = processFile(file);
    
    if (modified) {
      console.log(`✓ 已转换: ${relativePath}`);
      modifiedCount++;
    }
  }
  
  console.log('');
  console.log(`转换完成！共修改 ${modifiedCount} 个文件`);
}

// 执行
main();
