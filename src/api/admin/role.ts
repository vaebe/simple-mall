import Api from '../base';
import type { ResultData } from '../base';

export interface RoleInfo {
  code: string;
  createdAt: string;
  description: string;
  id: number;
  name: string;
  updatedAt: string;
}

// 获取角色列表
export const getRoleInfoList = (): Promise<ResultData<RoleInfo[]>> =>
  Api.get('/role/getRoleList');
