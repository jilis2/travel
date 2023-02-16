/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2022-11-19 14:02:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-19 14:34:55
 */
const { log } = require('console')
const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const url = require('url')
const contentType = require('../utils/contentType.js')
const { formatData } = require('../utils/index.js')

router.get('/:url', (req, res, next) => {
    console.log(11111111111111);
    console.log(url);
    console.log(req.url);
    const pathname = url.parse(req.url).pathname
        // 获取静态资源文件夹
    const imagesPath = path.resolve('public/images')
    const realPath = path.join(imagesPath, pathname)
    const format = contentType[pathname.split('.')[1]]
    console.log('获取图片资源', realPath, format, contentType[format]);
    // 读取图片资源
    fs.readFile(realPath, (err, data) => {
        if (err) {
            return res.send(formatData({
                code: 400
            }))
        } else {
            res.writeHead(200, { 'content-type': `${format};charset=utf8` })
            res.end(data)
        }
    })
})

module.exports = router