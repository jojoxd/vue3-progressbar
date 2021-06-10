import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import strip from '@rollup/plugin-strip';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({

  optimizeDeps: {
    exclude: ['vue-demi', 'vue'],
  },

  build: {
    minify: false,

    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'vue-progressbar'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [
          'vue'
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  },

  plugins: [
    vue(),

    {
      apply: 'build',
      enforce: 'post',

      ...strip({
        debugger: true,

        include: [
            'lib/**/*.(ts|vue)'
        ],

        functions: [
            'console.*',
            'assert.*',
        ],

        labels: [
            'dev'
        ]
      }),
    },
  ],
});
