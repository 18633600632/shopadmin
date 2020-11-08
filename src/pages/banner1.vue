<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table
      :data="bannerlist"
      row-key="id" 
    >
   
      <el-table-column
        label="轮播图标题"
        prop="title"
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
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn" :title="'分类' + tip">
      <!-- 表单 -->
      <el-form
        label-width="100px"
        :model="info"
        ref="roleform"
        :rules="rules"
      >

        <el-form-item prop="title" label="轮播图名称">
          <el-input v-model="info.title"></el-input>
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
          <el-switch v-model="info.status"></el-switch>
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
     bannerlist: [], //表格数据
      dialogVisible: false, //表单对话框显示状态
      preVisible: false, //放大图片对话库显示状态
      dialogImageUrl: "", //放大图片的地址
      //表格绑定数据
      info: {
   
        title: "",
        img: "",
        status: 1,
      },
      //验证规则
      rules: {
        title: [
          {
            required: true,
            message: "请填写轮播标题",
            trigger: blur,
          },
        ],
      },
      //顶级分类的列表
   tip: "",
dialogVisible: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // @file:上传文件信息对象 file.raw就是被上传的文件数据
    // @fileList: 上传文件列表
    fileChange(file, fileList) {
      // console.log(file,fileList);
      this.info.img = file.raw;
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
    // 关闭对话框的回调
    closeFn() {
      this.info = {
    
        title: "",
        img: "",
        status: 1,
      };
      this.fileList = [];
    },
    //   新增按钮
    addFn() {
      this.dialogVisible = true;

    },
    // 编辑按钮
    editFn(id) {
      this.dialogVisible = true;
      this.tip = "修改";
      this.$http.get(this.$api.BANNERINFO, { id }).then((res) => {
        console.log(res.list);
        if (res.code == 200) {
          this.fileList = [
            {
              name: "",
              url: "http://localhost:3000" + res.list.img,
            },
          ];
          this.info = {
            ...res.list,
          };
          this.info.id = id;
        
          this.info.status = res.list.status == 1 ? true : false;
        }
      });
    },
    // 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.BANNERDELETE, { id }).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 打开对话框的回调
    openFn() {
      // this.getTopCate();
    },
    // 提交按钮
    async submit() {

      console.log(this.info);
      let url = this.info.id ? this.$api.BANNEREDIT : this.$api.BANNERADD;
      //根据接口说明里面所需要的参数传入
     this.info.status = this.info.status ? 1 : 2;

      this.$http.upload(url, this.info).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.$message.success("操作成功");
           this.getList();
               this.dialogVisible = false;
        } else {
          this.$message.error(res.msg);
        }
    
       
      });
    },

 //1、获取商品分类数据渲染表格
async getList() {
let res = await this.$http.get(this.$api.BANNERLIST).then((res) => {
if (res.code == 200) {
console.log(res);
this.bannerlist = res.list ? res.list : [];
} else {
this.$message.error(res.msg);
}
});
},

   
  },
};
</script>