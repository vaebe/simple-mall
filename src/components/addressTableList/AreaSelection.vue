<script lang="ts" setup>
import { ref } from 'vue';
import { getAreasByParams } from '@/api/backstage/dataManagement/address';
import type { AreaInfo } from '@/api/backstage/dataManagement/address';

defineProps({
  width: {
    type: String,
    default: '50%'
  },
  placement: {
    type: String,
    default: 'bottom'
  }
});

const emit = defineEmits(['change']);

const selectedAreaList = ref<AreaInfo[]>([]);

const popoverVisible = ref(false);

const openPopover = () => {
  getAreaListByParams();
  selectedAreaList.value = [];

  popoverVisible.value = true;
};

const areaInfoText = ref('请选择地址');

const areaList = ref<AreaInfo[]>([]);

const getAreaListByParams = (item?: AreaInfo) => {
  if (item) {
    selectedAreaList.value.push(item);
  }

  getAreasByParams({ pid: String(item?.id) }).then((res) => {
    areaList.value = res.data || [];

    // 数据等于 0 表示无下级
    if (areaList.value.length === 0) {
      popoverVisible.value = false;

      // 最后一级才进行赋值
      areaInfoText.value = selectedAreaList.value
        .map((item) => item.extName)
        .join('/');

      emit('change', selectedAreaList.value, areaInfoText.value);
    }
  });
};

const selectedAreaChange = (index: number) => {
  getAreaListByParams(selectedAreaList.value[index - 1]);
  selectedAreaList.value.splice(index);
};
</script>

<template>
  <el-popover
    :visible="popoverVisible"
    :placement="placement"
    :width="width"
    trigger="click"
  >
    <div>
      <div>
        <span
          v-for="(item, index) in selectedAreaList"
          :key="item.id"
          class="cursor-pointer text-blue-400"
          @click="selectedAreaChange(index)"
        >
          {{ item.extName }}
          <span v-show="selectedAreaList.length - 1 !== index">/</span>
        </span>

        <p v-if="selectedAreaList.length === 0">选择省/自治区</p>
      </div>

      <el-divider direction="horizontal"></el-divider>

      <ul class="grid grid-cols-5 gap-4">
        <li
          v-for="item in areaList"
          :key="item.id"
          class="cursor-pointer hover:text-blue-400"
          @click="getAreaListByParams(item)"
        >
          {{ item.extName }}
        </li>
      </ul>
    </div>

    <template #reference>
      <div class="w-full" @click="openPopover">
        <slot v-if="$slots.default"></slot>
        <p v-else class="cursor-pointer hover:text-blue-400">
          {{ areaInfoText }}
        </p>
      </div>
    </template>
  </el-popover>
</template>

<style lang="scss" scoped></style>
