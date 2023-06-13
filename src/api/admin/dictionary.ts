import Api from '../base';
import type { ResultData, ResultPageListData } from '../base';
import type { PaginationParameter } from '@/types';

interface GetEnumsListParams extends PaginationParameter {
  name: string;
  typeName: string;
}

export interface EnumInfo {
  code: string;
  createdAt: string;
  id: number;
  isDel: number;
  name: string;
  parentId: string;
  typeCode: string;
  typeName: string;
  updatedAt: string;
}

export interface SaveEnumInfo {
  code: string;
  id: number;
  name: string;
  parentId: string;
  typeCode: string;
  typeName: string;
}

// 获取枚举列表
export const getEnumsList = (
  data: GetEnumsListParams
): Promise<ResultPageListData<EnumInfo[]>> =>
  Api.post('/enum/getEnumsList', data);

// 保存 or 更新枚举
export const saveEnumInfo = (data: SaveEnumInfo): Promise<ResultData<string>> =>
  Api.post('/enum/save', data);

// 删除枚举
export const removeEnumInfo = (params: {
  id: number;
}): Promise<ResultData<string>> => Api.delete('/enum/delete', { params });
