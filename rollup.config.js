import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/client/index.tsx',
    output: {
      file: 'dist/client/index.js',
      format: 'cjs'
    },
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript(),
      {
        banner: "'use client';",
      },
    ],
  },
  {
    input: 'src/server/index.tsx',
    output: {
      file: 'dist/server/index.js',
      format: 'cjs'
    },
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript(),
    ],
  },
  {
    inlineDynamicImports: true,
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript(),
    ],
  },
  // {
  //   input: 'main-b.js',
  //   output: [
  //     {
  //       file: 'dist/bundle-b1.js',
  //       format: 'cjs'
  //     },
  //     {
  //       file: 'dist/bundle-b2.js',
  //       format: 'es'
  //     }
  //   ]
  // },
];
