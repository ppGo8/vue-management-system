// 管理左侧菜单栏
export default {
    // 开启命名空间
    namespaced: true,
    state: () => ({
        isCollapse: false
    }),
    mutations: {
        // 修改菜单展开收起的方法
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        }
    }

}