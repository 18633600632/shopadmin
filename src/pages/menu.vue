<template>
  <div>
    <!-- 1.面包屑导航 -->
    <!-- separator ：分隔符 -->
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>

    <!-- 表格列表 
    data：表格渲染数据
     row-key="id"：行标识
     :tree-props：属性数据配置
                  属性结构的子数据key名称
      hasChildren：拥有属性解构
    -->
    <el-table
      :data="menulist"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  
      @edit="editFn"
      :title="'分类' + tip"
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
      <el-table-column label="名称" width="180" prop="title"> </el-table-column>
      <el-table-column label="图标" width="180">
        <!-- 当前这一列的数据
      scope ：代表包含每一行数据对象
        row：行
      changeMenu
      显示数据文本：用props
      显示样式用插槽
      -->
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>

      <el-table-column label="类型" width="180">
        <!-- 类型， -->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="success">菜单</el-tag>
        </template>
      </el-table-column>
      <!-- 菜单url -->
      <el-table-column label="URL" width="180" prop="url"> </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
        open:打开对话框时触发的回调（请求顶级菜单的数据）
        close:关闭对话库重置表单内容
    -->
    <!-- 点击打开对话框 -->
    <el-dialog
      title="新增菜单"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getTop"
      @close="reset"
    >
      <el-form
        label-width="100px"
        :rules="rules"
        :model="formdata"
        ref="menuform"
      >
        <!-- lebel:表单域文本 -->
        <el-form-item label="菜单名称">
          <!-- {{formdata.pid}} -->
          <el-select
            v-model="formdata.pid"
            placeholder="请选择"
            @change="changeMenu"
          >
            <!-- key:标识
                label:选择项的文本
                value:当前项被选中的value (v-model绑定的值变成选中项的value)
             子项的pid就是父项的id
            -->

            <el-option :key="0" label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in topmenu"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <!-- 通过pid 的值来判断 显示的输入框 -->
        <el-form-item label="菜单图标" v-if="formdata.pid == 0">
          <el-input v-model="formdata.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" v-else>
          <el-input v-model="formdata.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio
            v-model="formdata.type"
            :disabled="formdata.type !== 1"
            :label="1"
            >目录</el-radio
          >
          <el-radio
            v-model="formdata.type"
            :disabled="formdata.type === 1"
            :label="2"
            >菜单</el-radio
          >
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态">
          <!-- <p>{{formdata.status}}</p> -->
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格数据
      menulist: [],
      // 点击按钮切换标题
      tip: "",
      //表单内容
      formdata: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: true,
      },
      //弹出框默认显示状态
      dialogVisible: false,
      topmenu: [], //顶层菜单
      rules: {
        title: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur", //失去焦点时验证。
          },
        ],
      },
    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    // 获取属性解构的所有菜单
    getList() {
      this.$http.get(this.$api.MENULIST, { istree: true }).then((res) => {
        if (res.code == 200) {
          // 若没有则请求空
          this.menulist = res.list ? res.list : [];
          console.log(res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 打开之后获取顶级菜单
    getTop() {
      this.$http.get(this.$api.MENULIST, { pid: 0 }).then((res) => {
        if (res.code == 200) {
          this.topmenu = res.list ? res.list : [];
          console.log(res);
        } else {
          this.$message.error(res.msg);
        } 
      });
    },
      // 切换菜单名称时单选框切换 目录 菜单 
    changeMenu(pid) {
      // console.log(pid);
      this.formdata.type = pid > 0 ? 2 : 1;
    },
    //   点击编辑按钮触发自定事件的事件处理函数
    editFn(row) {
      this.dialogVisible = true;
      this.tip = "修改";
      console.log(row);
      // 向formdata添加id属性
      this.formdata = {
        ...row,
      };
      this.formdata.status = this.formdata.status == 1 ? true : false;
    },
    // 重置 关闭时触发reset重置表单内容。
    reset() {
      this.formdata = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: true,
      };
    },
    // 提交事件
    submit() {
      // 提交事件
      // 判断是编辑打开还是新增打开
      let url = this.formdata.id ? this.$api.MENUEDIT : this.$api.MENUADD; //点击编辑按钮时才会有id
      this.formdata.status = this.formdata.status ? 1 : 2;
      console.log(this.formdata);
      // 进行验证。value：验证是否通过的布尔值。通过之后准备提交。
        //  this.$refs[form]：利用传入的ref值，获取el-form组件,调用验证函数
      //  利用传入的ref值，调用表单组件的验证方法
      this.$refs.menuform.validate((value) => {
        if (!value) {
          return false;
        }
        this.$http.post(url, this.formdata).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getList(); //获取最新列表数据
            this.dialogVisible = false; //关闭对话框
          }
        });
      });
    },
    // 删除操作。
    async deleteMenu(id) {
      let res = await this.$http.post(
        this.$api.MENUDELETE,
        this.$qs.stringify({ id })
        // 对象解构 qs.stringify()将对象 序列化成URL的形式
      );
      if (res.code == 200) {
        // 重新渲染数据。
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
  
   
  },
};
</script>
<style lang="less">
div {
  .el-breadcrumb {
    margin-bottom: 20px;
  }
}
</style>