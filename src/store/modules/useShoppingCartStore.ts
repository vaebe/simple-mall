import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

const useShoppingCartStore = defineStore('useShoppingCartStore', () => {
  // 购物车商品数量
  const cartItemsTotal = ref(0);

  // 获取购物车商品数量
  const getCartItemsTotal = (): void => {
    cartItemsTotal.value = 1;
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
