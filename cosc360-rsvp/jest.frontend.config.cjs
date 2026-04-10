module.exports = {
    testEnvironment: "jsdom",
    testMatch: ["<rootDir>/client/src/tests/**/*.frontend.test.jsx"],
    setupFilesAfterEnv: ["<rootDir>/client/src/tests/setup.frontend.js"],
    transform: {
        "^.+\\.[jt]sx?$": "babel-jest",
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "<rootDir>/client/src/tests/styleMock.cjs",
    },
};
