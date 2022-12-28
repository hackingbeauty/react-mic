const webpack = require('webpack')
const path = require('path')

const PATH_ROOT = path.resolve(__dirname, './')
const PATH_SRC = path.resolve(PATH_ROOT, 'src/')
const PATH_OUT = path.resolve(PATH_ROOT, 'dist/')

module.exports = {
  mode: 'production',

  entry: [path.resolve(PATH_SRC, 'index.js')],

  output: {
    path: PATH_OUT,
    filename: 'index.js',
    library: 'ReactMic',
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },

  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react'
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom'
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      },
      __DEVELOPMENT__: false
    })
  ]
}
