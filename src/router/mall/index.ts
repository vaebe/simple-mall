import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const router: RouteRecordRaw = {
  path: 'mall',
  name: 'mall',
  meta: {
    title: '商城'
  },
  redirect: (to: RouteLocationNormalized) => {
    return `${to.path}/home`;
  },
  component: () => import('@/components/ViewComponent.vue'),
  children: [
    {
      path: 'home',
      name: 'mall-home',
      meta: {
        title: '商城首页'
      },
      component: () => import('@/views/mall/home/index.vue')
    }
  ]
};

export default router;
