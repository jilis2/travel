/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2022-11-15 10:24:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-19 13:53:25
 */
// 登录相关接口
const express = require('express')
const Router = express.Router() // 接口路由中间件
const { encrypt, formatData } = require('../utils/index.js')
const { find } = require('../db/index.js')
const jwt = require('jsonwebtoken')

const secretKey = "itheima No1 ^_^";
Router.post('/userLogin', async function(req, res) {
    let { username, password } = req.body
    password = encrypt(password);
    let resultArr = await find('user', { username, password })
    console.log(resultArr[0].username);
    if (resultArr.length > 0) {
        const token = jwt.sign({ username: resultArr[0].username }, secretKey, { expiresIn: '30s' })
        res.send(
            formatData({
                code: 200,
                data: { token }
            })
        )
    } else {
        res.send(
            formatData({
                code: 400
            })
        )
    }
})

module.exports = Router