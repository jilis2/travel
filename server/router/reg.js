// 注册相关接口
const express = require('express')
const Router = express.Router() // 接口路由中间件
const { find, insert } = require('../db/index.js')
const { formatData, encrypt } = require('../utils/index.js')

// 1. 注册前，校验这个用户名有没有被使用
Router.get('/userRepeat', async function (req, res) {
  // (1)接收前端传过来的用户名(要求前端传参名叫username)
  let uname = req.query.username // 'lemon' || undefined
  if (!uname) {
    res.send(
      formatData({
        code: 400,
        msg: 'username is undefined'
      })
    )
  }
  // （2）拿用户名去数据库查找
  let resultArr = await find('user', { username: uname })
  if (resultArr.length > 0) {
    res.send(
      formatData({
        code: 400,
        msg: '用户名已被注册'
      })
    )
  } else {
    res.send(
      formatData({
        code: 200,
        msg: '可以注册该用户名'
      })
    )
  }
})

// 2. 注册，{username，password}
Router.post('/userReg', async function (req, res) {
  // post: req.body
  let { username, password } = req.body
  password = encrypt(password)
  let result = await insert('user', { username, password })
  res.send(
    formatData({
      code: result ? 200 : 400
    })
  )
})

module.exports = Router
