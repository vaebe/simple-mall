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
    },
    {
      path: 'productDetails/:id',
      name: 'mall-product-details',
      props: true,
      meta: {
        title: '商品详情'
      },
      component: () => import('@/views/mall/productDetails/index.vue')
    },
    {
      path: 'searchProductList/:keyword',
      name: 'mall-search-product-list',
      meta: {
        title: '搜索商品列表'
      },
      component: () => import('@/views/mall/searchProductList/index.vue')
    }
  ]
};

export default router;
