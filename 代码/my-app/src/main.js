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
// 引入二次封装的axios
import axios from './utils/http.js'

// 按需引入element-ui的组件
// import { Row, Button } from 'element-ui';
// Vue.use(Row);
// Vue.use(Button);

// 全局引入
Vue.use(ElementUI)

Vue.prototype.$axios = axios;


Vue.config.productionTip = false
new Vue({
  router, // 将router挂载到vm上
  store,
  render: h => h(App),
  // 解决：动态路由,页面刷新导致变空白的问题
  created() {
    store.commit('m_tab/addMenu', this.$router)
  }
}).$mount('#app')
