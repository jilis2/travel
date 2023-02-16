<template>
  <el-card header="热门景区游客人数"  v-loading="loading" element-loading-text="拼命加载中">
    <div id="main"></div>
  </el-card>
  <!-- <router-view></router-view> -->
</template>
<script>
import * as echarts from 'echarts'
import request from '@/api/index.js'
export default {
  name: 'Home',
  data(){
    return {
      loading: false,
      hotSpotList: []
    }
  },
  components: {
  },
  created(){
    this.loading = true
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'));
    request.get('/spot/list').then(({data: res}) => {
      if(res.code === 200) {
        this.hotSpotList = res.data.sort(function(a, b) {
          return b.visitors - a.visitors
        })
        this.hotSpotList = this.hotSpotList.slice(0,4).map(function(item) {
          return { value: item.visitors, name: item.name}
        })
        // 绘制图表
        myChart.setOption({
          legend: {
            top: 'bottom'
          },
          series: [
            {
              type: 'pie',
              radius: [50, 150],
              center: ['50%', '50%'],
              roseType: 'area',
              itemStyle: {
                borderRadius: 8
              },
              left: 20,
              right: 20,
              top: 50,
              bottom: 50,
              data: this.hotSpotList
            }
          ]
        })
        this.loading = false
      }
    })
      
  }
}
</script>
<style lang="scss" scoped>
#main{
  width: 80%;
  height: 400px;
  margin: 0 auto;
}
</style>