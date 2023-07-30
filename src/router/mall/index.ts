import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import personalCenterRouter from './personalCenter';

const router: RouteRecordRaw = {
  path: 'mall',
  name: 'mall',
  meta: {
    title: '商城'
  },
  redirect: (to: RouteLocationNormalized) => {
    return `${to.path}/home`;
  },
  component: () => import('@/views/mall/layout/index.vue'),
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
      path: 'searchProductList',
      name: 'mall-search-product-list',
      meta: {
        title: '搜索商品列表'
      },
      component: () => import('@/views/mall/searchProductList/index.vue')
    },
    {
      path: 'shoppingCart',
      name: 'mall-shopping-cart',
      meta: {
        title: '购物车'
      },
      component: () => import('@/views/mall/shoppingCart/index.vue')
    },
    {
      path: 'orderPay/:orderId',
      name: 'mall-order-pay',
      props: true,
      meta: {
        title: '订单支付'
      },
      component: () => import('@/views/mall/orderPay/index.vue')
    },
    {
      path: 'orderPaymentSuccessful/:orderId',
      name: 'mall-order-payment-successful',
      props: true,
      meta: {
        title: '订单支付成功'
      },
      component: () => import('@/views/mall/orderPaymentSuccessful/index.vue')
    },
    personalCenterRouter
  ]
};

export default router;
