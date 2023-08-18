import axios from 'axios'
import { Loading, Message } from 'element-ui';
import Cookie from "js-cookie";
import router from '../router/index.js'

//  设置加载动画的返回值
let loading
// 请求拦截
axios.interceptors.request.use(config => {
    // 文件上传时有进度条,因此不显示加载东安湖
    if (config.url !== '/api/upload') {
        // 发送请求时,设置全屏加载动画
        loading = Loading.service({
            lock: true,
            text: '拼命加载中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })
    }

    // 有token就携带token发送请求
    if (Cookie.get('token')) {
        // 设置统一token
        config.headers.Authorization = Cookie.get('token')
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截
axios.interceptors.response.use(config => {
    if (loading) {
        loading.close()
    }
    // token是否过期
    const { status } = config.data
    if (status === 200) {
        return Promise.resolve(config)
    }
    if (status === 401) {
        Message.error('token失效请重新登录! 3s后自动跳转!')
        // 移除失效token
        Cookie.remove('token')
        // 跳转到首页   
        setTimeout(function () { router.push('/login') }, 3000)
        return Promise.reject(config)
    } else {
        return Promise.resolve(config)
    }
}, error => {
    // 关闭加载动画
    if (loading) {
        loading.close()
    }

    return Promise.reject(error)
})

export default axios