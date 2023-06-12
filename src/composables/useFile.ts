import { useUserStore } from '@/store';

export interface UseUploadOptsRes {
  uploadHeaders: {
    authorization: string;
  };
  uploadUrl: string;
  uploadFileTypeList: string[];
}

export const useUploadOpts = (): UseUploadOptsRes => {
  const { getToken } = useUserStore();
  const token = getToken();
  const uploadHeaders = {
    authorization: token
  };

  const { VITE_APP_BASE_URL } = import.meta.env;
  const uploadUrl = `${VITE_APP_BASE_URL as string}/file/upload`;

  const uploadFileTypeList = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  return {
    uploadHeaders,
    uploadUrl,
    uploadFileTypeList
  };
};
