/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2022-11-18 16:13:22
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-19 15:51:34
 */
const { find, edit, update } = require('../db/index.js')
const { formatData } = require('../utils/index.js')
const { encrypt } = require('../utils/index.js')
const express = require('express')
const router = express.Router()
const multer = require('multer')
let fs = require('fs')

const uploadImg = multer({
    dest: "public/images/"
})
const singleMidle = uploadImg.single('img')
    // 下载multiparty 插件 用来传送图片
const multiparty = require("multiparty")
    // 下载uuid npm install uuid --save 用来生成唯一名字
const uuid = require('uuid')
    // 下载images插件 用来做24行的（图片处理）
const images = require("images")

router.get('/', async(req, res, next) => {
    const result = await find('user', { username: req.query.username })
    res.send(
        formatData({
            code: 200,
            data: result[0]
        })
    )
})

router.post('/update', async(req, res, next) => {
    const userInfo = req.body
    let id = userInfo._id
    delete userInfo._id
    const result = await update('user', { _id: id }, { $set: userInfo })
    const data = await find('user', { username: userInfo.username })
    if (result) {
        res.send(
            formatData({
                code: 200,
                data: data[0]
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

router.post('/updatePw', async(req, res, next) => {
    const { oldPassword, newPassword, id } = req.body

    const oldUserInfo = await find('user', { _id: id })
        // console.log(oldUserInfo[0], oldUserInfo[0].password, oldPassword, encrypt(oldPassword));
    const isOldPwCorrect = oldUserInfo[0].password === encrypt(oldPassword)
    if (!isOldPwCorrect) {
        res.send(formatData({
            code: 400,
            msg: '旧密码错误，请重新输入'
        }))
    } else {
        const result = await update('user', { _id: id }, { $set: { password: encrypt(newPassword) } })
        const data = await find('user', { _id: id })
        if (result) {
            res.send(formatData({
                code: 200,
                data: data[0]
            }))
        } else {
            res.send(formatData({
                code: 400
            }))
        }
    }

})

// router.post('/upload', (req, res, next) => {
//     console.log('上传图片');
//     let form = new multiparty.Form()
//     form.parse(req, (err, field, files) => {
//         if (err) {
//             res.send(
//                 formatData({
//                     code: 400
//                 })
//             )
//         }
//         console.log(files.file[0])
//         const originFileName = files.file[0].originalFilename
//         console.log('旧的文件名', originFileName)
//             // 上传的文件格式
//         const format = originFileName.split(".")
//             // 设置上传的文件的新的文件名，确保名字唯一
//         const filename = uuid.v1() + "." + format[format.length - 1]
//         console.log("新的" + filename);
//         // 将文件存储到服务器本地
//         console.log(files.file[0].path);
//         images(files.file[0].path) //Load image from file 
//             .size(1920, 1276)
//             .save("public/images" + filename, {
//                 quality: 1000
//             });
//         console.log('到这里');
//         // 给前端返回地址
//         const url = '/images/' + filename
//         console.log('给前端返回的路径'.filename);
//         res.send({
//             code: 200,
//             data: url
//         })
//     })
// })

router.post('/upload', singleMidle, (req, res, next) => {
    console.log(req.file);
    let file = req.file;

    fs.renameSync('public/images/' + file.filename, 'public/images/' + file.originalname)
    console.log(file.filename);
    console.log("-----------------------");
    console.log(file.originalname);
    res.send({
        code: 200,
        data: file.originalname
    })
})

module.exports = router