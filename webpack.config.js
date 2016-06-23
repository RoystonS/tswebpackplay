const { resolve } = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
  const ifProd = (x) => env.prod ? x : undefined;
  const removeEmpty = (list) => list.filter(x => !!x);

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
      ifProd(new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      })),
      ifProd(new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: true
        }
      }))
    ])
  };
};
