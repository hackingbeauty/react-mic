const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const PATH_ROOT = path.resolve(__dirname, './demo')
const PATH_SRC = path.resolve(PATH_ROOT, 'src/')
const PATH_OUT = path.resolve(PATH_ROOT, 'dist/')


module.exports = {
  mode: 'production',

  entry: [
    path.resolve(PATH_SRC, 'index.js')
  ],

  output: {
    path: PATH_OUT,
    filename: 'index.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        loaders: ['arraybuffer-loader']
      },
      {
        test: /\.scss$|\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.jpg$|\.gif$|\.png$|\.svg$/,
        use: ['url-loader']
      },
      {
        test: /\.woff$|\.woff2$|\.eot$|\.tff$|\.ttf$/,
        loader: 'file-loader?publicPath=../&name=./assets/fonts/[name].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'production'"
      },
      __DEVELOPMENT__: false
    }),
    new HtmlWebpackPlugin({
      hash: true,
      title: 'React-Mic',
      filename: `${PATH_OUT}/index.html`,
      template: `${PATH_SRC}/index.html`,
    }),
    new ExtractTextPlugin({ filename: 'bundle.css' })
  ]
}
