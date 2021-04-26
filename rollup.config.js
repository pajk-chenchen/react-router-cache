import path from 'path'
import babel from 'rollup-plugin-babel'
import ts from '@wessberg/rollup-plugin-ts'
import css from 'rollup-plugin-css-only'
import { terser } from 'rollup-plugin-terser'

module.exports = {
  input: path.resolve(__dirname, 'build/react-router/react-router.tsx'),
  output: [{
    file: 'esm/index.js',
    format: 'esm',
    sourcemap: true
  }],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    ts(),
    css({ output: 'bundle.css' }),
    terser()
  ]
}