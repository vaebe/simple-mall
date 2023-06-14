<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus';
import { computed, reactive, ref, onBeforeUnmount, onMounted } from 'vue';
import { userLogin, userRegister, getVerificationCode } from '@/api/login';
import { useUserStore } from '@/store';
import { cloneDeep } from 'lodash-es';
import { Encrypt } from '@/utils/password';

const carouselList = [
  'http://rvdcrcklr.bkt.clouddn.com/home-carousel/home-carousel-1.jpeg',
  'http://rvdcrcklr.bkt.clouddn.com/home-carousel/home-carousel-2.jpeg',
  'http://rvdcrcklr.bkt.clouddn.com/home-carousel/home-carousel-3.jpeg',
  'http://rvdcrcklr.bkt.clouddn.com/home-carousel/home-carousel-4.jpeg',
  'http://rvdcrcklr.bkt.clouddn.com/home-carousel/home-carousel-6.jpg'
];

const { VITE_APP_TITLE } = import.meta.env;

// 判断当前是否是登录页面
const isLogin = ref(true);
const loginButText = computed(() => (isLogin.value ? '登录' : '点击注册'));
const tipsText = computed(() =>
  isLogin.value ? '没有账号，点击注册！' : '已有账号，点击登录！'
);

// 切换页面类型： 登录｜注册
const pageTypeChange = () => {
  isLogin.value = !isLogin.value;
};

// 验证码倒计时
const captchaCountdown = ref(0);

onMounted(() => {
  // 获取缓存的倒计时
  const storeCaptchaCountdown = parseInt(
    window.localStorage.getItem('captchaCountdown') || '0'
  );
  captchaCountdown.value = storeCaptchaCountdown;

  // 缓存的倒计时不等于 0 时继续进行倒计时
  if (storeCaptchaCountdown !== 0) {
    startCaptchaCountdown();
  }
});

// 获取验证码的定时器
let captchaCountdownTimer = 0;
// 清除获取验证码的定时器
const clearCaptchaCountdownTimer = () => {
  window.clearInterval(captchaCountdownTimer);
};

// 开始倒计时
const startCaptchaCountdown = () => {
  captchaCountdown.value = 60;

  // 开始定时器
  captchaCountdownTimer = window.setInterval(() => {
    captchaCountdown.value -= 1;
    // 缓存倒计时
    localStorage.setItem('captchaCountdown', captchaCountdown.value + '');

    // 倒计时小于 1 赋值 0 并清除定时器
    if (captchaCountdown.value < 1) {
      captchaCountdown.value = 0;
      clearCaptchaCountdownTimer();
    }
  }, 1000);
};

// 页面销毁前清除定时器
onBeforeUnmount(() => {
  clearCaptchaCountdownTimer();
});

const { setLoginResData } = useUserStore();

const loginForm = reactive({
  userAccount: '',
  password: '',
  code: ''
});

const loginFormRules = reactive<FormRules>({
  userAccount: [
    {
      required: true,
      message: '账号不能为空！',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '请输入正确的邮箱地址！',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空！',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: '验证码不能为空！',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 6,
      message: '请输入六位验证码！',
      trigger: 'blur'
    }
  ]
});

const loginFormRef = ref<FormInstance>();

// 发送验证码
const sendTheVerificationCode = () => {
  // 获取验证码倒计时大于 0 直接返回
  if (captchaCountdown.value > 0) {
    return;
  }

  // 验证用户账号是否填写正确
  loginFormRef.value?.validateField('userAccount', (valid) => {
    if (valid) {
      // 发送验证码
      getVerificationCode({ email: loginForm.userAccount }).then(() => {
        ElMessage.success('验证码发送成功！');

        // 验证码发送成功开始倒计时
        startCaptchaCountdown();
      });
    } else {
      ElMessage.warning('请检查账号是否填写正确！');
    }
  });
};

// 注册
const register = () => {
  userRegister(loginForm).then((res) => {
    setLoginResData(res.data);
    ElMessage.success('注册成功！');
  });
};

// 登录
const login = () => {
  const opts = cloneDeep(loginForm);

  // 对密码进行加密
  opts.password = Encrypt(loginForm.password);

  userLogin(opts).then((res) => {
    setLoginResData(res.data);
    ElMessage.success('登录成功！');
  });
};

// 登录或者注册
const loginOrRegister = () => {
  // 校验表单数据是否填写正确，正确调用对应的函数，错误则进行提示
  loginFormRef.value?.validate((val) => {
    if (val) {
      isLogin.value ? login() : register();
    } else {
      ElMessage.warning('请检查表单是否填写正确！');
    }
  });
};
</script>

<template>
  <div class="login-box flex items-center">
    <div class="w-4/12">
      <el-carousel indicator-position="none" height="100vh">
        <el-carousel-item v-for="item in carouselList" :key="item">
          <el-image :src="item" class="w-full h-full"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="w-8/12 flex justify-center">
      <div class="w-5/12 flex flex-col items-center">
        <h1 class="text-4xl tracking-widest">{{ VITE_APP_TITLE }}</h1>
        <h2 class="mt-6 mb-10 text-sm tracking-widest text-gray-400">
          让购物变得愉快，想你所想！
        </h2>

        <el-form
          ref="loginFormRef"
          class="w-full p-1 mb-2 rounded bg-gray-50 dark:bg-stone-700"
          :model="loginForm"
          :rules="loginFormRules"
          :label-width="isLogin ? '52px' : '70px'"
        >
          <el-form-item prop="userAccount" label="账号">
            <el-input v-model="loginForm.userAccount" />
          </el-form-item>

          <el-form-item v-if="!isLogin" prop="code" label="验证码:">
            <el-input v-model="loginForm.code" placeholder="请输入验证码">
              <template #append>
                <span v-if="captchaCountdown" class="cursor-pointer">
                  {{ captchaCountdown }}s
                </span>
                <span
                  v-else
                  class="cursor-pointer"
                  @click="sendTheVerificationCode"
                >
                  验证码
                </span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input
              v-model="loginForm.password"
              show-password
              type="password"
            />
          </el-form-item>
        </el-form>

        <el-button type="primary" class="w-6/12" @click="loginOrRegister">
          {{ loginButText }}
        </el-button>

        <p
          class="mt-4 text-sm text-gray-300 cursor-pointer hover:text-blue-400"
          @click="pageTypeChange"
        >
          {{ tipsText }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-box {
  width: 100vw;
  height: 100vh;
}
</style>
