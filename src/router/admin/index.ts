import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import dataManagementRouter from './dataManagement';
import systemManagementRouter from './systemManagement';

const router: RouteRecordRaw = {
  path: 'admin',
  name: 'admin',
  meta: {
    title: '管理后台'
  },
  redirect: (to: RouteLocationNormalized) => {
    return `${to.path}/systemManagement`;
  },
  component: () => import('@/views/layout/admin-layout.vue'),
  children: [dataManagementRouter, systemManagementRouter]
};

export default router;
