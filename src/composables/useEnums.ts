import { getEnumsByType } from '@/api/backstage/systemManagement/dictionary';
import type { EnumInfo } from '@/api/backstage/systemManagement/dictionary';
import { ref } from 'vue';
import type { Ref } from 'vue';

export interface UseEnumsRes {
  defaultAddressEnums: Ref<EnumInfo[]>;
  getDefaultAddressEnums: () => void;
  orderStatusEnums: Ref<EnumInfo[]>;
  getOrderStatusEnums: () => void;
}

export const useEnums = (): UseEnumsRes => {
  // 是否是默认地址
  const defaultAddressEnums = ref<EnumInfo[]>([]);
  const getDefaultAddressEnums = (): void => {
    getEnumsByType({ type: 'defaultAddress' }).then((res) => {
      defaultAddressEnums.value = res.data || [];
    });
  };

  // 订单状态
  const orderStatusEnums = ref<EnumInfo[]>([]);
  const getOrderStatusEnums = (): void => {
    getEnumsByType({ type: 'orderStatus' }).then((res) => {
      orderStatusEnums.value = res.data || [];
    });
  };

  return {
    defaultAddressEnums,
    getDefaultAddressEnums,
    orderStatusEnums,
    getOrderStatusEnums
  };
};
