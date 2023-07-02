import Api from '../base';
import type { ResultData } from '../base';
import type { ProductInfo } from '../backstage/dataManagement/product';

export interface AddItemToCartParams {
  count: number;
  productId: number;
  userId: number;
}

export interface ShoppingCartInfo {
  count: number;
  id: number;
  productId: number;
  productInfo: ProductInfo;
  userId: number;
}

// 添加商品到购物车
export const addItemToCart = (
  data: AddItemToCartParams
): Promise<ResultData<string>> => Api.post('/shoppingCart/save', data);

// 根据用户id 获取购物车信息
export const getShoppingCartInfoByUserId = (): Promise<
  ResultData<ShoppingCartInfo[]>
> => Api.post('/shoppingCart/getShoppingCartInfoByUserId');
