module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.ts', '.tsx', '.js', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@contexts': './src/contexts',
            '@constants': './src/constants',
            '@types': './src/types',
            '@utils': './src/utils',
            '@i18n': './src/i18n',
            '@data': './src/data'
          }
        }
      ]
    ]
  };
};
