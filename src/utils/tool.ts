type PrimitiveData = Record<
  string,
  string | number | any[] | Record<string, any> | null
>;

export const resetObjToPrimitiveType = (
  data: PrimitiveData | null
): PrimitiveData | null => {
  if (!data) {
    return data;
  }

  const newData: PrimitiveData = {};

  Object.keys(data).forEach((item) => {
    if (typeof data[item] === 'number') {
      newData[item] = 0;
    } else if (Array.isArray(data[item])) {
      newData[item] = [];
    } else if (
      Object.prototype.toString.call(data[item]) === '[object Object]'
    ) {
      newData[item] = {};
    } else {
      newData[item] = '';
    }
  });

  return newData;
};

/**
 * 根据指定枚举编码转换枚举值
 * @param key 枚举key
 * @param list 枚举list
 * @param id key的字段
 * @param value 值的字段
 * @returns
 */
export const getCodeNameByCodeId = (
  key: string,
  list: Array<Record<string, any>>,
  id = 'code',
  value = 'name'
): string => {
  if (!list) {
    return '';
  }

  const dataItem = list.find((item) => item[id] === key);

  return dataItem?.[value] ?? '';
};
