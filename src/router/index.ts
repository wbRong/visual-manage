import App from "./App.vue"
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import store from '@/store'
import Cookies from 'js-cookie';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: '404',
    component: () => import ("../views/404.vue")
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 根据getters里面的菜单对象生成路由规则
const genRoutes = () => {
  const menus = store.getters.getNewMenus;
  // 循环菜单对象
  for (let key in menus) {
    const newRoute: RouteRecordRaw = {
      path: '/' + menus[key].name,
      name: menus[key].name,
      component: () => import('../views/homepage/homepage.vue'),
      redirect: '/' + menus[key].name + '/' + menus[key].children[0].name,
      children: []
    };
    for (let i = 0; i < menus[key].children.length; i++) {
      newRoute.children?.push({
        path: menus[key].children[i].name,
        name: menus[key].children[i].name,
        component: () => import(`../views/${menus[key].name}/${menus[key].children[i].name}.vue`)
      })
    }

    // 动态添加路由规则
    router.addRoute(newRoute)
  }
  // 动态添加首页
  router.addRoute({
    path: '/',
    name: 'homepage',
    component: () => import('../views/homepage/homepage.vue'),
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('../views/index/index.vue'),
      }
    ]
  });
}

// 前置导航守卫
router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  if (token && store.state.menus.length === 0) {
    // console.log('menus为空');
    store.dispatch('getAdminInfo').then(() => {
      genRoutes();
      next(to);
    });

  } else if (token && store.state.menus.length !== 0 && from.path === '/login' && to.path === '/home') {
    // 动态添加路由规则
    genRoutes();
    next('/index');
  } else if (!token && to.path !== '/login') {
    next('/login');
  } else if (token && to.path === '/login') {
    next(from);
  } else {
    next();
  }
})

export const initRouter = (app: App<Element>) => {
  app.use(router);
}
