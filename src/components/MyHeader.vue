<template>
  <!-- command：event自定义事件，点击任意事件的菜单都会触发。
            被点击项command作为事件处理参数传入
             -->
  <el-dropdown @command="logout">
    <!-- 下拉框固定显示 -->
    <span class="el-dropdown-link">
      <!-- 用户名 -->
      <span>{{ username }}</span>
      <i class="el-icon-setting"></i>
    </span>
    <!-- 下拉菜单 -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>

export default {
  // 接收username数据
  props: {
    username: {
      required: true,
      type: String,
    },
  },
  methods: {
    logout() {
      //点击之后清空登录信息
      this.$store.commit("clearInfo")
      this.$router.replace("/login")
    },
  },
};
</script>