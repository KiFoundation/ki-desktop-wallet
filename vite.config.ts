import path, { dirname, resolve } from 'path';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
    VueI18nPlugin({
      runtimeOnly: false,
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/renderer/public/lang/**'), // provide a path to the folder where you'll store translation data (see below)
    }),
    vueJsx(),
  ],
  root: path.join(__dirname, 'src', 'renderer'),
  publicDir: 'public',
  build: {
    outDir: path.join(__dirname, 'build', 'renderer'),
    emptyOutDir: true,
    // assetsDir: '',
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  esbuild: false,
  define: {},
  resolve: {
    alias: [
      {
        find: 'vue',
        replacement: '@vue/compat',
      },
      { find: 'stream', replacement: require.resolve('stream-browserify') },
      { find: 'crypto', replacement: require.resolve('crypto-browserify') },
      { find: 'buffer', replacement: 'buffer/' },
      {
        find: '@static',
        replacement: path.resolve('./src/renderer/public'),
      },
      {
        find: '@cmp',
        replacement: path.resolve('./src/renderer/components'),
      },
      {
        find: '@views',
        replacement: path.resolve('./src/renderer/views'),
      },
      {
        find: '@helpers',
        replacement: path.resolve('./src/renderer/helpers'),
      },
      {
        find: '@services',
        replacement: path.resolve('./src/renderer/services'),
      },
      {
        find: '@router',
        replacement: path.resolve('./src/renderer/router'),
      },
      {
        find: '@store',
        replacement: path.resolve('./src/renderer/store'),
      },
      {
        find: 'types',
        replacement: path.resolve('./src/renderer/types'),
      },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      alias: {
        crypto: require.resolve('crypto-browserify'),
      },
      plugins: [],
    },
  },
});
