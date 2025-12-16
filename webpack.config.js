const path = require('path');

module.exports = {
  mode: 'development',
  target: 'node', // extensions run in a node context
  entry: {
    extension: './src/extension.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs',
    devtoolModuleFilenameTemplate: '../../[resource-path]'
  },
  devtool: 'nosources-source-map',
  externals: {
    'vscode': 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded.
  },
  resolve: {
    extensions: ['.ts', '.js'],
    mainFields: ['module', 'main']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  ignoreWarnings: [/Critical dependency: the request of a dependency is an expression/]
};
