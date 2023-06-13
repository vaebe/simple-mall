<script lang="ts" setup>
import { reactive } from 'vue';
import type { PropType } from 'vue';
import { saveOrUpdateUser } from '@/api/admin/user';
import { usePageListDialog } from '@/composables/usePageList';
import type { RoleInfo } from '@/api/admin/role';
import { useUploadOpts } from '@/composables/useFile';
import { Plus } from '@element-plus/icons-vue';
import type { FormRules, UploadProps } from 'element-plus';
import type { UploadRes } from '@/api/common';

defineProps({
  roleList: {
    type: Array as PropType<RoleInfo[]>,
    default: () => {
      return [];
    }
  }
});

const emit = defineEmits(['refresh-data']);

const dialogForm = reactive({
  avatar: '',
  gender: '',
  id: 0,
  nickName: '',
  password: '',
  phoneNumber: '',
  role: '',
  userAccount: ''
});

const rules = reactive<FormRules>({
  userAccount: [
    { required: true, message: '用户账号不能为空！', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址！',
      trigger: ['blur', 'change']
    }
  ],
  nickName: [
    { required: true, message: '昵称不能为空！', trigger: 'blur' },
    {
      min: 4,
      max: 40,
      message: '请输入大于4小于40的昵称！',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '密码不能为空！', trigger: 'blur' },
    {
      min: 6,
      max: 12,
      message: '请输入大于6小于12的密码！',
      trigger: 'blur'
    }
  ],
  role: [{ required: true, message: '角色不能为空', trigger: 'change' }]
});

const {
  dialogTitle,
  dialogIsView,
  dialogType,
  openDialog,
  dialogVisible,
  dialogFormRef,
  save
} = usePageListDialog({
  saveForm: dialogForm,
  saveApi: saveOrUpdateUser,
  updateApi: saveOrUpdateUser,
  saveSuccessFunc: () => {
    emit('refresh-data');
  }
});

const { uploadHeaders, uploadUrl, uploadFileTypeList } = useUploadOpts();

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!uploadFileTypeList.includes(rawFile.type)) {
    ElMessage.error(`只能上传${uploadFileTypeList.join(', ')}类型文件`);
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过 2MB!');
    return false;
  }
  return true;
};

const handleAvatarSuccess: UploadProps['onSuccess'] = (response: UploadRes) => {
  dialogForm.avatar = response.data;
};

defineExpose({
  openDialog
});
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="680px">
    <el-form
      ref="dialogFormRef"
      :model="dialogForm"
      :rules="rules"
      label-position="top"
      :disabled="dialogIsView"
    >
      <el-form-item label="用户账号：" prop="userAccount">
        <el-input
          v-model="dialogForm.userAccount"
          placeholder="请输入用户账号"
        ></el-input>
      </el-form-item>

      <el-form-item label="昵称：" prop="nickName">
        <el-input
          v-model="dialogForm.nickName"
          placeholder="请输入昵称"
          maxlength="40"
        ></el-input>
      </el-form-item>

      <el-form-item v-if="dialogType === 'add'" label="密码：" prop="password">
        <el-input v-model="dialogForm.password" show-password type="password" />
      </el-form-item>

      <el-form-item label="手机号：">
        <el-input
          v-model="dialogForm.phoneNumber"
          placeholder="请输入手机号"
          maxlength="11"
        ></el-input>
      </el-form-item>

      <el-form-item label="性别：">
        <el-select v-model="dialogForm.gender" placeholder="请选择性别">
          <el-option
            v-for="item in []"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="角色：" prop="role">
        <el-select v-model="dialogForm.role" placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="头像：">
        <el-upload
          class="w-16 h-16 flex items-start justify-center rounded border"
          :headers="uploadHeaders"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <el-image
            v-if="dialogForm.avatar"
            :src="dialogForm.avatar"
            :lazy="true"
          ></el-image>

          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-center">
        <el-button v-if="!dialogIsView" type="primary" @click="save">
          保存
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
