import Api from './base';
import type { ResultData } from './base';

export interface QueryListResListItem {
  name: string;
  age: number;
  email: string;
  address: string;
  createDate: string;
}

export interface QueryListRes {
  list: QueryListResListItem[];
  pageNo: number;
  total: number;
}

export const queryList = (): Promise<ResultData<QueryListRes>> =>
  Api.post('/demo/queryList');
