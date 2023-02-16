/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2022-11-15 10:01:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-19 14:12:58
 */
const express = require('express')
const app = express()
const config = require('./config/index.js')
const rootRouter = require('./router/index.js')
const imageRouter = require('./router/image.js')

// Cors解决跨域问题
app.use(function (req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,PATCH,DELETE,OPTIONS'
  })

  // 跨域请求CORS中的预请求
  if (req.method == 'OPTIONS') {
    res.sendStatus(200) /*让options请求快速返回*/
  } else {
    next()
  }
})

// 只要是localhost:1193/api,都会进入这个中间件处理函数
app.use('/api', rootRouter)
// 只要是获取图片，就进入获取图片的中间件处理
app.use('/images', imageRouter)

app.listen(config.PORT, function () {
  console.log(`服务已开启在端口${config.PORT}`)
})
