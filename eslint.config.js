import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      // Enforce double quotes
      "quotes": ["error", "double"],
      // Enforce semicolons
      "semi": ["error", "always"],
      // Enforce consistent indentation
      "indent": ["error", 4],
      // No console.log in production code
      "no-console": ["warn"],
      // No unused variables
      "no-unused-vars": ["warn"],
      // Require space before/after arrow function's arrow
      "arrow-spacing": ["error", { "before": true, "after": true}],
      // Enforce consistent spacing inside braces
      "object-curly-spacing": ["error", "always"]
    }
  },
]);