import preact from '@preact/preset-vite'
import { duckDuckGoApi, generateMetadata } from 'userscript-config'
import { defineConfig } from 'vite'
import monkey, { cdn } from 'vite-plugin-monkey'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    monkey({
      entry: 'src/index.tsx',
      userscript: generateMetadata({
        name: 'Naver Dictionary',
        description: '불편한 부분을 수정하며 개선 사항을 추가합니다.',
        version: '0.1.0',
        icon: duckDuckGoApi('dict.naver.com'),
        match: ['https://hanja.dict.naver.com/'],
        grant: ['GM_addStyle', 'GM_addElement'],
        'run-at': 'document-start',
      }),
      build: {
        externalGlobals: {
          preact: cdn.jsdelivr('preact', 'dist/preact.min.js'),
        },
      },
    }),
    tsconfigPaths(),
  ],
})
