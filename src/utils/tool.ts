import type { ProductInfoPictures } from '@/api/backstage/dataManagement/product.ts';
import type { AddressInfo } from '@/api/backstage/dataManagement/address';
import * as echarts from 'echarts';
import type { EChartsType, EChartsOption } from 'echarts';

type PrimitiveData = Record<
  string,
  string | number | any[] | Record<string, any> | null
>;

export const resetObjToPrimitiveType = (
  data: PrimitiveData | null
): PrimitiveData | null => {
  if (!data) {
    return data;
  }

  const newData: PrimitiveData = {};

  Object.keys(data).forEach((item) => {
    if (typeof data[item] === 'number') {
      newData[item] = 0;
    } else if (Array.isArray(data[item])) {
      newData[item] = [];
    } else if (
      Object.prototype.toString.call(data[item]) === '[object Object]'
    ) {
      newData[item] = {};
    } else {
      newData[item] = '';
    }
  });

  return newData;
};

/**
 * 根据指定枚举编码转换枚举值
 * @param key 枚举key
 * @param list 枚举list
 * @param id key的字段
 * @param value 值的字段
 * @returns
 */
export const getCodeNameByCodeId = (
  key: string,
  list: Array<Record<string, any>>,
  id = 'code',
  value = 'name'
): string => {
  if (!list) {
    return '';
  }

  const dataItem = list.find((item) => item[id] === key);

  return dataItem?.[value] ?? '';
};

// 根据文件名称获取文件类型
export const getFileTypeByFileName = (fileName: string): string => {
  return fileName.substring(fileName.lastIndexOf('.') + 1);
};

// 是否是视频
export const isVideo = (url: string): boolean => {
  const fileType = getFileTypeByFileName(url);
  const videoExtensions = ['mp4', 'm4v'];

  return (
    videoExtensions.includes(fileType) ||
    url.includes('mp4') ||
    url.includes('m4v')
  );
};

// 格式化商品图片信息
export const formatPicturesInfo = (
  list: ProductInfoPictures[]
): { url: string; list: string[] } => {
  // 过滤掉 video 类型的文件
  const data = list.filter((item) => !isVideo(item.url));

  if (!Array.isArray(data) || data.length === 0) {
    return {
      url: '',
      list: []
    };
  } else {
    return {
      url: data[0].url,
      list: data.map((item) => item.url)
    };
  }
};

// 将地址信息的中的省市区街道拼接展示
export const concatenateAddressParts = (info: AddressInfo): string => {
  if (!info) {
    return '';
  }

  const addressParts = [
    info.provinceName,
    info.cityName,
    info.districtName,
    info.streetName
  ];
  const filteredParts = addressParts.filter(Boolean);

  return filteredParts.join('  ');
};

/**
 * 获取 assets\img 静态资源
 * @param url
 */
export const getAssetsImgFile = (url: string): string => {
  return new URL(`../assets/img/${url}`, import.meta.url).href;
};

/**
 *  设置 Echarts 配置
 * @param dom
 * @param option
 */
export const setEchartsDom = (
  dom: HTMLElement,
  option: EChartsOption
): EChartsType => {
  const echartsDom = echarts.getInstanceByDom(dom);
  // 加载过图表 清除后加载
  if (echartsDom) {
    echartsDom?.dispose && echartsDom.dispose();
  }

  const chartBox = echarts.init(dom);
  chartBox.setOption(option);
  window.removeEventListener('resize', () => {
    chartBox.resize();
  });
  window.addEventListener('resize', () => {
    chartBox.resize();
  });
  return chartBox;
};
