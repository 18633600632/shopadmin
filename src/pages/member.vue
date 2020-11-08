<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员修改</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-button type="primary" @click="addFn">添加</el-button> -->
    <el-table
      :data="memberlist"
      row-key="id" 
    >
   
      <el-table-column
        label="昵称"
        prop="nickname"
        width="150"
      ></el-table-column>
      <el-table-column
        label="手机号"
        prop="phone"
        width="150"
      ></el-table-column>
       <el-table-column label="注册日期" width="180">
         <template slot-scope="scope">
            <span>{{ scope.row.addtime | format }}</span>
          </template>
          </el-table-column>
          <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="editFn(scope.row.uid)">编辑</el-button>
          
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn" :title="'会员' + tip">
      <!-- 表单 -->
      <el-form
        label-width="100px"
        :model="formdata"
        ref="roleform"
        :rules="rules"
      >

        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="formdata.nickname" disabled></el-input>
        </el-form-item>
       <el-form-item prop="phone" label="手机号">
          <el-input v-model="formdata.phone" ></el-input>
        </el-form-item>
          <el-form-item prop="password" label="密码">
          <el-input v-model="formdata.password" type='password'></el-input>
          <span>不填写则不修改密码</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit(formdata)">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
  
       memberlist: [], //表格数据
      formdata: {
                 uid:'',
                nickname:'',
                phone:'',
                password:'',
                status: true
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
      dialogVisible: false,
    };
  },
  mounted() {
    this.getList();
  },
  filters:{
     // 时间戳转为日期。
    format(time){
       // 返回日期格式为：2020-03-19 11:05:09
            var d = new Date(parseInt(time));
            var year = d.getFullYear();//获取年份
            var month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1);//获取月份
            var date = d.getDate() > 9 ? d.getDate() : '0' + d.getDate();//获取日期
            var hours = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();//获取小时
            var minutes = d.getMinutes() > 9 ? d.getMinutes() :'0' + d.getMinutes();//获取分钟
            var seconds = d.getSeconds() > 9 ? d.getSeconds() :'0' + d.getSeconds();//获取秒
            return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    },
  },
  methods: {
   
    //1、获取商品分类数据渲染表格
    async getList() {
      let res = await this.$http.get(this.$api.MEMBERLIST).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.memberlist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },

  
    openFn(){},
    //3、关闭重置表单内容
    closeFn() {
       this.infoVisible = false;  
      this.formdata = {
                uid:'',
                nickname:'',
                phone:'',
                password:'',
                status: 1
      };
   
    },
    //4、提交按钮
   async submit() {
     let url = this.$api.MEMBEREDIT;
      this.formdata.status = this.formdata.status ? 1 : 2;

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
  
    //7、编辑事件
    editFn(uid) {
      this.dialogVisible = true;
      this.tip = "修改";
      console.log(uid);
      //把数据传进来
      this.$http.get(this.$api.MEMBERINFO, { uid }).then((res) => {
        console.log(res.list);
        if (res.code == 200) {
         this.formdata = {
            ...res.list
          };
           
          this.formdata.status = res.list.status == 1 ? true : false;
        }
      });
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