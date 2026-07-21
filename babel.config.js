module.exports = function (api) {
  api.cache(true)
  return {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          root: ['./src'],
        },
      ],
      ['inline-dotenv', { path: '.env' }],
      '@babel/plugin-transform-export-namespace-from',
      'react-native-worklets/plugin', // need to be the last plugin
    ],
    presets: [
      ['module:@react-native/babel-preset', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  }
}
