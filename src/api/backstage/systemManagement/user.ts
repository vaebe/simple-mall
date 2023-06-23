import Api from '../../base';
import type { ResultData, ResultPageListData } from '../../base';
import type { PaginationParameter } from '@/types';

interface GetUserListParams extends PaginationParameter {
  nickName: string;
  phoneNumber: string;
  userAccount: string;
}

export interface UserInfo {
  avatar: string;
  createdAt: string;
  gender: number;
  id?: number;
  nickName: string;
  password?: string;
  phoneNumber: string;
  role: number;
  updatedAt: string;
  userAccount: string;
}

// 获取用户列表
export const getUserList = (
  data: GetUserListParams
): Promise<ResultPageListData<UserInfo[]>> =>
  Api.post('/user/getUserList', data);

// 删除用户
export const removeUser = (params: {
  id: number;
}): Promise<ResultData<string>> => Api.delete('/user/delete', { params });

// 保存或更新用户信息
export const saveOrUpdateUser = (
  data: UserInfo
): Promise<ResultData<{ id: number }>> => Api.post('/user/save', data);
