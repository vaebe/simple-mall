import Api from '../../base';
import type { ResultData, ResultPageListData } from '../../base';
import type { PaginationParameter } from '@/types';

export type SlideshowType = '01' | '02';

interface GetSlideshowsListParams extends PaginationParameter {
  description: string;
  type: SlideshowType;
}

export interface SlideshowInfo {
  id?: number;
  imageURL: string;
  JumpLink: string;
  description: string;
  type: SlideshowType;
  createdAt?: string;
  updatedAt?: string;
}

// 获取轮播图列表
export const getSlideshowsList = (
  data: GetSlideshowsListParams
): Promise<ResultPageListData<SlideshowInfo[]>> =>
  Api.post('/slideshow/getSlideshowsList', data);

// 根据分类获取轮播图列表
export const getSlideshowsByType = (params: {
  type: SlideshowType;
}): Promise<ResultData<SlideshowInfo[]>> =>
  Api.get('/slideshow/getSlideshowsByType', { params });

// 保存 or 更新轮播图
export const saveSlideshowInfo = (
  data: SlideshowInfo
): Promise<ResultData<string>> => Api.post('/slideshow/save', data);

// 删除轮播图
export const removeSlideshowInfo = (params: {
  id: number;
}): Promise<ResultData<string>> => Api.delete('/slideshow/delete', { params });
