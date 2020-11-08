<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn" style="margin-bottom:20px">添加</el-button>
    <el-table :data="rolelist">
      <el-table-column label="角色名称" prop="rolename" width="200"></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" @click="handleRoleDelete(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn" :title="'分类' + tip">
      <!-- 表单 -->
      <el-form label-width="100px" :model="formdata" ref="roleform" :rules="rules">
        <el-form-item prop="rolename" label="角色名称">
          <el-input v-model="formdata.rolename"></el-input>
        </el-form-item>
        <el-form-item prop="menus" label="菜单权限">
          <!-- 
                data:绑定的数组数据
                show-checkbox:是否显示选择框
                node-key:节点key 标识节点（选择时使用）

                :default-expanded-keys="[2, 3]"
                


                props:数状结构设置
                        children：数组结构子节点的数据名称
                        label:每一项的文本的属性
          -->
          <el-tree
            check-strictly
            ref="tree"
            :data="menulist"
            show-checkbox
            :default-checked-keys="checkedKeys"
            node-key="id"
            :props="{
                     children: 'children',
                     label: 'title'
                }"
          ></el-tree>
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
      rolelist: [], //表格数据
      dialogVisible: false, //对话框显示状态
      checkedKeys: [], //编辑时的预先选中项
      //表格绑定数据
      formdata: {
        rolename: "",
        menus: [],
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
         tip:'',
      //树状组件使用的菜单数据
      menulist: []

    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取后台数据渲染列表
    async getList() {
      let res = await this.$http.get(this.$api.ROLELIST);
      console.log(res);
      if (res.code == 200) {
        this.rolelist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    async getMenuList() {
      let res = await this.$http.get(this.$api.MENULIST, { istree: true });
      if (res.code == 200) {
        console.log(res);
        this.menulist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
  
    // 编辑按钮
    editFn(id) {
      this.dialogVisible = true;
      this.tip="修改"
      this.$http.get(this.$api.ROLEINFO, { id }).then(res => {
        if (res.code == 200) {
          console.log(res);
          this.formdata.menus = res.list ? res.list.menus.split(",") : [];
          console.log(this.formdata.menus);
          this.checkedKeys = res.list ? res.list.menus.split(",") : [];
          this.formdata.rolename = res.list.rolename;
          this.formdata.status = res.list.status == 1 ? true : false;
          // 点击编辑添加id属性
          this.formdata.id = id;
          console.log(this.formdata.menus);
        }
      });
    },
    //   新增按钮
    addFn() {
      this.dialogVisible = true;
      this.tip="新增"
    },
          // 关闭按钮
    closeFn() {
      this.checkedKeys = [];
      this.formdata = {
        rolename: "",
        menus: [],
        status: true
      };
    },
    // 删除按钮
       async deleteRole(id) {
      let res = await this.$http.post(
        this.$api.ROLEDELETE,
        this.$qs.stringify({ id })
      );
      if (res.code == 200) {
          this.getList();
        this.$message.success("删除成功");
        console.log(res);
       
      } else {
        this.$message.error(res.msg);
      }
    },

    
    handleRoleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteRole(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 打开对话框的回调
    openFn() {
      this.getMenuList();
    },
    // 提交按钮
    async submit() {
      // console.log(this.$refs.tree.getCheckedKeys());

      // 被选中项的id构成的数组
      this.formdata.menus = this.$refs.tree.getCheckedKeys().join(",");
      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.id ? this.$api.ROLEEDIT : this.$api.ROLEADD;
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
    
  }
};
</script>