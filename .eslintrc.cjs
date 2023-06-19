module.exports = {
     "env": {
          "browser": true,
          "es2021": true
     },
     "extends": [
          "eslint:recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:react/recommended"
     ],
     "overrides": [
          {
               "env": {
                    "node": true
               },
               "files": [
                    ".eslintrc.{js,cjs}"
               ],
               "parserOptions": {
                    "sourceType": "script"
               }
          }
     ],
     "parser": "@typescript-eslint/parser",
     "parserOptions": {
          "ecmaVersion": "latest",
          "sourceType": "module"
     },
     "plugins": [
          "@typescript-eslint",
          "react"
     ],
     "rules": {
          "indent": [
               "error",
               5
          ],
          "linebreak-style": [
               "error",
               "windows"
          ],
          "quotes": [
               "error",
               "double"
          ],
          "semi": [
               "error",
               "always"
          ],
          "react/react-in-jsx-scope": "off",
          // allow jsx syntax in js files (for next.js project)
          "react/jsx-filename-extension": [1, {"extensions": [".ts", ".tsx"]}], //should add ".ts" if typescript project
     }
};
