<template>
  <div id="app">
    <!-- 根据不同的路由切换不同的组件==> 单页面 -->
    <router-view></router-view> 

    <!-- 111
    <todo-list></todo-list>
    <SlotTest></SlotTest> -->
  </div>
</template>
<script>
// import { getRandomNum } from './utils/index.js'
// console.log(getRandomNum())

// 1. 将组件的配置选项对象，导入当前文件
// import TodoList from './views/TodoList/index.vue'
// import SlotTest from './views/SlotTest/index.vue'
export default{
  name: 'app',
  // 2.注册局部组件
  components: {
    // 'todo-list': TodoList,
    // SlotTest
  }
}
</script>
<style lang="scss">
body{
  margin: 0;
}
</style>
