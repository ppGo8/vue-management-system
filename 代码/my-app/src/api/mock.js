import Mock from 'mockjs'
import homeApi from './mockServeData/home'


// 定义mock请求拦截

// 获取首页的数据
Mock.mock('/api/home/getData', homeApi.getStatisticalData)
