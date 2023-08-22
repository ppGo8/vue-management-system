import Vue from 'vue'
import Vuex from 'vuex'
import moduleTab from './tab.js'
import moduleAdmin from './admin.js'
import moduleBread from './bread.js'
Vue.use(Vuex)

// 创建Vuex的实例
const store = new Vuex.Store({
    modules: {
        m_tab: moduleTab,
        m_admin: moduleAdmin,
        m_bread: moduleBread
    }
})

// 暴露Vuex实例
export default store