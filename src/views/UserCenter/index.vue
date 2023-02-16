<!--
 * @Descripttion:
 * @version:
 * @Author: congsir
 * @Date: 2022-09-30 15:31:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-20 10:43:10
-->
<template>
  <div class="background">
    <div class="container">
      <header>
        <span class="title">用户信息</span>
        <span v-if="!isEdit" class="button" @click="handleEdit">编辑</span>
        <span v-else class="edit_btn">
          <span class="button" @click="handleSave">保存</span>
          <span class="button white_btn" @click="handleCancel">取消</span>
        </span>
      </header>
      <div class="content">
        <div class="head_img">
          <div class="title">头像：</div>
          <div>
            <img v-if="tempUrl || userInfo.headImg" :src="tempUrl || userInfo.headImg" class="img">
            <div v-else class="img"></div>
            <el-upload
            name="img"
              v-if="isEdit"
              :action="uploadURL"
              :headers="headers"
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :on-success="uploadImgSuccess"
            >
              <a href="#" class="upload">上传</a>
            </el-upload>
          </div>
        </div>
        <div class="name">
          <div class="title">昵称：</div>
          <div v-if="!isEdit" class="text">{{ userInfo.username || '无' }}</div>
          <input v-else v-model="userInfo.username" placeholder="请输入昵称" class="input">
          <div class="text disable">
            <span>{{ userInfo.userAccount }}</span>
            <span v-if="isEdit" class="passwd" @click="handleUpdatePassWd">修改密码</span>
          </div>
        </div>
        <div class="account">
          <div class="title">邮箱：</div>
          <div v-if="!isEdit" class="text">{{ userInfo.mail || '无' }}</div>
          <input v-else v-model="userInfo.mail" class="input" placeholder="请输入邮箱" />
        </div>
        <div class="userContacts">
          <div class="title">性别：</div>
          <div v-if="!isEdit" class="text">{{ userInfo.sex ? (userInfo.sex === '0' ? '男' : '女') : '无' }}</div>
            <el-select v-else v-model="userInfo.sex" placeholder="请选择" size="small">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </div>
        <div class="user_mobile">
          <div class="title">联系方式：</div>
          <div v-if="!isEdit" class="text">{{ userInfo.phone || '无' }}</div>
          <input v-else v-model="userInfo.phone" class="input" placeholder="请输入联系方式">
        </div>
        <div class="srv_date">
          <div class="title">年龄：</div>
          <div v-if="!isEdit" class="text">{{ userInfo.age || '无' }}</div>
          <input v-else v-model="userInfo.age" class="input" placeholder="请输入年龄">
        </div>
      </div>
      <el-dialog
        title="修改密码"
        width="560px"
        top="5%"
        :visible="updatePassWdVisible"
        :before-close="handleCancelPassWd"
      >
        <el-form ref="form" :model="form" class="customForm" :rules="rules" label-width="100px" size="small">
          <el-form-item label="原密码：" prop="oldPasswd">
            <el-input v-model="form.oldPasswd" type="password" show-password placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="新密码：" prop="newPasswd">
            <el-input v-model="form.newPasswd" type="password" show-password placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPasswd">
            <el-input v-model="form.confirmPasswd" type="password" show-password placeholder="请输入内容" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleCancelPassWd">取 消</el-button>
          <el-button type="primary" size="small" @click="handleSubmitPassWd">确 认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from '../../api'

