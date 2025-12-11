import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    ignores: ["node_modules/**", "dist/**"],
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser } 
  },
  { 
    files: ["**/*.js"], 
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: { sourceType: "commonjs" } 
  },
]);
