module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: ["plugin:@typescript-eslint/recommended"],
    env: {browser: true, es2020: true},
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parserOptions: {ecmaVersion: "latest", sourceType: "module"},
    settings: {react: {version: "18.2"}},
    plugins: ["react-refresh"],
    rules: {
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": [
            1,
            {ignoreRestSiblings: true, varsIgnorePattern: "^React$"}
        ]
    }
};
