<script lang="ts" setup>
import { reactive } from 'vue';
import type { PropType } from 'vue';
import { saveOrUpdateSlideshowInfo } from '@/api/backstage/dataManagement/slideshow';
import type { EnumInfo } from '@/api/backstage/systemManagement/dictionary';
import { usePageListDialog } from '@/composables/usePageList.ts';
import { useUploadOpts } from '@/composables/useFile.ts';
import { Plus } from '@element-plus/icons-vue';
import type { FormRules, UploadProps } from 'element-plus';
import type { UploadRes } from '@/api/common';

defineProps({
  slideshowTypeList: {
    type: Array as PropType<EnumInfo[]>,
    default: () => {
      return [];
    }
  }
});

const emit = defineEmits(['refresh-data']);

const dialogForm = reactive({
  jumpLink: '',
  description: '',
  id: 0,
  imageURL: '',
  type: ''
});

const rules = reactive<FormRules>({
  imageURL: [
    { required: true, message: '轮播图不能为空！', trigger: ['blur', 'change'] }
  ],
  type: [{ required: true, message: '类型不能为空！', trigger: 'change' }]
});

const {
  dialogTitle,
  dialogIsView,
  openDialog,
  dialogVisible,
  dialogFormRef,
  save
} = usePageListDialog({
  saveForm: dialogForm,
  saveApi: saveOrUpdateSlideshowInfo,
  updateApi: saveOrUpdateSlideshowInfo,
  saveSuccessFunc: () => {
    emit('refresh-data');
  }
});

const { uploadHeaders, uploadUrl, beforeImgUpload } = useUploadOpts();

const handleAvatarSuccess: UploadProps['onSuccess'] = (response: UploadRes) => {
  dialogForm.imageURL = response.data;
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
      <el-form-item label="类型：" prop="type">
        <el-select v-model="dialogForm.type" placeholder="请选择类型">
          <el-option
            v-for="item in slideshowTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="跳转链接">
        <el-input
          v-model="dialogForm.jumpLink"
          placeholder="请输入跳转链接"
        ></el-input>
      </el-form-item>

      <el-form-item label="描述：">
        <el-input
          v-model="dialogForm.description"
          :autosize="{ minRows: 2 }"
          type="textarea"
          placeholder="请输入描述："
        />
      </el-form-item>

      <el-form-item label="轮播图：" prop="imageURL">
        <el-upload
          class="w-full h-40 flex items-center justify-center rounded border"
          :headers="uploadHeaders"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeImgUpload"
        >
          <el-image
            v-if="dialogForm.imageURL"
            class="w-full h-full"
            :src="dialogForm.imageURL"
            :lazy="true"
          ></el-image>
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <div class="flex justify-center">
      <el-button v-if="!dialogIsView" type="primary" @click="save">
        保存
      </el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
