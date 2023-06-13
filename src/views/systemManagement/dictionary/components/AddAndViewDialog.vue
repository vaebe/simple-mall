<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { resetObjToPrimitiveType } from '@/utils/tool';
import { saveEnumInfo } from '@/api/admin/systemManagement/dictionary';
import type { EnumInfo } from '@/api/admin/systemManagement/dictionary';

const emit = defineEmits(['refresh-data']);

const saveForm = reactive({
  id: 0,
  name: '',
  code: '',
  typeName: '',
  typeCode: '',
  parentId: ''
});

const rules = reactive<FormRules>({
  name: { required: true, message: '枚举名称不能为空', trigger: 'blur' },
  code: { required: true, message: '枚举code不能为空', trigger: 'blur' },
  typeName: {
    required: true,
    message: '枚举类型名称不能为空',
    trigger: 'blur'
  },
  typeCode: { required: true, message: '枚举类型code不能为空', trigger: 'blur' }
});

const dialogTitle = ref('新增');
const showDialog = ref(false);
const openDialog = (type: string, data?: EnumInfo) => {
  if (type === 'add') {
    Object.assign(saveForm, resetObjToPrimitiveType(saveForm));
    dialogTitle.value = '新增';
  } else {
    Object.assign(saveForm, data);
    dialogTitle.value = '编辑';
  }

  showDialog.value = true;
};

const saveFormRef = ref<FormInstance>();
const dialogClose = () => {
  if (saveFormRef.value) {
    saveFormRef.value.resetFields();
  }
};

const save = () => {
  if (!saveFormRef.value) return;

  saveFormRef.value.validate((valid) => {
    if (valid) {
      // 状态等于1时 是草稿
      saveEnumInfo(saveForm).then(() => {
        showDialog.value = false;
        emit('refresh-data');
        ElMessage.success('保存成功！');
      });
    } else {
      ElMessage.warning('请检查表单是否正确填写！');
    }
  });
};

defineExpose({
  openDialog
});
</script>

<template>
  <el-dialog
    v-model="showDialog"
    :title="dialogTitle"
    append-to-body
    top="1%"
    width="620px"
    @close="dialogClose"
  >
    <el-form
      ref="saveFormRef"
      :model="saveForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="类型名称:" prop="typeName">
        <el-input
          v-model="saveForm.typeName"
          placeholder="请输入枚举类型名称"
          maxlenght="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="类型code:" prop="typeCode">
        <el-input
          v-model="saveForm.typeCode"
          placeholder="请输入枚举类型code"
          maxlenght="20"
        ></el-input>
      </el-form-item>

      <el-form-item label="枚举名称:" prop="name">
        <el-input
          v-model="saveForm.name"
          placeholder="请输入枚举名称"
          maxlenght="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="枚举code:" prop="code">
        <el-input
          v-model="saveForm.code"
          placeholder="请输入枚举code"
          maxlenght="20"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-row justify="center">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="showDialog = false">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
