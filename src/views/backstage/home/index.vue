<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAssetsImgFile, setEchartsDom } from '@/utils/tool.ts';
import type { EChartsOption } from 'echarts';

const typeList = [
  {
    value: 4,
    code: '01',
    name: '用户总数'
  },
  {
    value: 3037,
    code: '02',
    name: '商品总数'
  },
  {
    value: 5,
    code: '03',
    name: '订单总数'
  },
  {
    value: 453,
    code: '04',
    name: '今日成交额'
  },
  {
    value: 3452,
    code: '05',
    name: '本周成交额'
  },
  {
    value: 15335,
    code: '06',
    name: '本月成交额'
  }
];

const getIcon = (type: string) => {
  return getAssetsImgFile(`backstage/home/${type}.png`);
};

// 折线
const lineChart = (opts: {
  seriesName: string;
  xData: any[];
  seriesData: any[];
  customOption?: EChartsOption;
}): EChartsOption => {
  const {
    seriesName = '',
    xData = [],
    seriesData = [],
    customOption = {}
  } = opts;

  return {
    tooltip: {
      trigger: 'axis',
      formatter: `${seriesName} <br/>{b}: {c}`
    },
    grid: {
      top: '10%',
      left: '1%',
      right: '3%',
      bottom: '0',
      containLabel: true
    },
    xAxis: {
      boundaryGap: false,
      type: 'category',
      data: xData,
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: seriesData,
        type: 'line',
        smooth: true
      }
    ],
    ...customOption
  } as EChartsOption;
};

// todo 已支付未支付
const transactionCountStatisticsRef = ref();
const initChart = () => {
  const opts = lineChart({
    seriesName: '交易次数统计',
    xData: ['8-6', '8-7', '8-8', '8-9', '8-10'],
    seriesData: [3, 10, 9, 3, 7]
  });

  setEchartsDom(transactionCountStatisticsRef.value, opts);
};

onMounted(() => {
  initChart();
});
</script>

<template>
  <div>
    <ul class="grid grid-cols-3 gap-4">
      <li
        v-for="(item, index) in typeList"
        :key="item.code"
        class="border rounded p-2 flex items-center"
      >
        <img class="w-10" :src="getIcon(item.code)" alt="" />
        <div class="ml-2">
          <p class="mb-2 opacity-70">{{ item.name }}</p>
          <p class="text-xl font-medium">
            <span v-if="index > 2">¥</span>
            {{ item.value }}
          </p>
        </div>
      </li>
    </ul>
  </div>
  <el-card class="mt-8">
    <h1>近五天交易次数统计</h1>
    <div ref="transactionCountStatisticsRef" style="height: 50vh"></div>
  </el-card>
</template>

<style scoped lang="scss"></style>
