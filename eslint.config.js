import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import globals from "globals";
export default [
  js.configs.recommended,
  {
    ignores: ["build/**/*"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
