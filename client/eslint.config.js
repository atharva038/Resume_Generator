import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {ignores: ["dist"]},
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: {jsx: true},
        sourceType: "module",
      },
    },
    settings: {react: {version: "18.3"}},
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        {allowConstantExport: true},
      ],
      "react/prop-types": "off",
      "no-console": "off", // Allow console statements for now
      "no-unused-vars": ["warn", {argsIgnorePattern: "^_"}],
      "react/display-name": "off",
      "react/no-unescaped-entities": "off", // Disable apostrophe/quote warnings
      "react/no-unknown-property": "off", // Allow custom properties like jsx
      "react/jsx-no-undef": "error", // Keep undefined component errors
      "react-hooks/exhaustive-deps": "warn", // Warn instead of error
      "react-hooks/purity": "off", // Turn off purity checks (Math.random, Date.now)
      "react-hooks/immutability": "off", // Turn off immutability checks
      "react-hooks/set-state-in-effect": "off", // Allow setState in effects
    },
  },
];
