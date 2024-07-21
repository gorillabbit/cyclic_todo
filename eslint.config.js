import js from "@eslint/js";
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
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];
