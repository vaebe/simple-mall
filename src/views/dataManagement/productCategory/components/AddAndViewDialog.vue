<script lang="ts" setup>
import { reactive } from 'vue';
import { saveProductCategoryInfo } from '@/api/admin/dataManagement/productCategory';
import { usePageListDialog } from '@/composables/usePageList';
import type { FormRules } from 'element-plus';

const emit = defineEmits(['refresh-data']);

const dialogForm = reactive({
  id: 0,
  name: '',
  code: '',
  sort: 0
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '商品分类名称不能为空！', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '商品分类code不能为空！', trigger: 'blur' }
  ],
  sort: [{ required: true, message: '排序不能为空!', trigger: 'blur' }]
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
  saveApi: saveProductCategoryInfo,
  updateApi: saveProductCategoryInfo,
  saveSuccessFunc: () => {
    emit('refresh-data');
  }
});

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
      <el-form-item label="商品分类名称" prop="name">
        <el-input
          v-model="dialogForm.name"
          placeholder="请输入商品分类名称"
          maxlength="50"
        ></el-input>
      </el-form-item>

      <el-form-item label="商品分类code" prop="code">
        <el-input
          v-model="dialogForm.code"
          placeholder="请输入昵称"
          maxlength="50"
        ></el-input>
      </el-form-item>

      <el-form-item label="排序">
        <el-input-number
          v-model="dialogForm.sort"
          class="!w-full"
          :min="1"
          controls-position="right"
        />
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
