import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import styles from 'rollup-plugin-styles';
//import urlPlugin from '@rollup/plugin-url'; we use image instead
import resolve from 'rollup-plugin-node-resolve';
import image from '@rollup/plugin-image';
import localResolve from 'rollup-plugin-local-resolve';
import replace from 'rollup-plugin-replace';
// import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  external: (p) => {
    if (
      [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'prop-types'
      ].indexOf(p) > -1
    ) {
      return true;
    }
    // prevent duplicate import of three
    // prevent packages that have css separately bundled to fail
    return /^three/.test(p) || /^@trendmicro/.test(p) || /^react-toastify/.test(p);
  },
  plugins: [
    styles(),
    image(),
    localResolve(),
    resolve(),
    typescript({
      tsconfigDefaults: {},
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {},
      verbosity: 1 // overrides for debugging
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
    //terser() // TODO(chab) we might want to not mimify it
  ]
};
