import Mock from 'mockjs'
import homeApi from './mockServeData/home'

// 定义mock请求拦截
Mock.mock('/api/home/getData', homeApi.getStatisticalData)
