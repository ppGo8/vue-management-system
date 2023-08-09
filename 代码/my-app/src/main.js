import Vue from 'vue'
import App from './App.vue'
// 全局引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// 引入路由器router
import router from './router'
// 引入Vuex
import store from './store'
import './api/mock'
import Cookie from 'js-cookie'

// 按需引入element-ui的组件
// import { Row, Button } from 'element-ui';
// Vue.use(Row);
// Vue.use(Button);

// 全局引入
Vue.use(ElementUI)


// 添加全局前置导航守卫
router.beforeEach((to, from, next) => {
  // 拿到token
  const token = Cookie.get('token')
  // token不存在,且用户即将进入网页不是login
  if (!token && to.name !== 'login') {
    // 给用户跳转到登录页
    next({
      name: 'login' // 在路由js中为路由配置的名字
    })
  }
  // token存在,且用户即将进入的网页是login
  else if (token && to.name === "login") {
    // 给用户跳转到首页
    // next({ name: 'home' })
    // 给用户跳转的原路径：
    next({ name: from.name })
  } else {
    // 执行后续的逻辑
    next()
  }
})


Vue.config.productionTip = false
new Vue({
  router, // 将router挂载到vm上
  store,
  render: h => h(App),
  // 解决：动态路由,页面刷新导致变空白的问题
  created() {
    store.commit('m_tab/addMenu', router)
  }
}).$mount('#app')
