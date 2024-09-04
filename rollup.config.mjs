import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { string } from 'rollup-plugin-string';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };
import dayjs from 'dayjs';
import { visualizer } from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';

const plugins = [
  commonjs(),
  nodeResolve(),
  json(),
  string({
    include: 'src/webgl/shaders/**/*'
  })
];
const banner = `/*! p5.js v${pkg.version} ${dayjs().format('MMMM D, YYYY')} */`;
const bundleSize = (name, sourcemap) => {
  return visualizer({
    filename: `analyzer/${name}.html`,
    gzipSize: true,
    brotliSize: true,
    sourcemap
  });
};

export default [
  {
    input: 'src/app.js',
    output: [
      {
        file: './lib/p5.rollup.js',
        format: 'iife',
        name: 'p5',
        banner,
        plugins: [
          bundleSize("p5.js"),
          replace({
            'VERSION_WILL_BE_REPLACED_BY_BUILD': pkg.version
          })
        ]
      },
      {
        file: './lib/p5.rollup.esm.js',
        format: 'esm',
        banner,
        plugins: [
          bundleSize("p5.esm.js"),
          replace({
            'VERSION_WILL_BE_REPLACED_BY_BUILD': pkg.version
          })
        ]
      },
      {
        file: './lib/p5.rollup.min.js',
        format: 'iife',
        name: 'p5',
        banner,
        sourcemap: 'hidden',
        plugins: [
          terser({
            compress: {
              global_defs: {
                IS_MINIFIED: true
              }
            },
            format: {
              comments: false
            }
          }),
          bundleSize("p5.min.js", true),
          replace({
            'VERSION_WILL_BE_REPLACED_BY_BUILD': pkg.version
          })
        ]
      }
    ],
    treeshake: {
      preset: 'smallest',
      // NOTE: remove after we stopped using side effects
      moduleSideEffects: true
    },
    plugins: [
      ...plugins
    ]
  },
  // NOTE: comment to NOT build standalone math module
  {
    input: 'src/math/index.js',
    output: [
      {
        file: './lib/p5.math.js',
        format: 'iife',
        plugins: [
          bundleSize("p5.math.js")
        ]
      },
      {
        file: './lib/p5.math.min.js',
        format: 'iife',
        sourcemap: 'hidden',
        plugins: [
          terser({
            compress: {
              global_defs: {
                IS_MINIFIED: true
              }
            },
            format: {
              comments: false
            }
          }),
          bundleSize("p5.math.min.js")
        ]
      },
      {
        file: './lib/p5.math.esm.js',
        format: 'esm',
        plugins: [
          bundleSize("p5.math.esm.js")
        ]
      }
    ],
    external: ['../core/main'],
    plugins: [
      ...plugins
    ]
  }
];
