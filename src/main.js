
import Vue from 'vue'
import App from './App'
import router from './router'
//引入api 自行操作的api接口
import api from './api'
// 提高安全性
import qs from 'qs'
// 引入css样式重置
import './assets/css/reset.css'
// 引入封装axios的get和post请求方法
import http from "./utis/http"
// 引入store，进行的登录操作。
import store from './store'

// 引入插件
import ElementUI from 'element-ui';
// 引入插件
import 'element-ui/lib/theme-chalk/index.css';
// import { prototype } from 'vue/types/umd'

// 安装插件
Vue.use(ElementUI);
// 添加到原型上
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$qs= qs
Vue.prototype.$domain= 'http://localhost:3000'






Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
