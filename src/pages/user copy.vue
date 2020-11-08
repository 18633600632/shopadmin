<template>
  <div>
    <!-- 1.面包屑导航 -->
    <!-- separator ：分隔符 -->
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <my-user :userlist="userlist" @changeMenu="changeFn"></my-user>

     <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn">
      <!-- 表单 -->
      <el-form label-width="100px" :model="formdata" ref="roleform" :rules="rules">
        <el-form-item prop="rolename" label="角色">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.roleid" placeholder="请选择" >
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formdata.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      size: 2,
      page: 1,
      total:0,
    checkedKeys: [], //编辑时的预先选中项
      formdata: {
        roleid: "",
        username: "",
        password: "",
        status: true,
      },
      //验证规则
      rules: {
        username: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: 'blur',
          },
        ],
      },
      dialogVisible: false,
      topuser: [],
       //角色列表
      rolelist: []
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
     closeFn() {
      this.checkedKeys = [];
      this.formdata = {
        rolename: "",
        menus: [],
        status: true
      };
    },
   submit() {
      // 提交事件
      // 判断是编辑打开还是新增打开
      let url = this.formdata.id ? this.$api.USEREDIT : this.$api.USERADD; //点击编辑按钮时才会有id
      this.formdata.status = this.formdata.status ? 1 : 2;
      console.log(this.formdata);
      this.$refs.roleform.validate((value) => {
        if (!value) {
          return false;
        }
        this.$http.post(url, this.formdata).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getUser(); //获取最新列表数据
            this.dialogVisible = false; //关闭对话框
          }
        });
      });
    },
    //   新增按钮
    addFn() {
      this.dialogVisible = true;
    },
    // 
    getUser() {
      this.$http
        .get(this.$api.USERLIST, { page: this.page, size: this.size })
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.userlist = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
    },
 
    // 打开对话框时需要的角色列表
    async getRoleList() {
      let res = await this.$http.get(this.$api.ROLELIST);
      console.log(res);
      if (res.code == 200) {
        this.rolelist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    // 打开对话框的回调
    openFn() {
      this.getRoleList();
    },

    // 子组件触发自定义事件
    changeFn(userlist) {
      this.userlist = userlist;
    },
  },
};
</script>