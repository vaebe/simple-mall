import { defineStore, acceptHMRUpdate } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore(
  'useUserStore',
  () => {
    const userInfo = reactive({ name: 'tangshi' });

    const setUserName = (name: string): void => {
      userInfo.name = name;
    };

    return {
      userInfo,
      setUserName
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
