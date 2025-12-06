import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './' // path to Next.js app
})

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
    // Handle module aliases from tsconfig.json
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/tests/**/*.(test|spec).[jt]s?(x)'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/hooks/**/*.{js,ts,jsx,tsx}'
  ],
  coverageReporters: ['text', 'lcov', 'html']
}

export default createJestConfig(config)
