import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import dataManagementRouter from './dataManagement';
import systemManagementRouter from './systemManagement';

const router: RouteRecordRaw = {
  path: 'backstage',
  name: 'backstage',
  meta: {
    title: '管理后台'
  },
  redirect: (to: RouteLocationNormalized) => {
    return `${to.path}/systemManagement`;
  },
  component: () => import('@/views/backstage/layout/index.vue'),
  children: [
    {
      path: 'home',
      name: 'backstage-home',
      meta: {
        title: '首页'
      },
      component: () => import('@/views/backstage/home/index.vue')
    },
    dataManagementRouter,
    systemManagementRouter
  ]
};

export default router;
