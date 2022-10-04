import { createStore } from "vuex"
import { App } from "vue"
import { getUserInfo } from "@/request/api";

interface MenuObj {
  parentId: number
  id: number
  children?: MenuObj[]
}

interface State {
  menus: MenuObj[]
}

interface NewMenus {
  [key: number]: MenuObj
}

const store = createStore<State>({
  state() {
    return {
      menus: [],
    }
  },
  getters: {
    getNewMenus(state) {
      const menus = state.menus
      const newMenus: NewMenus = {}
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].parentId === 0) {
          // 一级菜单
          newMenus[menus[i].id] = { ...menus[i], children: newMenus[menus[i].id]?.children || [] }
        } else {
          // 二级菜单
          let parentId = menus[i].parentId // 对应的一级菜单id
          newMenus[parentId] = newMenus[parentId] || {}
          newMenus[parentId].children = newMenus[parentId].children || []
          newMenus[parentId].children?.push(menus[i])
        }
      }
      return newMenus
    },
  },
  mutations: {
    updateMenus(state, menus) {
      state.menus = menus
    },
  },
  actions: {
    getAdminInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          if (res.code === 200) {
            commit('updateMenus', res.data.menus);
            resolve(res.data);
          } else {
            reject(res);
          }
        })
      })
    }
  },
})

export const initStore = (app: App<Element>) => {
  app.use(store)
}

export default store