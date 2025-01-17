<script lang="ts" setup>
import { reactive } from 'vue';
import type { PropType } from 'vue';
import { saveOrUpdateUser } from '@/api/backstage/systemManagement/user.ts';
import { usePageListDialog } from '@/composables/usePageList.ts';
import type { RoleInfo } from '@/api/backstage/systemManagement/role.ts';
import { useUploadOpts } from '@/composables/useFile.ts';
import { Plus } from '@element-plus/icons-vue';
import type { FormRules, UploadProps } from 'element-plus';
import type { UploadRes } from '@/api/common.ts';
import type { EnumInfo } from '@/api/backstage/systemManagement/dictionary';

defineProps({
  roleList: {
    type: Array as PropType<RoleInfo[]>,
    default: () => {
      return [];
    }
  },
  genderList: {
    type: Array as PropType<EnumInfo[]>,
    default: () => {
      return [];
    }
  },
  /*
  显示角色设置
   */
  showRoleSet: {
    type: Boolean,
    default: true
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
      message: '请输入大于4小于40长度的昵称！',
      trigger: 'blur'
    }
  ],
  password: [
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
  openDialog,
  dialogVisible,
  dialogType,
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

const { uploadHeaders, uploadUrl, beforeImgUpload } = useUploadOpts();

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

      <el-form-item
        label="密码："
        prop="password"
        :rules="{
          required: dialogType === 'add',
          message: '密码不能为空！',
          trigger: 'blur'
        }"
      >
        <el-input v-model="dialogForm.password" type="password" show-password />
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
            v-for="item in genderList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="showRoleSet" label="角色：" prop="role">
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
          class="w-40 h-40 flex items-center justify-center rounded border overflow-hidden"
          :headers="uploadHeaders"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeImgUpload"
        >
          <el-image
            v-if="dialogForm.avatar"
            :src="dialogForm.avatar"
            :lazy="true"
          ></el-image>

          <el-icon v-else :size="30">
            <Plus />
          </el-icon>
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
