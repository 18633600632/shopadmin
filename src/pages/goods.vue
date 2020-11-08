<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table :data="goodslist">
      <el-table-column
        label="一级分类"
        prop="firstcatename"
        width="100"
      ></el-table-column>
      <el-table-column
        label="二级分类"
        prop="secondcatename"
        width="100"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        prop="goodsname"
        width="100"
      ></el-table-column>
      <el-table-column
        label="销售价"
        prop="price"
        width="150"
      ></el-table-column>
      <el-table-column
        label="市场价"
        prop="market_price"
        width="150"
      ></el-table-column>
      <el-table-column label="状态" width="150">
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
    <el-dialog
      :visible.sync="dialogVisible"
      @open="openFn"
      @close="closeFn"
      @opened="openedFn"
      :title="'分类' + tip"
    >
      <!-- 表单 -->
      <el-form
        label-width="100px"
        :model="formdata"
        ref="roleform"
       
      >
        <el-form-item label="一级分类">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select
            @change="selectFirst"
            v-model="formdata.first_cateid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in firstlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.second_cateid" placeholder="请选择">
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsname" label="商品名">
          <el-input v-model="formdata.goodsname"></el-input>
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
        <!--  -->
        <el-form-item label="商品规格">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select
            v-model="formdata.specsid"
            placeholder="请选择"
            @change="selectSpecs"
          >
            <el-option
              v-for="item in specslist"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="rolename" label="商品规格属性">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.specsattr" multiple placeholder="请选择">
            <el-option
              v-for="item in attrs"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="price" label="销售价">
          <el-input type="number" v-model="formdata.price"></el-input>
        </el-form-item>
        <el-form-item prop="market_price" label="市场价">
          <el-input type="number" v-model="formdata.market_price"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="formdata.ishot" :label="1">是</el-radio>
          <el-radio v-model="formdata.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="formdata.isnew" :label="1">是</el-radio>
          <el-radio v-model="formdata.isnew" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio v-model="formdata.status" :label="1">上架</el-radio>
          <el-radio v-model="formdata.status" :label="2">下架</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <div id="editor"></div>
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
import E from "wangeditor";
export default {
  data() {
    return {
      total: 0,
      page: 1,
      size: 2,
      preVisible: false,
      tip:"",
      dialogImageUrl: "",
      fileList: [],
      goodslist: [], //表格数据
      dialogVisible: false, //对话框显示状态
          // 富文本编译器实例
            editor: null,
      //表格绑定数据
      formdata: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      // //验证规则
      // rules: {
      //   rolename: [
      //     {
      //       required: true,
      //       message: "请填写角色名称",
      //       trigger: blur,
      //     },
      //   ],
      // },
      //一级分类列表
      firstlist: [],
      //   二级分类列表
      secondlist: [],
      //   属性列表
      specslist: [],
      //   属性值列表
      attrs: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
     // 获取所有的管理员列表和页数
    async getList() {
      let res1 = await this.$http.get(this.$api.GOODSCOUNT);

      //   console.log(res1);
      this.total = res1.list[0].total;
      console.log(this.total);
      let res = await this.$http.get(this.$api.GOODSLIST, {
        page: this.page,
        size: this.size,
      });
      console.log(res);
      if (res.code == 200) {
        this.goodslist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    // 打开对话框时需要一级分类列表 pid 作为参数 pid 为 0 就是一节分类
    async getFirstCateList() {
      let res = await this.$http.get(this.$api.CATELIST, { pid: 0 });
      let res1 = await this.$http.get(this.$api.SPECSLIST);
      console.log(res, res1);
      if (res.code == 200 && res1.code == 200) {
        this.firstlist = res.list ? res.list : [];
        this.specslist = res1.list ? res1.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    // 切换一级分类分类，已一级分类id 作为pid 获取二级分类
    selectFirst(pid) {
      this.$http.get(this.$api.CATELIST, { pid }).then((res) => {
        console.log(res);
        this.secondlist = res.list;
      });
    },
    
    // 关闭时还原数据
    closeFn() {
      this.formdata = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      this.fileList = [];
      this.editor = null;
      document.getElementById("editor").innerHTML = ""; //重置富文本编辑器的html内容
    },
    // 打开对话框的回调
    openFn() {
      this.getFirstCateList();
      // console.log('open');
    },
    // 打开富文本编辑器，创建dom，确保在其他更新之后
    openedFn() {
      this.editor = new E("#editor");
      this.editor.config.onchange = (newHtml) => {
        console.log("change 之后最新的 html", newHtml);
        this.formdata.description = newHtml;
      };
      this.editor.create();
       //返回的数据设置为 富文本编辑框的内容
          this.editor.txt.html(this.formdata.description);
    },
    //   新增按钮
    addFn() {
      this.dialogVisible = true;
            this.tip="新增"
    },

    
    // 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.GOODSDELETE, { id }).then((res) => {
        if (res.code == 200) {
          this.page = 1;
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    
    // 编辑按钮
    editFn(id) {
      this.dialogVisible = true;
       this.tip="修改"
      this.$http.get(this.$api.GOODSINFO, { id }).then((res) => {
        console.log(res.list);
        if (res.code == 200) {
          this.formdata = {
            ...res.list,
          };
          this.formdata.id = id;
          //获取商品信息获取 二级分类列表
          this.selectFirst(this.formdata.first_cateid);
          this.attrs = this.formdata.specsattr.split(",");
          this.formdata.specsattr = this.formdata.specsattr.split(",");
          //   点击编辑时显示图片
          this.fileList = [{ name: "", url: this.$domain + this.formdata.img }];
       
         
        }
      });
    },
    // 提交按钮
    async submit() {
      // console.log(this.formdata.id);
      let url = this.formdata.id ? this.$api.GOODSEDIT : this.$api.GOODSADD;
      console.log(this.formdata.specsattr);
      this.formdata.specsattr = this.formdata.specsattr.join(",");
      console.log(this.formdata);
      let res = await this.$http.upload(url, this.formdata);
      if (res.code == 200) {
        // console.log(res)
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getList();
    },
   // 将属性的id 作为参数传入，找到对应的属性，获取它的属性值
    selectSpecs(id) {
      this.attrs = this.specslist.find((item) => item.id == id).attrs;
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
    //   页面数发生变化时触发的函数 page 新的页数
    pageChange(page) {
      //   console.log(page);
      this.page = page;
      this.getList();
    },
  },
};
</script>