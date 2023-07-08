import Api from '../../base';
import type { ResultData, ResultPageListData } from '../../base';
import type { PaginationParameter } from '@/types';

interface GetAddressListParams extends PaginationParameter {
  cityName: string;
  districtName: string;
  provinceName: string;
  streetName: string;
}

export interface AddressInfo {
  id: number;
  city: number;
  cityName: string;
  defaultAddress: string;
  detailedAddress: string;
  district: number;
  districtName: string;
  name: string;
  phone: string;
  province: number;
  provinceName: string;
  street: number;
  streetName: string;
  userId: number;
  zipCode: string;
  createdAt?: string;
  updatedAt?: string;
  provinceCityDistrictName?: string;
}

export interface AreaInfo {
  extName: string;
  deep: number;
  extID: number;
  id: number;
  name: string;
  pid: number;
  pinyin: string;
  pinyinPrefix: string;
}

// 根据参数获取区域数据
export const getAreasByParams = (params: {
  pid?: string;
  deep?: string;
}): Promise<ResultData<AreaInfo[]>> =>
  Api.get('/address/getAreasByParams', { params });

// 获取地址列表
export const getAddressList = (
  data: GetAddressListParams
): Promise<ResultPageListData<AddressInfo[]>> =>
  Api.post('/address/getAddressInfoList', data);

// 获取用户地址信息列表
export const getUserAddressInfoList = (): Promise<ResultData<AddressInfo[]>> =>
  Api.get('/address/getUserAddressInfoList');

// 保存 or 更新地址信息
export const saveAddressInfo = (
  data: AddressInfo
): Promise<ResultData<string>> => Api.post('/address/save', data);

// 删除地址
export const removeAddressInfo = (params: {
  id: number;
}): Promise<ResultData<string>> => Api.delete('/address/delete', { params });

// 获取详情
export const getAddressDetails = (params: {
  id: number;
}): Promise<ResultData<AddressInfo>> => Api.get('/address/details', { params });

// 设置默认地址
export const setDefaultAddress = (params: {
  id: number;
}): Promise<ResultData<AddressInfo>> =>
  Api.get('/address/setDefaultAddress', { params });
