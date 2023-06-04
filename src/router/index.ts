import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    redirect: (to: RouteLocationNormalized) => {
      return `${to.path}login`;
    },
    component: () => import('@/components/ViewComponent.vue'),
    children: []
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
