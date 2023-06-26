import Api from '../../base';
import type { ResultData, ResultPageListData } from '../../base';
import type { PaginationParameter } from '@/types';

interface GetProductListParams extends PaginationParameter {
  name: string;
}

export interface ProductInfoPictures {
  id?: number;
  url: string;
  name: string;
  size?: number;
  type?: string;
  productId?: number;
}

export interface ProductInfo {
  id: number;
  info: string;
  name: string;
  pictures: ProductInfoPictures[];
  detailImages: string;
  parameterImages: string;
  price: number;
  productCategoryId: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

// 获取商品列表
export const getProductList = (
  data: GetProductListParams
): Promise<ResultPageListData<ProductInfo[]>> =>
  Api.post('/product/getProductList', data);

// 获取随机推荐商品列表
export const getRandomRecommendedProductList = (params: {
  total: number;
}): Promise<ResultData<ProductInfo[]>> =>
  Api.get('/product/getRandomRecommendedProductList', { params });

// 保存 or 更新商品
export const saveProductInfo = (
  data: ProductInfo
): Promise<ResultData<string>> => Api.post('/product/save', data);

// 删除商品
export const removeProductInfo = (params: {
  id: number;
}): Promise<ResultData<string>> => Api.delete('/product/delete', { params });

// 获取详情
export const getProductDetails = (params: {
  id: string;
}): Promise<ResultData<ProductInfo>> => Api.get('/product/details', { params });
