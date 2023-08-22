module.exports = {
    root: true,
    env: {
        node: true,
    },
    "rules": {
        "no-console": "off"
    },
    extends: ["plugin:vue/essential", "eslint:recommended"],
    parserOptions: {
        parser: "@babel/eslint-parser",
    },
};