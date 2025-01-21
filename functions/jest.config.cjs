module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testMatch: ['**/?(*.)+(spec|test).ts'],
    testTimeout: 10000, // タイムアウト時間を10000ミリ秒に設定
};
