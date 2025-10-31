const fs = require('fs');
const path = require('path');

// 需要复制的文件扩展名
const ASSET_EXTENSIONS = ['.json', '.scss', '.wxml'];

/**
 * 递归复制源目录中指定扩展名的文件到目标目录
 * @param {string} srcDir 源目录
 * @param {string} destDir 目标目录
 * @param {string[]} extensions 文件扩展名列表
 */
function copyAssets(srcDir, destDir, extensions) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      // 递归处理子目录
      copyAssets(srcPath, destPath, extensions);
    } else if (entry.isFile()) {
      // 检查文件扩展名
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        // 确保目标目录存在
        const destDirPath = path.dirname(destPath);
        if (!fs.existsSync(destDirPath)) {
          fs.mkdirSync(destDirPath, { recursive: true });
        }

        // 复制文件
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcPath} -> ${destPath}`);
      }
    }
  }
}

// 复制资源文件
console.log('Copying assets from src to miniprogram...');
copyAssets('src', 'miniprogram', ASSET_EXTENSIONS);
console.log('Asset copying completed.');