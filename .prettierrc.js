module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 80,
  tabWidth: 2,
  semi: false,
  importOrder: ['^@nestjs*', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['decorators-legacy', 'jsx', 'typescript'],
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
}
