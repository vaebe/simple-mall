<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/useUserStore';

const userStore = useUserStore();

// 函数可以直接解构
const { setUserName } = userStore;

// 直接解构数据会丧失响应性
// storeToRefs 可以保持数据的响应性类似 torefs
const { userInfo } = storeToRefs(userStore);
</script>

<template>
  <div class="text-3xl font-bold underline">这里是 login 页面</div>

  <p>用户名： {{ userInfo.name }}</p>
  <button @click="setUserName('admin')">设置用户名为 admin</button>

  <el-button type="primary">这是一个按钮</el-button>
</template>

<style lang="scss" scoped></style>
