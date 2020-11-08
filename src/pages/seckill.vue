<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table :data="seckilllist" row-key="id">
      <el-table-column
        label="活动名称"
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
        <el-form-item prop="title" label="活动名称">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <!-- 时间 -->
        <el-form-item label="活动名称">
          <div class="block">
            <el-date-picker
              v-model="value1"
              value-format="timestamp"
             type="daterange"
					    range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
             @change='timechange'
            >
            </el-date-picker>
          </div>
        </el-form-item>

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
          <el-select v-model="formdata.second_cateid" placeholder="请选择"  @change="selectSecond">
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.goodsid" placeholder="请选择">
            <el-option
              v-for="item in thiredlist"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
      seckilllist: [], //表格数据
      formdata: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: true,
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      tip: "",
     //弹出框默认显示状态
      dialogVisible: false,
      // 一级分类列表 catelist
    firstlist:[],
    // 二级分类 catelist
    secondlist:[],
    // 三级分类 goodlist
    thiredlist:[],
    // 时间
        pickerOptions: {
          shortcuts: [{
           
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
         
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: [],
       
      
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //1、获取商品分类数据渲染表格
    async getList() {
      let res = await this.$http.get(this.$api.SECKLIST).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.seckilllist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //2、点击添加按钮
    addFn() {
      this.dialogVisible = true;
      this.formdata.status = this.formdata.status == 1 ? true : false;
      this.tip = "添加";
       this.value1 = [this.formdata.begintime,this.formdata.endtime]
    },
    openFn() {
          this.getFirstCateList();
          this.value1 = [];
        
    },
    //3、关闭重置表单内容
    closeFn() {
      this.formdata = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: true,
      };
  
    },
    //4、提交按钮
    submit() {
      let url = this.formdata.id ? this.$api.SECKEDIT : this.$api.SECKADD;
      //根据接口说明里面所需要的参数传入
      this.formdata.status = this.formdata.status ? 1 : 2;
      this.value1 = [this.formdata.begintime,this.formdata.endtime]
      //表单的输入验证
      this.$refs.roleform.validate((value) => {
        if (!value) {
          return false;
        }
        //调用添加/编辑接口
        this.$http.post(url, this.formdata).then((res) => {
          //console.log(res);
          //获取到新增的数据，要重新渲染
          if (res.code == 200) {
            this.$message.success("操作成功");
            //新增成功之后，重新获取最新数据
            this.getList();
            this.dialogVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    //5、 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.SECKDELETE, { id }).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //6、删除挽留事件
    handleDelete(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除指定内容,调用删除接口
          this.deleteFn(id);
        })
        .catch(() => {});
    },

    //7、编辑事件
    editFn(id) {
      this.dialogVisible = true;
      this.tip = "修改";
      //把数据传进来
      this.$http.get(this.$api.SECKINFO, { id }).then((res) => {
        //console.log(res);
        if (res.code == 200) {
        
          this.formdata = {
            ...res.list,
          };
          this.formdata.id = id;
          //获取商品信息获取 二级分类列表
          this.selectFirst(this.formdata.first_cateid);
          this.selectSecond(this.formdata.second_cateid)
          this.formdata.status = res.list.status == 1 ? true : false;
          this.value1 = [this.formdata.begintime,this.formdata.endtime]
        }
      });
    },
    // 打开对话框时需要一级分类列表 pid 作为参数 pid 为 0 就是一节分类
    async getFirstCateList() {
      // 请求一级商品从catelist中获取
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
    // 三级分类，用goodslist商品下的goodsname
    selectSecond(){
            this.$http.get(this.$api.GOODSLIST,{fid:this.formdata.first_cateid,sid:this.formdata.second_cateid}).then(res=>{
                this.thiredlist = res.list ? res.list : [];
            })
        },
   
    // 时间
    timechange(event){
         this.formdata.begintime = event[0];
         this.formdata.endtime = event[1];
    },
    handleRemove() {},

  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>