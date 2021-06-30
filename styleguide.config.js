module.exports = {
  components: 'src/components/**/[A-Z]*.tsx',
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json').parse
};
