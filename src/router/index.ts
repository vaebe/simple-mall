import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import mallRouter from './mall';
import adminRouter from './admin';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    redirect: (to: RouteLocationNormalized) => {
      return `${to.path}mall`;
    },
    component: () => import('@/components/ViewComponent.vue'),
    children: [mallRouter, adminRouter]
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
