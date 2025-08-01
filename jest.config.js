module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    roots: ['<rootDir>/_tests_'],
    testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@libs/(.*)$': '<rootDir>/libs/$1',
        '^@utils/(.*)$': '<rootDir>/utils/$1',
        '^@thirdParty/(.*)$': '<rootDir>/third_partys/$1',
        // Thêm các alias khác nếu cần
    },
};