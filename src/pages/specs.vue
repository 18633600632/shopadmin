<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <!-- 页面标题部分 -->
    <el-table :data="specslist">
      <el-table-column
        label="属性名"
        prop="specsname"
        width="200"
      ></el-table-column>
      <el-table-column  label="属性值" width="200">
      <template slot-scope="scope">
          <el-tag type="primary" v-for="(item,index) in scope.row.attrs" :key='index'>{{item}}</el-tag>
       
        </template>
        </el-table-column>

      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleDelete(scope.row.id)"
            type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn" :title="'分类' + tip">
      <!-- 表单 -->
      <el-form
        label-width="100px" :model="formdata" ref="roleform" :rules="rules">
       
        <el-form-item prop="specsname" label="属性名称">
          <el-input v-model="formdata.specsname"></el-input>
        </el-form-item>
        <el-form-item  label="属性值">
        <div v-for="(item,index) in attrsArr" :key="index">
          <el-input :style="{ width:'60%'}" v-model="item.value"></el-input>
          <el-button type="primary" v-if="index==0" @click='addAttr(index)'>新增属性值</el-button>
          <el-button type="danger" v-else @click='remAttr(index)'>删除属性值</el-button>
        </div>
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
import Vue from 'Vue'
export default {
  data() {
    return {
      specslist: [], //表格数据
      dialogVisible: false, //对话框显示状态
      checkedKeys: [], //编辑时的预先选中项
      //表格绑定数据
      formdata: {
        specsname: "",
        attrs: "",
        status: true,
      },
      // 属性值组成的
      attrsArr:[{value:""}],
      //验证规则
      rules: {
        rolename: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: blur,
          },
        ],
      },
      //角色列表
      rolelist: [],
         tip:'',
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
     // 获取所有的规格列表
    async getList() {
      let res = await this.$http.get(this.$api.SPECSLIST, {});
      console.log(res);
      if (res.code == 200) {
        this.specslist = res.list ? res.list : [];
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
    // 添加属性值
    addAttr(){
   this.attrsArr.push({value:""})
    },
    // 删除属性值
    remAttr(i){
    this.attrsArr.splice(i,1)
    },
    closeFn() {
     this.attrsArr = [{value:""}];
      this.formdata = {
        specsname: "",
        attrs: "",
        status: true
      };
    },
    //   新增按钮
    addFn() {
      this.dialogVisible = true;
      this.tip="新增"
    },
    // 编辑按钮
    editFn(id) {
      this.dialogVisible = true;
      this.tip="修改"
      this.$http.get(this.$api.SPECSINFO, { id }).then((res) => {
        console.log(res.list);
        if (res.code == 200) {
          this.formdata = {
            ...res.list[0],
          };
          // 数组改成对象。map返回对象形式。
    this.attrsArr = res.list[0].attrs.map(item=>({value:item}))
          this.formdata.status = res.list[0].status == 1 ? true : false;
        }
      });
    },

    // 删除操作。
    async deleteMenu(id) {
      let res = await this.$http.post(
        this.$api.SPECSDELETE,
        this.$qs.stringify({ id })
      );
      if (res.code == 200) {
    
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
    // 打开对话框的回调
    openFn() {
      this.getRoleList();
    },
    // 提交按钮
    async submit() {
     
      this.formdata.status = this.formdata.status ? 1 : 2;
      // map 将对象转化成字符串构成数组。
      // 用join转化为字符串
      this.formdata.attrs=this.attrsArr.map(item=>item.value).join(',')
      console.log(this.formdata.attrs);//数组，需要用join需要该字符串
      let url = this.formdata.id ? this.$api.SPECSEDIT : this.$api.SPECSADD;
      console.log(url);
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
   
  },
};
</script>