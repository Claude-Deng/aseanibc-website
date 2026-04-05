#!/bin/bash
# 诊断CSS加载问题

echo "=== CSS文件诊断 ==="
echo ""

# 检查CSS文件是否存在
echo "1. 检查CSS文件："
if [ -f "style.css" ]; then
    echo "   ✅ style.css 存在"
    ls -lh style.css
else
    echo "   ❌ style.css 不存在"
fi

echo ""
echo "2. 检查CSS文件内容（前10行）："
head -10 style.css

echo ""
echo "3. 检查HTML文件中的CSS引用："
grep -n "stylesheet" index.html

echo ""
echo "4. 检查文件权限："
ls -la *.css *.html | head -5

echo ""
echo "=== 可能的问题和解决方案 ==="
echo ""
echo "如果在服务器上CSS无法加载，请检查："
echo "1. Nginx配置中是否正确设置了CSS的MIME类型"
echo "2. 文件权限是否正确（应该是644或755）"
echo "3. 浏览器开发者工具中Network标签，查看CSS文件的HTTP状态码"
echo "4. 检查服务器错误日志"
echo ""
echo "Nginx配置示例："
echo "  location ~* \\.css$ {"
echo "      types { text/css css; }"
echo "      add_header Content-Type text/css;"
echo "  }"
