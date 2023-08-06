import Vue from 'vue'
import App from './App.vue'
// 全局引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router' // 引入路由器router
import store from './store/index'  // 默认引入index.js

// 按需引入element-ui的组件
// import { Row, Button } from 'element-ui';
// Vue.use(Row);
// Vue.use(Button);

// 全局引入
Vue.use(ElementUI)

Vue.config.productionTip = false
new Vue({
  router, // 将router挂载到vm上
  store,
  render: h => h(App),
}).$mount('#app')
