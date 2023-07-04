<script lang="ts" setup>
import { CircleCheckFilled, CircleCheck } from '@element-plus/icons-vue';
import { useVModel } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const selIcon = useVModel(props, 'modelValue', emit);

const iconCLick = () => {
  selIcon.value = !selIcon.value;
  emit('change', selIcon.value);
};
</script>

<template>
  <div @click="iconCLick">
    <el-icon v-if="selIcon" color="red" :size="20">
      <CircleCheckFilled />
    </el-icon>
    <el-icon v-else :size="20"><CircleCheck /></el-icon>
  </div>
</template>

<style lang="scss" scoped></style>
