/**
 * spot景点相关的路由
 */
import Layout from '../components/Layout.vue'
import Spot from '../views/Spot/Spot.vue'

let spotRouter = {
  path: '/spot',
  name: 'Spot',
  component: Layout,
  meta: {
    title: '景点管理'
  },
  children: [
    {
      path: 'index',
      // 路由名 /spot/index ===> SpotIndex
      name: 'SpotIndex',
      component: Spot,
      meta: {
        title: '景点信息管理'
      }
    }
  ]
}

export default spotRouter
