import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import lazout from '@/pages/lazout'
import index from '@/pages/index'
import role from '@/pages/role'
import user from '@/pages/user'
import member from '@/pages/member'
import seckill from '@/pages/seckill'

// import menu from '@/pages/menu'
const menu = () => import("@/pages/menu")
// import { component } from 'vue/types/umd'
import category from '@/pages/category'
import goods from '@/pages/goods'

let specs = () => import( /*webpackChunkName: 'group-a' */ "@/pages/specs")
let banner = () => import( /*webpackChunkName: 'group-a' */ "@/pages/banner")


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: login
    }, {
      path: '/',
      component: lazout,
      children: [{
        path: 'index',
        component: index
      }, {
        path: 'menu',
        component: menu
      }, {
        path: 'role',
        component: role
      }, {
        path: 'user',
        component: user
      }, {
        path: 'category',
        component: category
      }, {
        path: 'member',
        component: member
      }, {
        path: 'specs',
        component: specs
      }, {
        path: 'goods',
        component: goods
      }, {
        path: 'banner',
        component: banner
      }, {
        path: 'seckill',
        component: seckill
      }, {
        path: '*',
        redirect: "/index"
      }]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 拿登录信息 存在直接拿值
  let token = localStorage.getItem("token");
  //已经登陆
  if (token) {
    //在保存的info里查看menus_url所允许去的路径（页面）
    let menus_url = JSON.parse(localStorage.getItem('info')).menus_url
    if (to.path == '/login') {
   
      // 已登录，不能再去登录页
      next(false)
    }
    else {
      console.log(menus_url);
      //已登录权限控制，比如客服登陆不能进入管理员的权限
      // 当前的地址和要去的地址在权限地址里，则为true,没有则为false。
      let flag = menus_url.some(item => to.path == item);//找到就是true
      console.log(flag)
      if (flag) {
        // 为true 则去跳转，没有则强制回到首页。
        next()
      } else {
        // 为false则返回首页。
        next(false)
      }
      // next()
    }
  } else {
    // 未登陆 如果在登录页，登陆
    if (to.path == '/login') {
      next()
    } else {
      // 未登陆 未在登录页，去登陆页
      next('/login')
    }
  }

})
export default router
