import { defineStore, acceptHMRUpdate, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { getTheNumberOfItemsInTheShoppingCart } from '@/api/mall/shoppingCart';
import { useUserStore } from '@/store';

const useShoppingCartStore = defineStore('useShoppingCartStore', () => {
  // 购物车商品数量
  const cartItemsTotal = ref(0);

  const userStore = useUserStore();
  const { isLogin } = storeToRefs(userStore);

  // 获取购物车商品数量
  const getCartItemsTotal = (): void => {
    // 用户未登录直接返回 0
    if (!isLogin.value) {
      cartItemsTotal.value = 0;
      return;
    }

    getTheNumberOfItemsInTheShoppingCart().then((res) => {
      cartItemsTotal.value = res.data || 0;
    });
  };

  return {
    getCartItemsTotal,
    cartItemsTotal
  };
});

// 导出 store
export { useShoppingCartStore };
export default useShoppingCartStore;

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useShoppingCartStore, import.meta.hot)
  );
}
