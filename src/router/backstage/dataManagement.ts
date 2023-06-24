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
        title: '商品分类管理'
      },
      component: () =>
        import('@/views/backstage/dataManagement/productCategory/index.vue')
    },
    {
      path: 'product',
      name: 'product',
      meta: {
        title: '商品管理'
      },
      component: () =>
        import('@/views/backstage/dataManagement/product/index.vue')
    },
    {
      path: 'slideshow',
      name: 'slideshow',
      meta: {
        title: '轮播图管理'
      },
      component: () =>
        import('@/views/backstage/dataManagement/slideshow/index.vue')
    }
  ]
};

export default router;
