const chokidar = require('chokidar');
const path = require('path');
const net = require('net');
const { replaceAliasInFile } = require('./helper');
const { ROOT_DIR, SUPPORTED_EXTENSIONS, SCAN_DIRS, SCAN_ROOT_FILES } = require('./config');

// 监听端口（防止重复启动）
const PORT = 12347;

// 构建 glob 模式（使用正斜杠，兼容 chokidar）
function buildGlobPatterns() {
  const extGlob = `**/*{${SUPPORTED_EXTENSIONS.join(',')}}`;
  const patterns = [];

  for (const dir of SCAN_DIRS) {
    patterns.push(`${ROOT_DIR}/${dir}/${extGlob}`);
  }

  for (const file of SCAN_ROOT_FILES) {
    patterns.push(`${ROOT_DIR}/${file}`);
  }

  return patterns;
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close(() => resolve(false));
    });
    server.listen(port);
  });
}

function gracefulShutdown() {
  console.log('\n[Watch] 收到终止信号，关闭监听器...');
  process.exit(0);
}

// 防循环写入：记录最近由脚本自身修改的文件
const recentlyModified = new Map();
const DEBOUNCE_MS = 1000;

function handleFileChange(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);

  // 跳过由脚本自身修改触发的二次变化
  const lastModified = recentlyModified.get(filePath);
  if (lastModified && Date.now() - lastModified < DEBOUNCE_MS) {
    return;
  }

  console.log(`  📝 [${relativePath}] 检测到变化`);

  const { replaced, error } = replaceAliasInFile(filePath);

  if (error) {
    console.log(`  ⚠️  [${relativePath}] 替换失败: ${error}`);
  } else if (replaced) {
    // 记录该文件刚被脚本修改，防止触发二次处理
    recentlyModified.set(filePath, Date.now());
    console.log(`  ✅ [${relativePath}] alias 已替换`);
  }
}

async function main() {
  if (await isPortInUse(PORT)) {
    console.log('[Watch] 监听已在其他终端运行');
    return;
  }

  // 创建监听服务器（占用端口，防止重复启动）
  const server = net.createServer();
  server.listen(PORT);

  const patterns = buildGlobPatterns();
  console.log('👀 开始监听文件变化（Vue2 alias 替换）...');
  console.log(`   监听目录: ${SCAN_DIRS.join(', ')}`);
  console.log(`   监听文件: ${SCAN_ROOT_FILES.join(', ')}\n`);

  const watcher = chokidar.watch(patterns, {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 50,
    },
  });

  watcher
    .on('add', handleFileChange)
    .on('change', handleFileChange);

  // 监听进程终止信号
  process.on('exit', () => {
    watcher.close();
    server.close();
  });
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

main();
