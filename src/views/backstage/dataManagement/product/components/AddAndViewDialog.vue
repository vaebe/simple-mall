<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { PropType } from 'vue';
import type { ProductCategoryInfo } from '@/api/backstage/dataManagement/productCategory.ts';
import type { ProductInfo } from '@/api/backstage/dataManagement/product.ts';
import { saveProductInfo } from '@/api/backstage/dataManagement/product.ts';
import { usePageListDialog } from '@/composables/usePageList.ts';
import { Plus } from '@element-plus/icons-vue';
import type { FormRules, UploadProps } from 'element-plus';
import { useUploadOpts } from '@/composables/useFile.ts';

defineProps({
  productCategoryInfoList: {
    type: Array as PropType<ProductCategoryInfo[]>,
    default: () => {
      return [];
    }
  }
});

const emit = defineEmits(['refresh-data']);

const dialogForm = reactive<ProductInfo>({
  id: 0,
  info: '',
  name: '',
  pictures: [],
  price: 0,
  productCategoryId: 0,
  stock: 0,
  detailImages: '',
  parameterImages: ''
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: '商品名称不能为空！', trigger: 'blur' }],
  pictures: [
    {
      type: 'array',
      required: true,
      message: '商品图片不能为空！',
      trigger: 'change'
    }
  ],
  price: [{ required: true, message: '商品价格不能为空!', trigger: 'blur' }],
  info: [{ required: true, message: '商品简介不能为空!', trigger: 'blur' }],
  productCategoryId: [
    { required: true, message: '商品分类不能为空!', trigger: 'change' }
  ],
  stock: [{ required: true, message: '商品库存不能为空!', trigger: 'blur' }]
});

// todo 考虑将 详情图片、商品参数图片 从新增分离出去单独上传
// 详情图片
const detailImages = ref([]);

// 商品参数图片
const parameterImages = ref([]);

const formatImages = (imagesStr: string) => {
  if (imagesStr) {
    const list = JSON.parse(imagesStr);
    return list.map((item) => {
      return {
        name: item,
        url: item
      };
    });
  } else {
    return [];
  }
};

const openDialogFunc = (data: ProductInfo) => {
  detailImages.value = formatImages(data.detailImages);
  parameterImages.value = formatImages(data.parameterImages);
};

const beforeSaveFunc = async () => {
  dialogForm.detailImages = JSON.stringify(
    detailImages.value.map((item) => item.url)
  );

  dialogForm.parameterImages = JSON.stringify(
    parameterImages.value.map((item) => item.url)
  );

  return true;
};

const {
  dialogTitle,
  dialogIsView,
  openDialog,
  dialogVisible,
  dialogFormRef,
  save
} = usePageListDialog({
  openDialogFunc,
  saveForm: dialogForm,
  saveApi: saveProductInfo,
  updateApi: saveProductInfo,
  beforeSaveFunc,
  saveSuccessFunc: () => {
    emit('refresh-data');
  }
});

const handleUploadSuccess: UploadProps['onSuccess'] = (res, uploadFile) => {
  const fileLen = dialogForm.pictures.length;
  dialogForm.pictures[fileLen - 1] = {
    url: res.data,
    name: uploadFile.name,
    size: uploadFile.size,
    type: uploadFile.raw?.type,
    productId: dialogForm.id
  };
};

// 图片上传参数
const { uploadHeaders, uploadUrl } = useUploadOpts();

const detailImagesUploadSuccess: UploadProps['onSuccess'] = (
  res,
  uploadFile
) => {
  const fileLen = detailImages.value.length;
  detailImages.value[fileLen - 1] = {
    url: res.data,
    name: uploadFile.name
  };
};

const parameterImagesUploadSuccess: UploadProps['onSuccess'] = (
  res,
  uploadFile
) => {
  const fileLen = parameterImages.value.length;
  parameterImages.value[fileLen - 1] = {
    url: res.data,
    name: uploadFile.name
  };
};

const picturePreviewDialogVisible = ref(false);
const picturePreviewDialogImageUrl = ref('');

const handlePicturePreview: UploadProps['onPreview'] = (uploadFile) => {
  picturePreviewDialogImageUrl.value = uploadFile.url!;
  picturePreviewDialogVisible.value = true;
};

const closePicturePreview = () => {
  picturePreviewDialogVisible.value = false;
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
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="dialogForm.name"
          placeholder="请输入商品名称"
          maxlength="200"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input-number
          v-model="dialogForm.price"
          class="!w-full"
          :min="1"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="商品分类" prop="productCategoryId">
        <el-select
          v-model="dialogForm.productCategoryId"
          placeholder="请选择商品分类"
        >
          <el-option
            v-for="item in productCategoryInfoList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品库存" prop="stock">
        <el-input-number
          v-model="dialogForm.stock"
          class="!w-full"
          :min="1"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="商品简介" prop="info">
        <el-input
          v-model="dialogForm.info"
          :autosize="{ minRows: 2 }"
          type="textarea"
          placeholder="请输入商品简介"
        />
      </el-form-item>

      <el-form-item label="商品图片" prop="pictures">
        <el-upload
          v-model:file-list="dialogForm.pictures"
          :action="uploadUrl"
          :headers="uploadHeaders"
          list-type="picture-card"
          :on-success="handleUploadSuccess"
          :on-preview="handlePicturePreview"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="详情图片">
        <el-upload
          v-model:file-list="detailImages"
          :action="uploadUrl"
          :headers="uploadHeaders"
          list-type="picture-card"
          :on-success="detailImagesUploadSuccess"
          :on-preview="handlePicturePreview"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="参数图片">
        <el-upload
          v-model:file-list="parameterImages"
          :action="uploadUrl"
          :headers="uploadHeaders"
          list-type="picture-card"
          :on-success="parameterImagesUploadSuccess"
          :on-preview="handlePicturePreview"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-image-viewer
      v-if="picturePreviewDialogVisible"
      :url-list="[picturePreviewDialogImageUrl]"
      @close="closePicturePreview"
    ></el-image-viewer>

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
