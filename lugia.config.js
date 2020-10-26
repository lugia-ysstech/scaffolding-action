import { join } from 'path';

export default {
  disableCSSModules: true,
  cssModulesWithAffix: true,
  entry: './src/index.js',
  publicPath: '/',
  alias: {
    '@': join(__dirname, './src'),
  },
  extraBabelIncludes: [/decamelize/],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@lugia/lugia-web',
        libraryDirectory: 'dist',
      },
      '@lugia/lugia-web',
    ]
  ],
  applyWebpack(webpackConfig, { webpack, merge }) {
    return webpackConfig;
  },
  dllDependenciesExcludes: ['@lugia/lugia-web'],
};
