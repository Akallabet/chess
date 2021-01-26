const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[fullhash].app.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Chess Board',
      template: 'src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.mp3$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/sounds/[name].[ext]',
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8000,
  },
}
