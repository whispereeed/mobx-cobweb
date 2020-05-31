module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '/__tests__/.*.spec.[tj]sx?$',
  testPathIgnorePatterns: ['/node_modules/', '/fixtures/', '/models/', '/config/'],
  collectCoverageFrom: ['src/**/**.{ts,tsx}'],
  collectCoverage: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: 'TS1192'
      }
    }
  }
}
