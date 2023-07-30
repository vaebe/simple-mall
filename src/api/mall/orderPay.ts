import Api from '../base';
import type { ResultData } from '../base';

export interface WeChatPayParams {
  info: string;
  orderId: string;
  price: string;
}

export interface weChatPayRes {
  code_url: string;
  QRcode_url: string;
}

// 微信支付
export const weChatPay = (
  data: WeChatPayParams
): Promise<ResultData<weChatPayRes>> => Api.post('/pay/weChatPay', data);
