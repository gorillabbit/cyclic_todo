import js from "@eslint/js";
import globals from "globals";
import jestPlugin from "eslint-plugin-jest";

const ignoreConfig = {
  ignores: ["**/*/build/**/*"],
};

export default [
  js.configs.recommended,
  ignoreConfig,
  {
    plugins: {
      jest: jestPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
