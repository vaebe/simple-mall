<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const routes = router?.getRoutes() || [];
const menuDataList =
  routes.find((item) => item.path === '/backstage')?.children || [];

const formatMenuData = (
  basePath: string,
  list: Array<RouteRecordRaw>
): Array<RouteRecordRaw> => {
  return list.map((item) => {
    const path = `${basePath}${item.path}`;

    let children: Array<RouteRecordRaw> = [];
    if (Array.isArray(item.children)) {
      children = formatMenuData(`${path}/`, item.children);
    }

    return {
      ...item,
      path,
      children
    } as RouteRecordRaw;
  });
};

const menuTreeData = ref(formatMenuData('/backstage/', menuDataList));

const route = useRoute();
const defaultActiveMenu = computed(() => {
  const list = route.matched;
  console.log(list[list.length - 1].path, route.path, menuTreeData.value);

  return list[list.length - 1].path;
});
</script>

<template>
  <div class="menu-box">
    <el-scrollbar style="height: 100%">
      <el-menu
        router
        :default-active="defaultActiveMenu"
        background-color="transparent"
        :unique-opened="true"
      >
        <template v-for="item in menuTreeData" :key="item.path">
          <!-- 有子路由  -->

          <el-sub-menu
            v-if="item.children && item.children.length !== 0"
            :index="item.path"
          >
            <template #title>
              <span>{{ item.meta?.title }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.path"
              :index="subItem.path"
            >
              {{ subItem.meta?.title }}
            </el-menu-item>
          </el-sub-menu>

          <!-- 无子路由 -->
          <el-menu-item v-else :index="item.path">
            <template #title>
              <span>{{ item.meta?.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.menu-box {
  width: 240px;
  height: calc(100vh - 7vh);
  padding: 2vh 0.3vw 1vh;
  background: var(--el-bg-color);
  border-right: var(--el-border);
}
</style>
