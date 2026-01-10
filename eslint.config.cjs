// eslint.config.cjs
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

// безопасно извлечём только допустимые поля из рекомендованного конфига плагина
const tsRecommended = (tsPlugin && tsPlugin.configs && tsPlugin.configs.recommended) || {};
const recommendedRules = tsRecommended.rules || {};
const recommendedLanguageOptions = tsRecommended.languageOptions || {};

module.exports = [
    // базовые languageOptions и подключение плагина как объекта
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
                // project: "./tsconfig.json" // включайте только при необходимости
            },
            // если в recommended есть languageOptions, можно аккуратно слить их:
            ...recommendedLanguageOptions
        },
        plugins: {
            "@typescript-eslint": tsPlugin
        }
    },

    // правила и расширения для TypeScript файлов — используем только rules из recommended
    {
        files: ["**/*.ts", "**/*.tsx"],
        ignores: ["dist/**", "node_modules/**"],
        // НЕ включаем ...tsPlugin.configs.recommended целиком (там может быть extends)
        rules: {
            // сначала правила из recommended (если есть)
            ...recommendedRules,

            // затем ваши переопределения/дополнения
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-console": "off",
            "no-debugger": "warn",
            "prefer-const": "warn"
        }
    },

    // настройки для JavaScript файлов
    {
        files: ["**/*.js"],
        rules: {}
    }
];
