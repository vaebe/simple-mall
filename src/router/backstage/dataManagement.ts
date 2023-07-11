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
      path: 'slideshow',
      name: 'data-management-slideshow',
      meta: {
        title: '轮播图管理'
      },
      component: () =>
        import('@/views/backstage/dataManagement/slideshow/index.vue')
    },
    {
      path: 'productCategory',
      name: 'data-management-productCategory',
      meta: {
        title: '商品分类管理'
      },
      component: () =>
        import('@/views/backstage/dataManagement/productCategory/index.vue')
    },
    {
      path: 'product',
      name: 'data-management-product',
      meta: {
        title: '商品管理'
      },
      component: () =>
        import('@/views/backstage/dataManagement/product/index.vue')
    },
    {
      path: 'address',
      name: 'data-management-address',
      meta: {
        title: '地址管理'
      },
      component: () =>
        import('@/views/backstage/dataManagement/address/index.vue')
    },
    {
      path: 'order',
      name: 'data-management-order',
      meta: {
        title: '订单管理'
      },
      component: () =>
        import('@/views/backstage/dataManagement/order/index.vue')
    }
  ]
};

export default router;
