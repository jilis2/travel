<template>
  <el-dialog :title="title" width="500px" top="5vh" :visible.sync="ifShowModal" class="dialog">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules" size="small">
      <el-form-item label="酒店名称：" prop="hotelname">
        <el-input v-model="form.hotelname" placeholder="请输入酒店名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="酒店类型：" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="form.address" placeholder="请输入地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="特点：" prop="advantage">
        <el-input v-model="form.advantage"  placeholder="请输入特点" clearable></el-input>
      </el-form-item>
      <el-form-item label="评分：" prop="mark">
        <el-input v-model="form.mark" :min="0" placeholder="请输入评分" clearable></el-input>
      </el-form-item>
      <el-form-item label="开业年份：" prop="opentime">
        <el-input v-model="form.opentime" :min="0" placeholder="请输入开业年份" clearable></el-input>
      </el-form-item>
      <el-form-item label="客房数：" prop="roomnumber">
        <el-input v-model="form.roomnumber" :min="0"  placeholder="请输入客房数" clearable></el-input>
      </el-form-item>
      <el-form-item label="电话：" prop="tel">
        <el-input v-model="form.tel" :min="0" placeholder="请输入电话" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="ifShowModal = false">取消</el-button>
      <el-button @click="submit" type="primary">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from "@/api/index.js";

export default {
  name: "hotelModal",
  data() {
    return {
      form: {},
      title: "新增酒店",
      ifShowModal: false,
      typeOptions: [
        {
          name: "高档型",
        },
        {
          name: "公寓式酒店",
        },
        {
          name: "舒适型",
        },
        {
          name: "快捷酒店",
        },
        {
          name: "商务型"
        },
        {
          name: "经济型"
        }
      ],
      rules: {
        hotelname: [
          { required: true, message: "请输入酒店名称", trigger: "blur" },
        ],
        mark: [{ required: true, message: "请输入评论", trigger: "change" }],
        type: [{ required: true, message: "请选择酒店类型", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        opentime: [
          { required: true, message: "请输入开业年份", trigger: "blur" },
        ],
        roomnumber: [
          { required: true, message: "请输入客房数", trigger: "blur" },
        ],
        tel: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
      },
    };
  },
  methods: {
    add() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
      this.title = "新增酒店";
      this.form = {};
    },
    edit(spotObj) {
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
      this.form = { ...spotObj };
      this.title = "编辑酒店";
    },
    submit() {
      /* 
        新增编辑：校验表单数据。将表单数据对象作为参数，发送给后端。
        后端插入数据库后，响应给前端。前端就关闭弹窗
      */
      this.$refs.form.validate((valid) => {
        if (valid) {
          let _id = this.form._id;
          request.post("/hotel/details", this.form).then(({ data: res }) => {
            if (res.code === 200) {
              this.$message.success(_id ? "编辑成功" : "新增成功");
              // 手动触发事件
              this.$emit("getHotelList");
              this.ifShowModal = false;
            } else {
              this.$message.error(_id ? "编辑失败" : "新增失败");
            }
          });
        } else {
          this.$message.warning("请先填写好表单信息再提交！");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

</style>