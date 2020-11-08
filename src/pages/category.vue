<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table
      :data="catelist"
      row-key="id"
      :tree-props="{
        children: 'children',
        hasChildren: 'hasChildren',
      }"
    >
      <!-- 每一列
    label:列表头
    prop:这一列关联的数据的key：只想显示文本。
    不显示文本：<template slot-scope="scope">
          <i :class='scope.row.icon '></i>
          </template>
    tree-props:属性数据配置
    children：属性解构数据key名称
    hasChildren：拥有属性解构
     -->
      <el-table-column
        label="分类名称"
        prop="catename"
        width="200"
      ></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1"
            >启用</el-tag
          >
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" @click="deleteFn(scope.row.id)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      @open="openFn"
      @close="closeFn"
      :title="'分类' + tip"
    >
      <!-- 表单 -->
      <el-form
        label-width="100px"
        :model="formdata"
        ref="roleform"
        :rules="rules"
      >
        <el-form-item prop="rolename" label="上级分类">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.pid" placeholder="请选择">
            <el-option key="0" label="顶级分类" value="0"></el-option>
            <el-option
              v-for="item in topCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="catename" label="分类名称">
          <el-input v-model="formdata.catename"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <!-- 上传组件主题
                action:自动上传的地址
                auto-upload: 是否自动上传
                list-type:照片墙
                on-preview:设置预览时的 回调函数
                on-remove:设置移除时的 回调函数
                on-change:设置选择上传图片时的回调函数
           -->
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 放大图片设置 
            visible：显示状态
            apped-to-body:多个对话框的堆叠顺序问题
          -->
          <el-dialog :visible.sync="preVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
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
      fileList: [], //上传文件列表
      catelist: [], //表格数据
      //表单对话框显示状态
      preVisible: false, //放大图片对话库显示状态
      dialogImageUrl: "", //放大图片的地址
      //表格绑定数据
      formdata: {
        pid: "",
        catename: "",
        img: "",
        status: true,
      },

      //验证规则
      rules: {
        catename: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: blur,
          },
        ],
      },
      //顶级分类的列表
      topCate: [],
      tip: "",
      dialogVisible: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 1.获取树状结构 表格数据
    async getList() {
      let res = await this.$http.get(this.$api.CATELIST, {
        istree: true,
      });
      console.log(res);
      if (res.code == 200) {
        this.catelist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    //2. 获取获取顶级分类
    async getTopCate() {
      let res = await this.$http.get(this.$api.CATELIST, {
        pid: 0,
      });
      console.log(res);
      if (res.code == 200) {
        this.topCate = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    //  点击 新增按钮
    addFn() {
      this.dialogVisible = true;
      this.formdata.status = this.formdata.status == 1 ? true : false;
      this.tip = "添加";
    },
    // 关闭对话框的回调
    closeFn() {
      this.formdata = {
        pid: "",
        catename: "",
        img: "",
        status: 1,
      };
      this.fileList = [];
    },
    // 打开对话框的回调
    openFn() {
      this.getTopCate();
    },
    // 提交按钮
    async submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.id ? this.$api.CATEEDIT : this.$api.CATEADD;
      //表单的输入验证
      this.$refs.roleform.validate((value) => {
        if (!value) {
          return false;
        }
        // 调用添加接口
        this.$http.upload(url, this.formdata).then((res) => {
          if (res.code == 200) {
            // console.log(res)
            this.$message.success("操作成功");
            //新增成功之后，重新获取最新数据
            this.dialogVisible = false;
            this.getList();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },

    // 编辑按钮
    editFn(id) {
      this.dialogVisible = true;
      this.tip = "修改";
      this.$http.get(this.$api.CATEINFO, { id }).then((res) => {
        console.log(res.list);
        if (res.code == 200) {
          // 判断一级目录为空则不显示图片。
          if(res.list.img){
          this.fileList = [
            {
              name: "",
              url: "http://localhost:3000" + res.list.img,
            },
          ];}
          this.formdata = {
            ...res.list,
          };
          this.formdata.id = id;
          this.formdata.status = res.list.status == 1 ? true : false;
        }
      });
    },
    // 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.CATEDELETE, { id }).then((res) => {
        if (res.code == 200) {
          this.page = 1;
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // @file:上传文件信息对象 file.raw就是被上传的文件数据
    // @fileList: 上传文件列表
    fileChange(file, fileList) {
      // console.log(file,fileList);
      this.formdata.img = file.raw;
    },
    // file：选中的上传图片对象
    handlePreview(file) {
      // console.log("handlePreview")
      this.dialogImageUrl = file.url; // 设置放大图片地址
      this.preVisible = true; //显示放大框
    },
    handleRemove() {
      console.log("handlermove");
    },
  },
};
</script>