#!/usr/bin/env node

const cacheManager = require('cache-manager')
const fsStore = require('cache-manager-fs-hash')

const cache = cacheManager.caching({
	store: fsStore,
	options: {
		path: 'diskcache', //path for cached files
		ttl: 60 * 60, //time to life in seconds
		subdirs: true, //create subdirectories to reduce the
		//files in a single dir (default: false)
		zip: true, //zip files to save diskspace (default: false)
	},
})

console.log(process.argv)

cache.get(process.argv.slice(2).join(':')).then(console.log)
