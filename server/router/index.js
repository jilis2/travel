/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2022-11-15 10:23:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-19 16:39:02
 */
// 专门处理所有接口操作
const express = require('express')
const Router = express.Router() // 接口路由中间件
const spotRouter = require('./spot.js')
const loginRouter = require('./login.js')
const regRouter = require('./reg.js')
const userRouter = require('./user.js')
const hotelRouter = require('./hotel.js')

//对所有接口的post请求得到数据进行处理
Router.use(express.urlencoded({ extended: false }), express.json())

Router.use('/spot', spotRouter)
Router.use('/login', loginRouter)
Router.use('/reg', regRouter)
Router.use('/userinfo', userRouter)
Router.use('/hotel', hotelRouter)

module.exports = Router
