import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import mallRouter from './mall';
import backstageRouter from './backstage';
import { useUserStore } from '@/store';

// 保存进入登录页面的路径
const saveEnterTheLoginPagePath = (path: string): void => {
  const { setEnterTheLoginPagePath } = useUserStore();
  setEnterTheLoginPagePath(path);
};

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    redirect: (to: RouteLocationNormalized) => {
      return `${to.path}mall`;
    },
    component: () => import('@/components/ViewComponent.vue'),
    children: [mallRouter, backstageRouter]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    beforeEnter: (_to, from) => {
      saveEnterTheLoginPagePath(from.fullPath);
      return true;
    },
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册'
    },
    beforeEnter: (_to, from) => {
      saveEnterTheLoginPagePath(from.fullPath);
      return true;
    },
    component: () => import('@/views/login/index.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to) => {

  return false
})

export default router;
