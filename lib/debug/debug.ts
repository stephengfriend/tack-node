import Debug from 'debug'

import pkg from '../../package.json'

export default function debug(name: string): Debug {
	return Debug(`${pkg.name}:${name}`)
}
