const mongodb = require('mongodb')
const ObjectId = mongodb.ObjectId

// 景点相关接口
const express = require('express')
const Router = express.Router() // 接口路由中间件
const { formatData } = require('../utils/index.js')

const { insert, remove, update, find } = require('../db/index.js')

Router.get('/list', async function(req, res) {
    let { page, size, address } = req.query

    let query = {}
    address && (query.address = new RegExp(address))
        // mark && (query.mark = new RegExp(mark))

    let data
    if (page && size) {
        data = await find('hotel', query, {
            page: Number(page),
            size: Number(size)
        })
    } else {
        data = await find('hotel', query)
    }
    // 获取所有景点数
    let allList = await find('hotel')
    console.log(allList)

    res.send({
        code: 200,
        msg: 'success',
        data: data,
        total: allList.length
    })
})

Router.delete('/delete', async function(req, res) {
    // ids: '1'               '1, 3, 4'
    // console.log(req.query.ids);
    // let idsArr = req.query.ids // 将字符串转成数组
    // idsArr = idsArr.map(function(item) {
    //     return ObjectId(item)
    // })
    let idsArr = req.query.ids.split(',') // 将字符串转成数组
    idsArr = idsArr.map(function(item) {
        return ObjectId(item)
    })

    let result = await remove('hotel', { _id: { $in: idsArr } })
    res.send(
        formatData({
            code: result === true ? 200 : 400
        })
    )

})

Router.post('/details', async function(req, res) {
    // req.body 获取到前端传过来的参数
    // let result = await insert('spot', 123)
    // console.log(result)
    // res.send(`新增景点${result ? '成功' : '失败'}`)

    let spotDetails = req.body
    let _id = spotDetails._id
    let result
    if (_id) {
        delete spotDetails.created
        delete spotDetails._id
        console.log(spotDetails);
        result = await update('hotel', { _id }, { $set: spotDetails })
    } else {
        spotDetails.created = new Date()
        result = await insert('hotel', spotDetails)
    }
    res.send(
        formatData({
            code: result === true ? 200 : 400
        })
    )
})

module.exports = Router