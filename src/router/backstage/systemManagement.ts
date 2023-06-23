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
      path: 'dictionary',
      name: 'dictionary',
      meta: {
        title: '字典管理'
      },
      component: () =>
        import('@/views/backstage/systemManagement/dictionary/index.vue')
    },
    {
      path: 'role',
      name: 'role',
      meta: {
        title: '角色管理'
      },
      component: () =>
        import('@/views/backstage/systemManagement/role/index.vue')
    },
    {
      path: 'user',
      name: 'user',
      meta: {
        title: '用户管理'
      },
      component: () =>
        import('@/views/backstage/systemManagement/user/index.vue')
    }
  ]
};

export default router;
