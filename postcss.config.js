module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-mq-optimize'),
    require('cssnano')({
      preset: 'default',
    }),
    require('postcss-pxtorem')({
      replace: false,
    }),
  ],
};
