export default [
  {
    root: true,
    extends: ["eslint:recommended"],
    ignorePatterns: ["dist"],
    parser: "@typescript-eslint/parser",
    plugins: ["react-refresh"],
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
