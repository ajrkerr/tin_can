var path = require('path');
var webpack = require('webpack');

//process.env.NODE_ENV = 'production';
var DEBUG = process.env.NODE_ENV !== 'production';

var plugins = [
  new webpack.optimize.OccurenceOrderPlugin()
];

plugins.push(new webpack.DefinePlugin({"global.GENTLY": false}));

if (DEBUG) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
} else {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    }),
    new webpack.NoErrorsPlugin()
  );
}


var entry = ['./jsx/app.jsx'];
if (DEBUG) {
  entry.push('webpack-dev-server/client?http://localhost:3000', 'webpack/hot/only-dev-server');
}

module.exports = {
  entry: entry,
  output: {
    path: __dirname,
    filename: "js/index.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel",
        query:
        {
          presets:['react','es2015']
        }
      },
      {
        test: /\.css/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query:
        {
          presets:['react','es2015']
        }
      }
    ]
  },
  node: {
    __dirname: true
  },
  devServer: {
    contentBase: "./",
    hot: true,
    stats: {
      colors: true
    }
  },
  plugins: plugins,
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
  }

};
