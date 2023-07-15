<script setup lang="ts">
const props = defineProps({
  orderId: {
    type: String,
    default: ''
  }
});

console.log(props.orderId);
</script>

<template>
  <div class="text-2xl h-[100vh]">
    此处应为订单支付页面，但是我还没有写！！！
  </div>
</template>

<style scoped lang="scss"></style>
