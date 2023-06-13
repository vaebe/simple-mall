import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const router: RouteRecordRaw = {
  path: 'dataManagement',
  name: 'dataManagement',
  meta: {
    title: '数据管理'
  },
  redirect: (to: RouteLocationNormalized) => {
    return `${to.path}/productCategory`;
  },
  component: () => import('@/components/ViewComponent.vue'),
  children: [
    {
      path: 'productCategory',
      name: 'productCategory',
      meta: {
        title: '商品分类'
      },
      component: () =>
        import('@/views/dataManagement/productCategory/index.vue')
    }
  ]
};

export default router;
