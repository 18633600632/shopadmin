<template>
  <div class="container">
    <div class="login-container">
      <!-- el-form：表单容器
      rules：验证规则
      :model：表单绑定的数据
      ref：表单组件引用
       -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="loginForm"
        class="demo-ruleForm"
      >
        <h2>登录</h2>
        <!-- prop:获取rules中的同名验证规则进行验证 -->
        <el-form-item prop="username" class="el-form-item" label>
          <el-input v-model="ruleForm.username" class="el-input"></el-input>
        </el-form-item>
        <el-form-item prop="password" label>
          <el-input v-model="ruleForm.password" class="el-input" type='password'></el-input>
        </el-form-item>
        <el-form>
          <el-button type="primary" class="btn" @click="submit('loginForm')"
            >登录</el-button
          >
        </el-form>
      </el-form>
    </div>
  </div>
</template>
<script>
// 辅助函数 用于在组件中映射mutation内的方法，以便在该组件中直接使用mutation里的方法
import { mapMutations, mapActions } from "vuex";
export default {
  methods: {
    // 使用es6的拓展运算符 传进保存信息方法。
    ...mapMutations(["setInfo"]),
    ...mapActions(["userLogin"]),
    //   点击登录，未填数据时需要验证
    submit(form) {
  
     /*
     this.$refs[form]：利用传入的ref值，获取el-form组件,调用验证函数
       利用传入的ref值，调用表单组件的验证方法
      @value:boolean 是否通过验证boolean
      点击登录再次验证。
      */
      this.$refs[form].validate((value) => {
        //验证不通过
        if (!value) {
          return false;
        }
        // value为true，向后台发送请求  stringify：转为字符串
        let str = this.$qs.stringify(this.ruleForm);
        console.log(str); //username=admin&password=123123
        // 异步请求数据
        this.$http.post(this.$api.USERLOGIN, str).then((res) => {
          console.log(res);
        //   登陆成功
          if (res.code == 200) {
            // 调用setinfo传入token和info
            this.setInfo({ token: res.list.token, info: res.list });
            // 跳转首页
            this.$router.replace("/index");
          } else {
            // 登录失败
            this.$message.error(res.msg);
          }
        });
      });
    },
  },
  data() {
    return {
      ruleForm: {
        // 用户名和账号
        username: "",
        password: "",
      },
      // 验证规则
      rules: {
        //   用户名 每一个对象都是一条验证规则。
        username: [
          {
            required: true,
            message: "请输入管理员账户",
            trigger: "blur", //失去焦点时验证。
          },
          {
            min: 4,
            max: 8,
            message: "请输入 4 到 8个非空字符",
            trigger: "blur", //失去焦点时验证。
          },
        ],
        // 密码
        password: [
          {
            required: true,
            message: "请输入管理员密码",
            trigger: "blur", //失去焦点时验证。
          },
          {
            min: 4,
            max: 8,
            message: "请输入 4 到 8个字符",
            trigger: "blur", //失去焦点时验证。
          },
        ],
      },
    };
  },
};
</script>
<style lang="less" >
.container {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
  .login-container {
    width: 300px;
    height: 300px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .demo-ruleForm {
      padding: 10px 0px;
    }
    h2 {
      margin-bottom: 20px;
      color: #fff;
    }
    .btn {
      width: 300px;
    }
  }
}
</style>