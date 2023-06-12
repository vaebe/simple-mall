import Api from './base';
import type { ResultData } from './base';

// 文件上传
export const upload = (data: FormData): Promise<ResultData<string>> =>
  Api.post('/file/upload', data);
