<script lang="ts" setup>
import Header from './components/AdminHeader.vue';
import Menu from './components/AdminMenu.vue';
</script>

<template>
  <div class="layout-box">
    <Header></Header>
    <div class="content-box">
      <Menu></Menu>
      <div class="main-box">
        <el-scrollbar height="91vh">
          <div style="margin: 18px">
            <router-view />
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-box {
  width: 100vw;
  height: 100vh;
  background: var(--el-bg-color-overlay);

  .content-box {
    display: flex;

    .main-box {
      box-sizing: border-box;
      width: calc(100vw - 240px);
      height: calc(100vh - 7vh);
    }
  }
}
</style>
