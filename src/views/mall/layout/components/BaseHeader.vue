<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { useUserStore, useShoppingCartStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ShoppingCart } from '@element-plus/icons-vue';

const ThemeSwitch = defineAsyncComponent(
  () => import('@/components/ThemeSwitch.vue')
);

const { VITE_APP_TITLE } = import.meta.env;

const userStore = useUserStore();
const { isLogin, isAdmin, userInfo } = storeToRefs(userStore);
const { loginOut } = userStore;

const shoppingCartStore = useShoppingCartStore();
const { getCartItemsTotal } = shoppingCartStore;
const { cartItemsTotal } = storeToRefs(shoppingCartStore);
getCartItemsTotal();

const router = useRouter();
const jumpPageByPath = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div
    class="w-full h-10 px-4 relative z-50 flex items-center justify-between bg-white dark:bg-black"
  >
    <div class="flex items-center">
      <el-image class="w-5" src="/vite.svg" fit="fill"></el-image>
      <span class="ml-2 cursor-pointer" @click="jumpPageByPath('/mall')">
        {{ VITE_APP_TITLE }}
      </span>
    </div>

    <div class="flex items-center">
      <p v-if="!isLogin" class="mr-2">
        <span
          class="cursor-pointer hover:text-blue-400"
          @click="jumpPageByPath('/login')"
        >
          登录
        </span>
        <span
          class="ml-2 cursor-pointer hover:text-blue-400"
          @click="jumpPageByPath('/register')"
        >
          注册
        </span>
      </p>

      <div v-else class="flex items-center">
        <el-tooltip
          effect="dark"
          :content="userInfo.nickName"
          placement="bottom"
        >
          <p
            class="w-24 h-10 px-2 truncate leading-10 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            {{ userInfo.nickName }}
          </p>
        </el-tooltip>

        <p
          class="h-10 leading-10 px-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          @click="jumpPageByPath('/mall/personalCenter')"
        >
          个人中心
        </p>

        <p
          v-if="isAdmin"
          class="h-10 leading-10 px-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          @click="jumpPageByPath('/backstage')"
        >
          后台管理
        </p>

        <p
          class="h-10 flex items-center hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          @click="jumpPageByPath('/mall/shoppingCart')"
        >
          <el-icon class="cursor-pointer" :size="24">
            <ShoppingCart />
          </el-icon>
          <span class="ml-2">购物车</span>
          (
          <span class="text-red-500">{{ cartItemsTotal }}</span>
          )
        </p>

        <p
          class="h-10 leading-10 px-2 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          @click="loginOut"
        >
          退出登录
        </p>
      </div>

      <theme-switch class="ml-2"></theme-switch>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
