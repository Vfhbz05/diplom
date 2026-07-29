import { defineConfig, transformWithOxc } from 'vite'
import react from '@vitejs/plugin-react'

const transformJsxInJs = () => ({
  name: 'transform-jsx-in-js',
  enforce: 'pre',
  async transform(code: any, id: any) {
    if (!id.match(/src\/.*\.js$/)) {
      return null;
    }

    return await transformWithOxc(code, id, {
      lang: 'jsx',
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    transformJsxInJs(),
  ],
});
