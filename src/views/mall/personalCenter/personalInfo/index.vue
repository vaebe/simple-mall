<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useUserStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useEnums } from '@/composables';
import { getCodeNameByCodeId } from '@/utils/tool.ts';

const UserInfoEdit = defineAsyncComponent(
  () =>
    import(
      '@/views/backstage/systemManagement/user/components/AddAndViewDialog.vue'
    )
);

const { genderEnums, getGenderEnums } = useEnums();
getGenderEnums();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { refreshUserInfo } = userStore;

const userInfoEditRef = ref();
const openUserInfoEdit = () => {
  userInfoEditRef.value.openDialog('edit', userInfo.value);
};
</script>

<template>
  <div class="flex flex-col items-center">
    <el-avatar :size="88" :src="userInfo.avatar"></el-avatar>
    <p class="my-4">
      <span class="text-sm">账号:</span>
      <span class="ml-2">{{ userInfo.userAccount }}</span>
    </p>

    <p class="mb-4">
      <span class="text-sm">昵称:</span>
      <span class="ml-2">{{ userInfo.nickName }}</span>
    </p>
    <p class="mb-4">
      <span class="text-sm">手机号:</span>
      <span class="ml-2">{{ userInfo.phoneNumber }}</span>
    </p>
    <p class="mb-4">
      <span class="text-sm">性别:</span>
      <span class="ml-2">
        {{ getCodeNameByCodeId(userInfo.gender, genderEnums) }}
      </span>
    </p>

    <el-button @click="openUserInfoEdit">点击修改</el-button>

    <user-info-edit
      ref="userInfoEditRef"
      :show-role-set="false"
      :gender-list="genderEnums"
      @refresh-data="refreshUserInfo"
    ></user-info-edit>
  </div>
</template>

<style scoped lang="scss"></style>
