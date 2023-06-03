import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx,vue}"'
      },
      stylelint: {
        lintCommand: 'stylelint ./src/**/*.{css,vue}'
      },
      typescript: true
    })
  ]
});
