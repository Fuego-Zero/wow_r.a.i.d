module.exports = {
  root: true,
  extends: [require.resolve('@yfsdk/configs/src/eslint')],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    '@typescript-eslint/naming-convention': 0,
  },
};
