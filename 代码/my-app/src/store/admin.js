/**
 * @描述:存储解析token后得到的用户信息
 */
const types = {
    SET_AUTHENTICATED: 'SET_AUTHENTICATED',
    SET_USER: 'SET_USER',
}

const state = {
    // 是否授权,默认否
    isAuthenticated: false,
    user: {}

}

const getters = {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,

}

const mutations = {
    // 前面的types是帮助在vue开发者工具中显示的
    // 操作时,会在vue开发者工具左侧显示types指定的名字
    [types.SET_AUTHENTICATED](state, isAuthenticated) {
        // 如果有授权,那么就将值存储到state中
        if (isAuthenticated) {
            state.isAuthenticated = isAuthenticated
        } else {
            state.isAuthenticated = false
        }
    },

    [types.SET_USER](state, user) {
        if (user) {
            state.user = user
        }
    }
}

const actions = {
    // 对象函数普通写法
    setAuthenticated: ({ commit }, isAuthenticated) => {
        commit(types.SET_AUTHENTICATED, isAuthenticated)
    },
    setUser: ({ commit }, user) => {
        commit(types.SET_USER, user)
    }
}


const adminModule = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}

export default adminModule