// @ts-ignore
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
// import nesting from 'tailwindcss/nesting';
import theme from './src/utils/theme';
// import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import';
import postcssModules from 'postcss-modules';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // createStyleImportPlugin({
    //   resolves: [AntdResolve()],
    // }),
  ],
  css: {
    postcss: {
      // @ts-ignore
      plugins: [autoprefixer, postcssModules()],
    },
    preprocessorOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1DA57A', // 配置全局变量
          'primary-color-hover': '#1A66FF',
          'border-color-base': '#DCDFE5',
          'text-color': '#030A1A',
          'normal-icon-color': '#858C99',
          'normal-font-color': '#030A1A',
          ...theme,
        },
        javascriptEnabled: true, // 启用 JavaScript 支持
      },
    },
  },
  resolve: {
    alias: [
      { find: /^~/, replacement: '' },
      { find: /^@\//, replacement: path.resolve(__dirname, './src') + '/' },
      { find: /^@@/, replacement: path.resolve(__dirname, './src/.umi') + '/' },
    ],
    // alias: {
    //   '@@': path.resolve(__dirname, './src/.umi'),
    //   '@': path.resolve(__dirname, './src'),
    //   '~': '',
    // },
  },
  define: {
    DEV_SERVER: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  server: {
    port: 6015,
    host: '0.0.0.0',
    proxy: {
      '/api/py': {
        target: 'http://localhost:3014',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/api/router': {
        target: 'ws://localhost:3003',
        changeOrigin: true,
        ws: true,
        rewriteWsOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
