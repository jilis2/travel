/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2022-11-15 10:23:56
 * @LastEditors: 
 * @LastEditTime: 2022-11-19 13:53:07
 */
const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId

// 景点相关接口
const express = require('express')
const Router = express.Router() // 接口路由中间件
const { formatData } = require('../utils/index.js')

const { insert, remove, update, find } = require('../db/index.js')

Router.get('/list', async function(req, res) {
    let { page, size, name, mark } = req.query
    let query = {}
    name && (query.name = new RegExp(name))
    mark && (query.mark = new RegExp(mark))

    let data
    if (page && size) {
        console.log('if');
        data = await find('spot', query, {
            page: Number(page),
            size: Number(size)
        })
    } else {
        console.log('else');
        data = await find('spot', query)
    }

    // 获取所有景点数
    let allList = await find('spot')

    res.send({
        code: 200,
        msg: 'success',
        data: data,
        total: allList.length
    })
})

Router.delete('/delete', async function(req, res) {
    // ids: '1'               '1, 3, 4'
    let idsArr = req.query.ids.split(',') // 将字符串转成数组
    idsArr = idsArr.map(function(item) {
        return ObjectId(item)
    })
    let result = await remove('spot', { _id: { $in: idsArr } })
        // res.send(`删除景点${result ? '成功' : '失败'}`)
    res.send(
        formatData({
            code: result === true ? 200 : 400
        })
    )
})

// 新增或编辑
Router.post('/details', async function(req, res) {
    let spotDetails = req.body
    let _id = spotDetails._id
    let result
    if (_id) {
        // 编辑
        delete spotDetails.created
        delete spotDetails._id
        result = await update('spot', { _id }, { $set: spotDetails })
    } else {
        // 新增
        spotDetails.created = new Date()
        result = await insert('spot', spotDetails)
    }
    res.send(
        formatData({
            code: result === true ? 200 : 400
        })
    )
})

module.exports = Router