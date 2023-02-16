<template>
  <div class="login">
    <div class="form">
      <h1>有请下一组</h1>
      <!-- 登录 -->
      <el-form ref="form" :model="form" label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model.trim="form.username" placeholder="请输入帐号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input placeholder="请输入密码" v-model.trim="form.password" show-password></el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button el-button type="primary" @click="login">登录</el-button>
        </div> 
        <div style="text-align: right" >
          <el-button type="text" @click="goto('/reg')">您是否还未注册？</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import request from '@/api/index.js'
// import {mapState} from 'vuex';
export default{
  name: 'login',
  // computed: {
  //   ...mapState(['products'])
    
  // },
  data(){
    return {
      form: {
        username: '',
        password: ''
      },
    }
  },
  methods: {
    login() {
      /* 登录时:
          输入框前后空格去除
          用户名+密码=>数据库校验=>登录成功=> 后端返回一个token(有效期)
          前端要把token存起来=> 部分路由在路由跳转前先判断有没有token，有才允许用户进入，没有呢去到登录页登录。
                          => 接口对接时，用请求头将token传过去。当请求头的token满足时，才返回数据。
          前端可能还会存储一些相关的用户信息（用户名、头像）==> vuex
          帮用户直接跳转到首页==> 帮用户跳回其刚刚想要访问的页面
      */
      request.post('/login/userLogin', {
        username: this.form.username,
        password: this.form.password
      }).then(({ data: res}) => {
        if(res.code === 200) {
          let token = res.data.token
          localStorage.setItem('token', token)
          this.$router.push({ path: '/home'})
          // 登录成功后到后台查询用户信息，并保存到store中
          this.getUserInfo()
        } else {
          this.$message.error('登录失败，请重新再试')
        }
      })
      // 上课关于vuex的使用笔记：
      // this.$store.commit('changeSinglePrice', { idx: 0, changePrice: 80})
      // this.$store.dispatch('changeSinglePriceAsync', 1)
      // console.log(this.products)
      // console.log(this.$store.getters.getProducts)
    },
    goto(path) {
      this.$router.push(path)
    },
    getUserInfo() {
      request.get('/userinfo', {params: {username: this.form.username}}).then(res => {
        this.$store.dispatch('changeUserInfoAsync', res.data.data)
        localStorage.setItem('userInfo', JSON.stringify(res.data.data))
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .login{
    position: relative;
    height: 100vh;
    background: url(../../assets/bg1.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .form{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    h1{
      height: 80px;
      margin: 0;
      text-align: center;
      letter-spacing: 8px;
    }
    width: 300px;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    margin-right: 100px;
  }
</style>

