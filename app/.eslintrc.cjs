module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // ビルドされたファイルを無視
    "/generated/**/*", // 生成されたファイルを無視
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: ["error", "single"],
    "import/no-unresolved": "off",
    indent: ["error", 4],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/strict-boolean-expressions": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "object-curly-spacing": ["error", "always"],
    "max-len": ["error", { code: 100 }],
  },
};
