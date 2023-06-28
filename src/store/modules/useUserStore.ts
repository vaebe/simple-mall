import { defineStore, acceptHMRUpdate } from 'pinia';
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { LoginResData, UserInfo } from '@/api/login';
import { resetObjToPrimitiveType } from '@/utils/tool';

const useUserStore = defineStore(
  'useUserStore',
  () => {
    const loginResData = reactive({
      token: '',
      expired_at: 0,
      userInfo: {
        avatar: '',
        createdAt: '',
        gender: '',
        id: 0,
        nickName: '',
        password: '',
        phoneNumber: '',
        role: '',
        updatedAt: '',
        userAccount: ''
      }
    });

    const router = useRouter();

    // 设置登录返回数据
    const setLoginResData = (data: LoginResData): void => {
      Object.assign(loginResData, data);

      if (data.userInfo.role === '00') {
        router.push('/backstage');
      }
    };

    // 获取用户信息
    const getUserInfo = (): UserInfo => {
      return loginResData.userInfo;
    };

    const isLogin = computed(() => !!loginResData.userInfo.id);

    // 获取 token
    const getToken = (): string => {
      return loginResData.token;
    };

    // 退出登录
    const loginOut = async (): Promise<void> => {
      // 重置登录信息
      Object.assign(loginResData, resetObjToPrimitiveType(loginResData));

      // 清除缓存的数据
      localStorage.clear();
      sessionStorage.clear();

      await router.push('/login');
    };

    return {
      loginResData,
      setLoginResData,
      getUserInfo,
      getToken,
      loginOut,
      isLogin
    };
  },
  {
    persist: {
      enabled: true,
      // 将 userInfo 放到 sessionStorage 做持久化，不设置默认持久化全部数据
      strategies: [{ storage: sessionStorage, paths: ['loginResData'] }]
    }
  }
);

// 导出 store
export { useUserStore };
export default useUserStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
