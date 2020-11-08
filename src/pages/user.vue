<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table :data="userlist">
      <el-table-column label="用户编号" prop="uid" width="200"></el-table-column>
      <el-table-column label="角色名称" prop="rolename" width="200"></el-table-column>
      <el-table-column label="用户名" prop="username" width="200"></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button size="mini" @click="handleDelete(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
            background:设置背景
            layout:布局
            total:总条数
            page-size:每一页数据量
            current-change:当前页面发生变化触发的事件
            current-page:当前的页数
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
      :current-page="page"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn" :title="'分类' + tip">
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
        <el-form-item prop="rolename" label="用户名">
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
      total: 0,
      page: 1,
      size: 2,
      userlist: [], //表格数据
      dialogVisible: false, //对话框显示状态
      checkedKeys: [], //编辑时的预先选中项
      tip:'',
      //表格绑定数据
      formdata: {
        roleid: "",
        username: "",
        password: "",
        status: true
      },
      //验证规则
      rules: {
        rolename: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: blur
          }
        ]
      },
      //角色列表
      rolelist: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取所有的管理员列表和页数
    async getList() {
      let res1 = await this.$http.get(this.$api.USERCOUNT);

      // console.log(res1);
      this.total = res1.list[0].total;
      console.log(this.total);
      let res = await this.$http.get(this.$api.USERLIST, {
        page: this.page,
        size: this.size
      });
      //   console.log(res);
      if (res.code == 200) {
        this.userlist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
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
    //   页面数发生变化时触发的函数 page 新的页数
    pageChange(page) {
    //   console.log(page);
      this.page = page;
      this.getList();
    },
    closeFn() {
      this.checkedKeys = [];
      this.formdata = {
        rolename: "",
        menus: [],
        status: true
      };
    },
    //   新增按钮
    addFn() {
      this.dialogVisible = true;
      this.tip="新增"
    },
    // 编辑按钮
    editFn(uid) {
      this.dialogVisible = true;
      this.tip="修改"
      this.$http.get(this.$api.USERINFO, { uid }).then(res => {
          console.log(res.list)
        if (res.code == 200) {
            this.formdata = {
                ...res.list
            }
          this.formdata.status = res.list.status == 1 ? true : false;
        }
      });
    },

    // 打开对话框的回调
    openFn() {
      this.getRoleList();
    },
    // 提交按钮
    async submit() {
      // console.log(this.$refs.tree.getCheckedKeys());

      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.uid ? this.$api.USEREDIT : this.$api.USERADD;
      console.log(url)
      let str = this.$qs.stringify(this.formdata);
      let res = await this.$http.post(url, str);
      if (res.code == 200) {
        // console.log(res)
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getList();
    },
    
    // 删除操作。
    async deleteMenu(id) {
      let res = await this.$http.post(
        this.$api.USERDELETE,
        this.$qs.stringify({ id })
      );
      if (res.code == 200) {
           this.page = 1;
          this.getList();
        this.$message.success("删除成功");
       
      } else {
        this.$message.error(res.msg);
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteMenu(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  }
};
</script>