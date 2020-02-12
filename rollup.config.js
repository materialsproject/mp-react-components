import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import lessModules from 'rollup-plugin-less-modules';
import postcss from 'postcss';
import url from 'postcss-url';
import resolve from 'rollup-plugin-node-resolve';
import localResolve from 'rollup-plugin-local-resolve';
const urlOptions = {
  url: 'copy',
  // base path to search assets from
  basePath: [path.resolve('src/assets/images'), path.resolve('src/assets/img/network')],
  // dir to copy assets
  assetsPath: './dist/img',
  // using hash names for assets (generates from asset content)
  useHash: true
};
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

const processor = (code, id) => {
  const postCssOptions = {
    from: id,
    to: id,
    map: {
      prev: code.map
    }
  };
  return postcss()
    .use(url(urlOptions))
    .process(code.css, postCssOptions)
    .then(({ css, map }) => ({
      css,
      map
    }));
};

export default {
  input: 'src/periodic-table/index.ts',
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
  external: p => {
    if (
      [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'prop-types'
      ].indexOf(p) > -1
    ) {
      return true;
    }
    return /^three/.test(p);
  },
  plugins: [
    lessModules({ output: true, processor }),
    localResolve(),
    resolve(),
    typescript({
      typescript: require('typescript'),
      objectHashIgnoreUnknownHack: true
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
    //terser() // TODO(chab) we might want to not mimify it
  ]
};
