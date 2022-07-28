const path = require('path')
// 引入px => vw包
const pxToViewPort = require('postcss-px-to-viewport')
// 初始化适配基准 375
const vw = pxToViewPort({
  viewportWidth: 375,
})
module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src'),
      // 约定：使用 @scss 表示全局 SASS 样式所在路径
      // 在 SASS 中使用
      '@scss': path.resolve(__dirname, 'src/assets/styles'),
    },
  },
  style: {
    postcss: {
      plugins: [vw], // 转化 插件对象的
    },
  },
}
