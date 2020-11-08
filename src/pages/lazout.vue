<template>
  <div class="lazout">
    <el-container class="el-container">
      <el-aside width="150px">
          <side-bar>{{}}</side-bar>
      </el-aside>
      <el-container>
        <el-header>
        <my-header :username="username"></my-header>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import MyHeader from "@/components/MyHeader";
import SideBar from "@/components/SideBar";
export default {
  components: {
    MyHeader,
    SideBar
  },

  computed: {
    // 账户名
    username() {
      return this.$store.state.info.username;
    },
  },
};
</script>
<style lang="less">
.lazout {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #b0c0cd;
  text-align: right;
  line-height: 60px;
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #20222a;
  color: #333;
//   text-align: center;
  height: 100%;
  //   line-height: 200px;
}

.el-main {
  background-color: #e5e5e5;
//   color: #333;
//   text-align: center;
//   line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>