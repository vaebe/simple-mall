import Api from '../../base';
import type { ResultData, ResultPageListData } from '../../base';
import type { PaginationParameter } from '@/types';

interface GetProductCategoryListParams extends PaginationParameter {
  name: string;
}

export interface ProductCategoryInfo {
  code: string;
  createdAt?: string;
  id: number;
  name: string;
  sort: number;
  updatedAt?: string;
}

// 获取商品分类列表
export const getProductCategoryList = (
  data: GetProductCategoryListParams
): Promise<ResultPageListData<ProductCategoryInfo[]>> =>
  Api.post('/productCategory/getProductCategoryList', data);

// 保存 or 更新商品分类
export const saveProductCategoryInfo = (
  data: ProductCategoryInfo
): Promise<ResultData<string>> => Api.post('/productCategory/save', data);

// 删除商品分类
export const removeProductCategoryInfo = (params: {
  id: number;
}): Promise<ResultData<string>> =>
  Api.delete('/productCategory/delete', { params });
