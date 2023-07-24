import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const router: RouteRecordRaw = {
  path: 'personalCenter',
  name: 'personalCenter',
  meta: {
    title: '个人中心'
  },
  redirect: (to: RouteLocationNormalized) => {
    return `${to.path}/personalInfo`;
  },
  component: () => import('@/views/mall/personalCenter/layout/index.vue'),
  children: [
    {
      path: 'personalInfo',
      name: 'personal-center-personal-info',
      meta: {
        title: '个人信息'
      },
      component: () =>
        import('@/views/mall/personalCenter/personalInfo/index.vue')
    },
    {
      path: 'addressManagement',
      name: 'personal-center-address-management',
      meta: {
        title: '地址管理'
      },
      component: () =>
        import('@/views/mall/personalCenter/addressManagement/index.vue')
    },
    {
      path: 'orderManagement',
      name: 'personal-center-order-management',
      meta: {
        title: '订单管理'
      },
      component: () =>
        import('@/views/mall/personalCenter/orderManagement/index.vue')
    }
  ]
};

export default router;
