import { getEnumsByType } from '@/api/backstage/systemManagement/dictionary';
import type { EnumInfo } from '@/api/backstage/systemManagement/dictionary';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { getRoleInfoList } from '@/api/backstage/systemManagement/role';
import type { RoleInfo } from '@/api/backstage/systemManagement/role';

export interface UseEnumsRes {
  defaultAddressEnums: Ref<EnumInfo[]>;
  getDefaultAddressEnums: () => void;
  orderStatusEnums: Ref<EnumInfo[]>;
  getOrderStatusEnums: () => void;
  roleList: Ref<RoleInfo[]>;
  getRoleList: () => void;
  genderEnums: Ref<EnumInfo[]>;
  getGenderEnums: () => void;
}

export const useEnums = (): UseEnumsRes => {
  // 是否是默认地址
  const defaultAddressEnums = ref<EnumInfo[]>([]);
  const getDefaultAddressEnums = (): void => {
    defaultAddressEnums.value = [];
    getEnumsByType({ type: 'defaultAddress' }).then((res) => {
      defaultAddressEnums.value = res.data || [];
    });
  };

  // 订单状态
  const orderStatusEnums = ref<EnumInfo[]>([]);
  const getOrderStatusEnums = (): void => {
    orderStatusEnums.value = [];
    getEnumsByType({ type: 'orderStatus' }).then((res) => {
      orderStatusEnums.value = res.data || [];
    });
  };

  // 获取角色列表
  const roleList = ref<RoleInfo[]>([]);
  const getRoleList = (): void => {
    roleList.value = [];
    getRoleInfoList().then((res) => {
      roleList.value = res.data || [];
    });
  };

  // 获取性别枚举
  const genderEnums = ref<EnumInfo[]>([]);
  const getGenderEnums = (): void => {
    genderEnums.value = [];
    getEnumsByType({ type: 'gender' }).then((res) => {
      genderEnums.value = res.data || [];
    });
  };

  return {
    defaultAddressEnums,
    getDefaultAddressEnums,
    orderStatusEnums,
    getOrderStatusEnums,
    roleList,
    getRoleList,
    genderEnums,
    getGenderEnums
  };
};
