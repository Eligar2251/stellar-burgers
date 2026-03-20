module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@components$': '<rootDir>/src/components/index.ts',
    '^@ui$': '<rootDir>/src/components/ui/index.ts',
    '^@pages$': '<rootDir>/src/pages/index.ts',
    '\\.(css|scss|sass)$': 'jest-css-modules-transform',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/jest.fileMock.js'
  },
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};