import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{ts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  {
    ignores: [
      "node_modules/",
      "prisma/generated/**",
      ".prisma/**",   // prisma client generated code
      "src/generated/**", // 👈 skip your generated folder
      "dist/**", // compiled code
    ],
  },
  {
    files: ["**/*.ts"],
    rules: {
      "no-console": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
      "@typescript-eslint/explicit-module-boundary-types": "off", // Allow implicit return types
    },
  },
]);
