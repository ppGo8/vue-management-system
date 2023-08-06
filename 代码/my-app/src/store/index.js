import Vue from 'vue'
import Vuex from 'vuex'
import moduleTab from '@/store/tab.js'

Vue.use(Vuex)

// 创建Vuex的实例
const store = new Vuex.Store({
    modules: {
        m_tab: moduleTab
    }
})

// 暴露Vuex实例
export default store