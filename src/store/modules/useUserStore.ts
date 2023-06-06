import { defineStore, acceptHMRUpdate } from 'pinia';
import { reactive } from 'vue';

const useUserStore = defineStore(
  'useUserStore',
  () => {
    const userInfo = reactive({ name: 'tangshi', token: '1234' });

    // 设置用户名
    const setUserName = (name: string): void => {
      userInfo.name = name;
    };

    // 获取 token
    const getToken = (): string => {
      return userInfo.token;
    };

    return {
      userInfo,
      setUserName,
      getToken
    };
  },
  {
    persist: {
      enabled: true,
      // 将 userInfo 放到 sessionStorage 做持久化，不设置默认持久化全部数据
      strategies: [{ storage: sessionStorage, paths: ['userInfo'] }]
    }
  }
);

// 导出 store
export { useUserStore };
export default useUserStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
