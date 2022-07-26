module.exports = {
	reactStrictMode: true,
	webpack: function (config, options) {
		config.experiments = { layers: true, topLevelAwait: true }
		return config
	},
}
