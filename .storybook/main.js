module.exports = {
  stories: ['../src/stories/**/**/*.stories.@(ts|tsx|js|jsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-actions'
    // '@storybook/addon-knobs/register',
    // '@storybook/addon-storysource'
  ],
  core: {
    builder: 'webpack5'
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader')
        }
      ]
    });
    config.resolve.extensions.push('.ts', '.tsx');
    config.module.rules.push({
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    });
    return config;
  }
};
