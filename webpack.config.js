const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'bundle.js',
  },
  optimization: {
    minimize: true,
  },
  devServer: {
    port: 9000,
    hot: true,
  },
  module: {
    rules: [
        { 
            test: /\.(js|jsx)$/, 
            exclude: /node_modules/, 
            use: ["babel-loader"] 
        },
    ]
  }
};
