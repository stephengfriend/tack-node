module.exports = {
	process() {
		return 'module.exports = {};'
	},
	getCacheKey() {
		return 'jest.transform.js'
	},
}
