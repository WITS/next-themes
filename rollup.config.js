import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/index.js',
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
];