export default {
  data() {
    const validatorNewPasswd = (rule, value, callback) => {
      if (value === this.form.oldPasswd) {
        callback(new Error('新旧密码不能一样'))
      }
      callback()
    }
    const validatorConfirmPasswd = (rule, value, callback) => {
      if (value !== this.form.newPasswd) {
        callback(new Error('两次输入密码不一致'))
      }
      callback()
    }
    return {
      isEdit: false,
      userInfo: {},
      // 头像上传地址
      // uploadURL: `http://1.15.183.51:8007/zysea/upload/image`,
      uploadURL: `http://localhost:1193/api/userinfo/upload`,
      headers: {
      },
      tempUrl: '',
      // 修改密码
      updatePassWdVisible: false,
      form: {},
      rules: {
        oldPasswd: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }],
        newPasswd: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        }, {
          max: 8,
          min: 6,
          message: '密码长度需在6-8位之间',
          trigger: 'blur'
        }, {
          validator: validatorNewPasswd,
          trigger: 'blur'
        }],
        confirmPasswd: [{
          required: true,
          message: '请确认密码',
          trigger: 'blur'
        }, {
          validator: validatorConfirmPasswd,
          trigger: 'blur'
        }]
      },
      sexOptions: [{
        value: '0',
        label: '男'
      }, {
        value: '1',
        label: '女'
      }]
    }
  },
  filters: {
    phoneNumFilter(data) {
      return `${data.substring(0, 4)} ${data.substring(3, 4)} ${data.substring(7, 4)}`
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    // 默认头像
    getDefaultImg(url) {
      return url 
    },

    // 获取用户信息
    getUserInfo() {
      const userInfo = localStorage.getItem('userInfo')
      this.userInfo = JSON.parse(userInfo)
      request.get(`/userinfo`, {params: {username: this.userInfo.username}}).then(res => {
        this.userInfo = res.data.data
        console.log('this.userInfo', this.userInfo);
      })
    },

    // 点击编辑
    handleEdit() {
      this.isEdit = true
    },

    // 上传头像前进行判断
    beforeImgUpload(file) {
      console.log("我到头像判断这里了");
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      const size = file.size / 1024 <= 500
      if (!isImg) {
        this.showMessage('只能上传格式为jpeg/png的图片', 'warning')
      } else if (!size) {
        this.showMessage('图片大小不能超过500KB', 'warning')
      }
      console.log(isImg,size);
    },

    // 上传成功
    uploadImgSuccess(res) {
      console.log("我成功了");
      this.tempUrl = `http://localhost:1193/images/${res.data}`
      // this.tempUrl = `http://192.168.31.184:8007/zysea${res.data}`
      // this.tempUrl = `http://1.15.183.51:8007/zysea${res.data}`
      console.log('tempUrl', this.tempUrl)
    },

    // 点击修改密码
    handleUpdatePassWd() {
      this.updatePassWdVisible = true
    },

    // 点击密码修改框中的取消
    handleCancelPassWd() {
      this.updatePassWdVisible = false
      this.updatePassWdForm = {}
    },

    // 点击密码修改框中的确定
    handleSubmitPassWd() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      console.log('点击确定', userInfo._id)
      console.log(this.$refs.form.validate)
      this.$refs.form.validate(() => {
        request.post('/userinfo/updatePw', {
          oldPassword: this.form.oldPasswd,
          newPassword: this.form.newPasswd,
          id: (this.$store.state.userInfo && this.$store.state.userInfo._id) || userInfo._id
        }).then(res => {
          if(res.data.code !== 200) {
            this.$message.error(res.data.msg)
          }else {
            this.$message.success('修改成功')
            this.updatePassWdVisible = false
          }
        })
      })
    },

    // 点击保存
    handleSave() {
      const temp = {
        ...this.userInfo,
        headImg: this.tempUrl || this.userInfo.headImg
      }
      request.post('/userinfo/update', temp).then(res => {
        this.isEdit = false
        this.$store.dispatch('changeUserInfoAsync', res.data.data)
        localStorage.setItem('userInfo', JSON.stringify(res.data.data))
        request.get('/userinfo', {params: {username: res.data.data.username}}).then(res => {
          this.userInfo = res.data.data
          this.$message.success('保存成功')
        })
      })
    },

    // 点击取消
    handleCancel() {
      this.isEdit = false
      this.tempUrl = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 144px);
  // background-color: #f2f2f2;
  .container {
    width: 960px;
    height: fit-content;
    margin-top: 20px;
    border-radius: 2px;
    background-color: #fff;
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px;
      border-bottom: 1px solid #f3f3f3;
      .title {
        display: flex;
        align-items: center;
        color: #333;
        &::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 16px;
          margin-right: 8px;
          border-radius: 2px;
          background-color: #277fe5;
        }
      }
      .button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 30px;
        border-radius: 15px;
        color: #fff;
        background-color: #1073f4;
        cursor: pointer;
      }
      .edit_btn {
        display: flex;
        align-items: center;
        .white_btn {
          margin-left: 12px;
          background-color: #fff;
          border: 1px solid #1073f4;
          color: #1073f4;
        }
      }
    }
    .content {
      padding: 20px 10px;
      .head_img,
      .name,
      .account,
      .userContacts,
      .user_mobile,
      .srv_date {
        display: flex;
        padding: 20px 0 20px 30px;
        color: #333;
        .title {
          width: 120px;
        }
        .text {
          background-color: #fff;
          &.disable {
            color: #999;
          }
        }
        .input {
          margin: 0;
          padding: 0;
          color: #333;
          font-size: 16px;
          border: none;
          outline: none;
          background-color: transparent;
          box-sizing: border-box;
        }
      }
      div:nth-child(2n) {
        background-color: #f7f8f9;
        .text {
          background-color: #f7f8f9;
        }
      }
      .head_img {
        display: flex;
        align-items: center;
        padding-top: 0;
        div {
          display: flex;
          align-items: center;
          background-color: #fff;
        }
        .img {
          overflow: hidden;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-right: 30px;
          background-color: #eee;
        }
        .upload {
          text-decoration: none;
          color: #1073f4;
        }
      }
      .name {
        position: relative;
        .text {
          /* display: flex;
          justify-content: space-between;
          width: calc(100% - 120px);
          padding-right: 30px; */
          .passwd {
            position: absolute;
            right: 20px;
            color: #1073f4;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
