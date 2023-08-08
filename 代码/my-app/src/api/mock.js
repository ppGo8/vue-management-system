import Mock from 'mockjs'
import homeApi from './mockServeData/home'
import user from './mockServeData/user'
// 定义mock请求拦截

// 获取首页的数据
Mock.mock('/api/home/getData', homeApi.getStatisticalData)

// 获取用户列表的数据
Mock.mock('/api/user/add', 'post', user.createUser)
Mock.mock('/api/user/edit', 'post', user.updateUser)
Mock.mock('/api/user/del', 'post', user.deleteUser)
// 写成正则的形式,可以匹配到携带参数的路径
Mock.mock(/api\/user\/getUser/, user.getUserList)
