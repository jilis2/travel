/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2022-11-09 10:33:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-18 18:11:23
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [
      { id: 1, name: '鼠标', price: 20 },
      { id: 2, name: '键盘', price: 40 },
      { id: 3, name: '耳机', price: 60 },
      { id: 4, name: '显示屏', price: 80 }
    ],
    breadList: [],
    userInfo: null
  },
  mutations: {
    /**
     *
     * @param {*} state
     * @param {*} payload = { idx: 0, changePrice: 80 }
     */
    changeSinglePrice(state, payload) {
      // let { idx, changePrice } = payload
      // 等同于
      let idx = payload.idx // 数字
      let changePrice = payload.changePrice
      state.products[idx].price = changePrice
    },
    changeBreadList(state, payload) {
      state.breadList = payload
    },
    changeUserInfo(state, payload) {
      state.userInfo = payload
    }
  },
  getters: {
    getProducts(state) {
      return state.products.map(function (item) {
        return { ...item, yishangjia: true }
      })
    }
  },
  actions: {
    changeSinglePriceAsync(context, payload) {
      let idx = payload // 假设这是拿到的当前商品的idx
      //模拟接口请求，例如通过接口拿到了最新的价格
      // request.get(`/goods/${idx}`)
      setTimeout(function () {
        let price = 10 // 假设这是后端返回回来价格
        context.commit('changeSinglePrice', {
          idx: idx,
          changePrice: price
        })
        // console.log(context.state.products)
      }, 1000)
    },
    changeUserInfoAsync(context, payload) {
      context.commit('changeUserInfo', payload)
    }
  },
  modules: {}
})
