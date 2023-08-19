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
        // 菜单栏数据
        menu: [],
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
        },
        // 更改不同用户显示的菜单选项
        setMenu(state, val) {
            state.menu = val
            // 持久存储到本地,防止刷新后消失
            localStorage.setItem('menu', JSON.stringify(state.menu))
        },
        // 动态注册路由
        addMenu(state, router) {
            // 判断当前缓存中是否有数据
            if (!localStorage.getItem('menu')) return
            const menu = JSON.parse(localStorage.getItem('menu'))
            state.menu = menu
            // 组装动态路由的数据
            const menuArray = []
            menu.forEach(item => {
                if (item.children) {
                    item.children = item.children.map(item => {

                        item.component = () => import(`../views/${item.url}`)
                        return item
                    })
                    menuArray.push(...item.children)

                } else {
                    item.component = () => import(`../views/${item.url}`)
                    menuArray.push(item)
                }

            });
            // 动态添加路由
            menuArray.forEach(item => {
                router.addRoute('Main', item)
            })
        },
        // 删除tag中的数据
        closeTag(state, val) {
            const index = state.tabList.findIndex(item => item.name === val.name)
            state.tabList.splice(index, 1)
        },
    }
}