const fs = require('fs');
const path = require('path');
const { ROOT_DIR, SCAN_DIRS, SCAN_ROOT_FILES, SUPPORTED_EXTENSIONS } = require('./config');
const { replaceAliasInFile } = require('./helper');

/**
 * 递归获取目录下所有指定扩展名的文件
 */
function getAllFiles(dir, extensions) {
  let files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (stat.isFile()) {
      if (extensions.some(e => item.endsWith(e))) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * 主函数：全量扫描并替换
 */
function main() {
  console.log('🔄 开始替换 alias（添加 ~ 前缀，适配 Vue2）...');
  console.log(`   目标目录: ${SCAN_DIRS.join(', ')}`);
  console.log(`   目标文件: ${SCAN_ROOT_FILES.join(', ')}\n`);

  let totalFiles = 0;
  let modifiedCount = 0;

  // 扫描目录
  for (const dir of SCAN_DIRS) {
    const fullDir = path.join(ROOT_DIR, dir);
    const files = getAllFiles(fullDir, SUPPORTED_EXTENSIONS);
    totalFiles += files.length;

    for (const file of files) {
      const relativePath = path.relative(ROOT_DIR, file);
      const { replaced, error } = replaceAliasInFile(file);

      if (error) {
        console.log(`  ⚠️  [${relativePath}] 替换失败: ${error}`);
      } else if (replaced) {
        console.log(`  ✅ [${relativePath}] alias 已替换`);
        modifiedCount++;
      }
    }
  }

  // 扫描根目录文件
  for (const file of SCAN_ROOT_FILES) {
    const fullPath = path.join(ROOT_DIR, file);
    if (fs.existsSync(fullPath)) {
      totalFiles++;
      const { replaced, error } = replaceAliasInFile(fullPath);

      if (error) {
        console.log(`  ⚠️  [${file}] 替换失败: ${error}`);
      } else if (replaced) {
        console.log(`  ✅ [${file}] alias 已替换`);
        modifiedCount++;
      }
    }
  }

  console.log(`\n✅ 替换完成！共检查 ${totalFiles} 个文件，修改 ${modifiedCount} 个文件`);
}

main();
