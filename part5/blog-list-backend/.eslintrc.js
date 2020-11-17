module.exports = {
	env: {
		commonjs: true,
		es2020: true,
		node: true,
		jest: true,
	},
	extends: "airbnb",
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		indent: [2, "tab"],
		"no-tabs": 0,
		"linebreak-style": ["error", "windows"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		eqeqeq: "error",
		"no-trailing-spaces": "error",
		"object-curly-spacing": ["error", "always"],
		"arrow-spacing": ["error", { before: true, after: true }],
		"no-console": 0,
	},
};
