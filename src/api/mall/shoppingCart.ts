import Api from '../base';
import type { ResultData } from '../base';
import type { ProductInfo } from '../backstage/dataManagement/product';

export interface AddItemToCartParams {
  id?: number;
  count: number;
  productId: number;
  userId: number;
  selected: boolean;
}

export interface ShoppingCartInfo extends AddItemToCartParams {
  id: number;
  productInfo: ProductInfo;
}

// 添加商品到购物车
export const addItemToCart = (
  data: AddItemToCartParams
): Promise<ResultData<string>> =>
  Api.post('/shoppingCart/addProductToShoppingCart', data);

// 批量更新购物车商品信息
export const batchUpdateShoppingCartProductInfo = (
  data: ShoppingCartInfo[]
): Promise<ResultData<ShoppingCartInfo[]>> =>
  Api.post('/shoppingCart/batchUpdateShoppingCartProductInfo', data);

// 根据用户id 获取购物车信息
export const getShoppingCartInfo = (): Promise<
  ResultData<ShoppingCartInfo[]>
> => Api.get('/shoppingCart/getShoppingCartInfo');

// 获取购物车商品数量
export const getTheNumberOfItemsInTheShoppingCart = (): Promise<
  ResultData<number>
> => Api.get('/shoppingCart/getTheNumberOfItemsInTheShoppingCart');

// 删除购物车商品
export const removeCartItem = (params: {
  productId: number;
}): Promise<ResultData<number>> =>
  Api.delete('/shoppingCart/deleteShoppingCartProduct', { params });
