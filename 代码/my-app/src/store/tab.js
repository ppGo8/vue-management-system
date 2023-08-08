// 管理左侧菜单栏
export default {
    // 开启命名空间
    namespaced: true,
    state: () => ({
        // 控制菜单展开还是收起
        isCollapse: false,
        // 和面包屑相关的数据
        tabList: [
            // 首页的面包屑必须存在
            {
                path: "/",
                name: "home",
                label: "首页",
                icon: "s-home",
                url: "Home/Home",
            }
        ],
    }),
    mutations: {
        // 修改菜单展开收起的方法
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },
        // 更新面包屑数据
        selectMenu(state, val) {
            // 判断传入的数据是否为首页
            if (val.name !== 'home') {
                // 如果原路径不在存储的面包屑数据中,才会添加
                // 使用find方法寻找,还不存在面包屑数据中会返回-1
                const index = state.tabList.findIndex(item => item.name === val.name)
                // 如果不存在
                if (index === -1) {
                    state.tabList.push(val)
                }
            }
        }
    }

}