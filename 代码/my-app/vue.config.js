const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint校验
  lintOnSave: false,
  // 设置axios跨域代理
  devServer: {
    proxy: {
      '/api': {
        // 目标服务器域名
        target: "http://localhost:5000",
        ws: true,
        changOrigin: true,
      }
    }
  },
  // 配置webpack提高打包速度、减小打包体积
  
})
