import Api from '../../base';
import type { ResultData, ResultPageListData } from '../../base';
import type { PaginationParameter } from '@/types';
import type { AddressInfo } from './address.ts';

interface GetOrderListParams extends PaginationParameter {
  state: string;
}

export interface OrderInfoProducts {
  count: number;
  orderId?: number;
  price: number;
  productId: number;
  info: string;
  picture: string;
  name: string;
}

export interface CreateOrderInfo {
  addressId: number;
  paymentMethod: string;
  products: OrderInfoProducts[];
  remark: string;
  totalPrice: number;
  userId: number;
}

export interface OrderInfo extends CreateOrderInfo {
  id: number;
  state: string;
  createdAt: string;
  updatedAt: string;
}

// 订单详情
export interface OrderDetails extends OrderInfo {
  addressInfo: AddressInfo;
}

// 创建订单
export const createOrder = (
  data: CreateOrderInfo
): Promise<ResultData<string>> => Api.post('/order/create', data);

// 获取订单列表
export const getOrderList = (
  data: GetOrderListParams
): Promise<ResultPageListData<OrderInfo[]>> =>
  Api.post('/order/getOrderList', data);

// 获取用户订单信息列表
export const getUserOrderList = (
  data: GetOrderListParams
): Promise<ResultData<OrderInfo[]>> =>
  Api.post('/order/getUserOrderList', data);

// 获取详情
export const getOrderDetails = (params: {
  id: number;
}): Promise<ResultData<OrderDetails>> => Api.get('/order/details', { params });

// 更新订单状态
export const updateOrderStatus = (data: {
  id: number;
  state: string;
}): Promise<ResultData<string>> => Api.post('/order/updateOrderStatus', data);
