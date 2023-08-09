import Vue from 'vue'
import VueRouter from 'vue-router'

// 0.使用路由插件
Vue.use(VueRouter)

// 1.引入路由组件:通过import方法引入
import Main from '../views/Main.vue'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Mall from '../views/Mall.vue'
import PageOne from '../views/PageOne.vue'
import PageTwo from '../views/PageTwo.vue'
import Login from '../views/Login.vue'

// 2.创建路由规则:将路由与组件一一映射
const routes = [
    // 主路由
    {
        path: '/',
        component: Main,
        name: "Main",
        // 重定向到home,
        // 解决点击首页 不能显示首页内容的问题
        redirect: '/home',
        // 嵌套路由
        children: [
            // { path: '/home', name: 'home', component: Home }, // 首页
            // { path: '/user', name: 'user', component: User }, // 用户管理
            // { path: '/mall', name: 'mall', component: Mall }, // 商品管理
            // { path: '/page1', name: 'page1', component: PageOne }, // 其他页面1
            // { path: '/page2', name: 'page2', component: PageTwo }, // 其他页面2
        ]
    },
    // 登录页面
    {
        path: '/login', name: "login", component: Login

    }
]

// 3.创建router实例,传入routes配置
const router = new VueRouter({
    routes // 缩写,等价于routes:routes
})

// 4.暴露路由器
export default router