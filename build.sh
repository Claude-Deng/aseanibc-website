#!/bin/bash
# ./build.sh
# 构建脚本 - 打包静态网站

echo "开始打包网站..."

# 创建 dist 目录
rm -rf dist
mkdir -p dist

# 复制所有 HTML 文件
echo "复制 HTML 文件..."
cp *.html dist/

# 复制 CSS 文件
echo "复制 CSS 文件..."
cp *.css dist/

# 复制图片文件夹
echo "复制图片资源..."
cp -r indexPic dist/
cp -r servicePic dist/
cp -r casePic dist/
cp -r teamPic dist/

# 设置正确的权限（确保 Nginx 可以读取）
echo "设置文件权限..."
chmod -R 755 dist/

# 创建压缩包
echo "创建压缩包..."
cd dist
tar -czf ../website-dist.tar.gz .
cd ..

echo "✅ 打包完成！"
echo "📦 生成的文件："
echo "   - dist/ 目录（用于直接部署）"
echo "   - website-dist.tar.gz（压缩包，用于上传到服务器）"
