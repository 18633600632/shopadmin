import Vue from "vue"
import Vuex from "vuex"
import http from "./../utis/http"
import router from "./../router"
import { Message } from 'element-ui';
Vue.use(Vuex)
// vuex配置对象
export default new Vuex.Store({
    state: {
        // 保存token  因为vuex刷新数据就没没了，所以需要保存
        // 如果localStorage有 token说明已登录，没有则是没有登录
        token:localStorage.getItem("token")?localStorage.getItem("token"):"",
        // info登录用户信息 字符串转换为对象
        info: localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")):{}
    },
    mutations: {
        // 保存登录数据
        // payload有两个属性:token && info
        setInfo(state, payload) {//修改
            // 设置信息 
            console.log(payload)
            // 数据在 vuex 随着页面刷新而重置，保存一份在localStorage中
            localStorage.setItem("token", payload.token);
            localStorage.setItem("info", JSON.stringify(payload.info));
            state.token = payload.token;//
            state.info = payload.info;
        },
        // 清空登录信息，登出操作。
        clearInfo(state) {
            localStorage.clear();
            state.token = "";
            state.info = {};
        }
    },
    // 异步操作 怎么样在非组件中进行跳转
    actions: {
        userLogin(context, payload) {
            console.log(payload)//是一个对象
            http.post("/api/userlogin", payload).then(res => {
                console.log(res)
                // 登录成功
                if (res.code == 200) {
                    context.commit("setInfo",{token:res.list.token,info:res.list});
                    router.replace("/index")
                } else {
                  Message.error(res.msg)
                }
            })
        }
    }
})
