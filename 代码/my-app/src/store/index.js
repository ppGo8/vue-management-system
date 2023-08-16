import Vue from 'vue'
import Vuex from 'vuex'
import moduleTab from '@/store/tab.js'
import moduleAdmin from '@/store/admin.js'
Vue.use(Vuex)

// 创建Vuex的实例
const store = new Vuex.Store({
    modules: {
        m_tab: moduleTab,
        m_admin: moduleAdmin,
    }
})

// 暴露Vuex实例
export default store