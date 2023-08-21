/**
 * 存储面包屑数据
 */

export default {
    namespaced: true,
    state: () => ({
        breadList: [{
            path: "/",
            name: "home",
            label: "首页",
            icon: "s-home",
            url: "Home/Home",
        }]
    }),
    mutations: {
        // 面包屑自己点击的跳转
        // 目前面包屑 只能跳转到首页,所以就直接清空除第一个之后的所有数据
        clearBreaList(state) {
            // 清空之前的数据,只保留首页
            state.breadList.splice(1, state.breadList.length - 1)
        },
        // 左侧菜单栏点击的跳转
        setbreadList(state, val) {
            // 清空之前的数据,只保留首页
            this.commit('m_bread/clearBreaList')

            // 一级菜单
            // 如果点击的是home不添加该数据
            if (val.length === 1 && val[0].name !== 'home') {
                state.breadList.push(val[0])
                return
            }
            // 二级菜单
            if (val.length === 2) {
                // 现将父菜单的内容存储到面包屑中
                state.breadList.push(val[1]) // 父菜单
                state.breadList.push(val[0]) // 子菜单
            }
        },
        // tab页点击的跳转
        setBreadListTab(state, val) {
            // 清空之前的数据,只保留首页
            this.commit('m_bread/clearBreaList')

            if (val.name === 'home') return

            // 判断传过来的是否为二级菜单
            // 如果是,获取该二级菜单的父菜单添加到breadlist中
            const menu = JSON.parse(localStorage.getItem('menu'))
            const hasChildren = menu.filter((item) => item.children);
            const parentMenu = hasChildren.filter((item) => {
                for (let i = 0; i < item.children.length; i++) {
                    if (item.children[i].name === val.name) {
                        return true
                        break
                    }
                }
            })
            if (parentMenu.length !== 0) {
                // 添加父菜单
                state.breadList.push(parentMenu[0])
                // 添加自己
                state.breadList.push(val)
                return
            }

            // 传过来的val是一级菜单,那么直接添加到breadlist中
            state.breadList.push(val)
        }
    },

}