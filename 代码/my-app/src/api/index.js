import http from '../utils/request'

// 定义前端API

// 请求首页数据
export const getData = () => {
    // 返回promise对象
    return http.get('/home/getData')
}

// 用户页相关操作
export const getUser = (params) => {
    console.log(params, 'params')
    // 返回用户列表
    return http.get('/user/getUser', params)
}

export const addUser = (data) => {
    // 新增用户数据
    return http.post('user/add', data)
}

export const editUser = (data) => {
    // 新增用户数据
    return http.post('user/edit', data)
}

export const delUser = (data) => {
    // 删除用户数据
    return http.post('/user/del', data)
}

export const getMenu = (data) => {
    return http.post('/permission/getMenu', data)
}
