import eslintPluginAstro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    // 폴더를 얕게 둔다. index 파일로 경로를 줄이지 않는다.
    files: ['src/**/*.{ts,tsx,astro}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // @/<폴더>/<파일>까지, components만 @/components/<영역>/<파일>까지
              regex: '^@/(?:components/[^/]+/[^/]+/|(?!components/)[^/]+/[^/]+/)',
              caseSensitive: true,
              message:
                'import 경로는 @/폴더/파일, 컴포넌트는 @/components/영역/파일 까지예요. 폴더를 더 깊게 만들지 마세요.',
            },
            { regex: '^\\.\\./', message: '../ 대신 @/ 경로로 import하세요. 같은 폴더는 ./파일로 써요.' },
          ],
        },
      ],
    },
  },
  {
    // src/pages의 index.astro는 Astro 라우팅 규칙이라 뺀다
    files: ['src/**/index.{ts,tsx,astro}'],
    ignores: ['src/pages/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: 'Program', message: 'index 파일 금지: 역할이 드러나는 이름으로 짓고 경로로 직접 import하세요.' },
      ],
    },
  },
  globalIgnores(['dist/**', '.astro/**']),
]);
