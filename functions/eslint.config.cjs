const jsdoc = require("eslint-plugin-jsdoc");
const importPlugin = require("eslint-plugin-import");
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  {
    ignores: [
      "lib/**/*", // ビルドされたファイルを無視
      "generated/**/*", // 生成されたファイルを無視
    ],
  },
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
    },
    plugins: {
      jsdoc,
      import: importPlugin,
      "@typescript-eslint": typescriptEslintPlugin,
    },
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
  },
];
