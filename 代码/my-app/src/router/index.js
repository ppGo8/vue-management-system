import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookie from 'js-cookie'

// 0.使用路由插件
Vue.use(VueRouter)

// 1.引入路由组件:通过import动态导入;其他注释的路由组件由后端传过来动态导入
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')

const Main = () => import(/* webpackChunkName: "group-index" */'../views/Main.vue')
// const Home = () => import(/* webpackChunkName: "group-index" */'../views/Home.vue')

// const NotFound = () => import(/* webpackChunkName: "group-other" */'../views/404.vue')
const InfoShow = () => import(/* webpackChunkName: "group-other" */'../views/InfoShow.vue')

// const User = () => import(/* webpackChunkName: "group-user" */'../views/User.vue')

// const FundList = () => import(/* webpackChunkName: "group-fund"*/ '../views/FundList.vue')

// const PageOne = () => import(/* webpackChunkName: "group-page" */'../views/PageOne.vue')
// const PageTwo = () => import(/* webpackChunkName: "group-page" */'../views/PageTwo.vue')

// const UploadFile = () => import(/* webpackChunkName: "group-file" */'../views/UploadFile.vue')
// const ExcelUpload = () => import(/* webpackChunkName: "group-file" */'../views/ExcelUpload.vue')
// const ExcelExport = () => import(/* webpackChunkName: "group-file" */'../views/ExcelExport.vue')


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
        // 嵌套路由,下面的路由修改为了动态显示
        children: [
            { path: '/infoshow', name: 'infoshow', component: InfoShow }
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
    },
    // 注册页面
    {
        path: '/register', name: 'register', component: Register
    },
    // 404路由;动态添加,因为导致了刷新报错
    // {
    //     path: '*', name: '404', component: NotFound
    // }
]

// 3.创建router实例,传入routes配置
const router = new VueRouter({
    mode: 'hash', // 防止上线后项目刷新导致404
    routes // 缩写,等价于routes:routes
})

// 添加全局前置导航守卫
router.beforeEach((to, from, next) => {
    const token = Cookie.get('token')
    // token不存在,可以进入注册页
    if (!token && to.name === 'register') {
        next()
    }
    // token不存在,可以进入登陆页面
    else if (!token && to.name !== 'login') {
        // 给用户跳转到登录页
        next({
            name: 'login' // 在路由js中为路由配置的名字
        })
    }
    // token存在,禁止进入登录页,只能留在原页面
    else if (token && to.name === "login") {
        // 给用户跳转到首页
        // next({ name: 'home' })
        // 给用户跳转的原路径：
        next({ name: from.name })
    }
    // 其他情况,进行正常跳转
    else {
        // 执行后续的逻辑
        next()
    }
})


// 4.暴露路由器
export default router 