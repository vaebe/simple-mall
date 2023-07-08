import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const router: RouteRecordRaw = {
  path: 'personalCenter',
  name: 'personalCenter',
  meta: {
    title: '个人中心'
  },
  redirect: (to: RouteLocationNormalized) => {
    return `${to.path}/addressManagement`;
  },
  component: () => import('@/views/mall/personalCenter/layout/index.vue'),
  children: [
    {
      path: 'addressManagement',
      name: 'personal-center-address-management',
      meta: {
        title: '地址管理'
      },
      component: () =>
        import('@/views/mall/personalCenter/addressManagement/index.vue')
    }
  ]
};

export default router;
