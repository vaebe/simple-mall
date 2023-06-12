import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const router: RouteRecordRaw = {
  path: 'systemManagement',
  name: 'systemManagement',
  meta: {
    title: '系统管理'
  },
  redirect: (to: RouteLocationNormalized) => {
    return `${to.path}/user`;
  },
  component: () => import('@/components/ViewComponent.vue'),
  children: [
    {
      path: 'user',
      name: 'user',
      meta: {
        title: '用户管理'
      },
      component: () => import('@/views/systemManagement/user/index.vue')
    },
    {
      path: 'role',
      name: 'role',
      meta: {
        title: '角色管理'
      },
      component: () => import('@/views/systemManagement/role/index.vue')
    }
  ]
};

export default router;
