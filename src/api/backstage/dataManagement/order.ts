import Api from '../../base';
import type { ResultData, ResultPageListData } from '../../base';
import type { PaginationParameter } from '@/types';

interface GetOrderListParams extends PaginationParameter {
  state: string;
}

export interface OrderInfoProducts {
  count: number;
  orderId?: number;
  price: number;
  productId: number;
}

export interface OrderInfo {
  addressId: number;
  id?: number;
  paymentMethod: string;
  products: OrderInfoProducts[];
  remark: string;
  totalPrice: number;
  userId: number;
}

// 创建订单
export const createOrder = (data: OrderInfo): Promise<ResultData<string>> =>
  Api.post('/order/create', data);

// 获取订单列表
export const getOrderList = (
  data: GetOrderListParams
): Promise<ResultPageListData<OrderInfo[]>> =>
  Api.post('/order/getOrderList', data);

// 获取用户订单信息列表
export const getUserOrderList = (params: {
  state: string;
}): Promise<ResultData<OrderInfo[]>> =>
  Api.get('/order/getUserOrderList', { params });

// 获取详情
export const getOrderDetails = (params: {
  id: number;
}): Promise<ResultData<OrderInfo>> => Api.get('/order/details', { params });

// 更新订单状态
export const updateOrderStatus = (data: {
  id: number;
  state: string;
}): Promise<ResultData<string>> => Api.post('/order/updateOrderStatus', data);
