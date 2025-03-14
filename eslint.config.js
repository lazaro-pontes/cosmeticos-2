module.exports = [
  {
    ignores: ["node_modules"], // Ignora a pasta node_modules
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest", // Usa a versão mais recente do ECMAScript
      sourceType: "module",
    },
    rules: {
      semi: ["error", "always"], // Exige ponto e vírgula
      quotes: ["error", "double"], // Exige aspas duplas
      "no-console": "off", // Permite console.log()
    },
  },
];
