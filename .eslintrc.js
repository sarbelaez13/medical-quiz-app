// .eslintrc.js
module.exports = {
    parser: "@babel/eslint-parser",
    parserOptions: {
      requireConfigFile: false,
      babelOptions: {
        presets: ["@babel/preset-env", "@babel/preset-react"],
        plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
      }
    },
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    rules: {
      // your ESLint rules
      'react/prop-types': 'off'
    },
  };
  