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
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
        { 
            test: /\.(js|jsx)$/, 
            exclude: /node_modules/, 
            use: ["babel-loader"] 
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: 'file-loader'
        },
    ]
  }
};
