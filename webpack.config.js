const fs = require('fs');

const { resolve } = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  let envName = "dev";
  if (env.prod) { envName = "production"; }
  if (env.test) { envName = "test"; }

  const ENV = process.env.ENV = process.env.NODE_ENV = envName;

  const ifProd = (x) => env.prod ? x : undefined;

  const removeEmpty = (list) => list.filter(x => !!x);

  let tsConfigCompilerOptionsOverrides = {};
  if (env.test) {
    tsConfigCompilerOptionsOverrides.module = 'commonjs';
    tsConfigCompilerOptionsOverrides.inlineSourceMap = true;
    tsConfigCompilerOptionsOverrides.sourceMap = false;
  }

  return {
    entry: './js/app.ts',
    output: {
      filename: 'bundle.[chunkhash].js',
      path: resolve(__dirname, 'dist'),
      pathinfo: !env.prod
    },

    resolve: {
      extensions: ['', '.js', '.ts']
    },

    context: resolve(__dirname, 'src'),
    devtool: env.prod ? 'source-map' : 'eval',
    bail: env.prod,
    module: {
      preLoaders: [
        {
          test: /\.ts$/,
          loader: "tslint"
        }
      ],
      loaders: [
        {test: /\.ts$/, loader: 'ts', exclude: /node_modules/},
        {test: /\.css$/, loader: 'style!css'}
      ]
    },
    plugins: removeEmpty([
      new HtmlWebpackPlugin({
        // relative to 'context'
        template: './index.html'
      }),
      ifProd(new webpack.optimize.DedupePlugin()),
      ifProd(new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })),
      new webpack.DefinePlugin({
        'ENV': JSON.stringify(ENV),
        'process.env': {
          NODE_ENV: JSON.stringify(ENV)
        }
      }),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: true
        }
      }))
    ])
  };
};
