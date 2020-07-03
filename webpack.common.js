const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let configureWebPack = new HtmlWebpackPlugin({
  filename: 'menu.html',
  template: 'src/public/html/menu.html',
});

let exposedHtml = ['index', 'showAvailableGames', 'showAvailableRooms'];

let htmlFileMapper = exposedHtml.map(function(name) {
  return new HtmlWebpackPlugin({
    filename: name + '.html',
    template: 'src/public/html/' + name + '.html'
  })
});

module.exports = {
  entry: {
    game: './src/public/index.js',
  }, 
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }, {
        test: /\.(sass|less|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ]
      }, {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    configureWebPack
  ].concat(htmlFileMapper)
};
