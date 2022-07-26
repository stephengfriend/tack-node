import cacheManager from 'cache-manager'
import fsStore from 'cache-manager-fs-hash'
import xfetch from 'cross-fetch'
import {
	add,
	format,
	nextSaturday,
	nextSunday,
	parse as parseDate,
	startOfTomorrow,
} from 'date-fns'
import { parse as parseXml } from 'fast-xml-parser'
import withCookies from 'fetch-cookie'
import { parse as parseHtml } from 'node-html-parser'
import { CookieJar } from 'tough-cookie'

import Debug from '../debug'

const debug = Debug('fbc')

const cookies = new CookieJar()
const fetch = withCookies(xfetch, cookies)

const FBC_DATE_FORMAT = 'MM/dd/yyyy'
const FBC_DATE_REGEX = /(\d{4}-\d{2}-\d{2})/
const FBC_ID_REGEX = /(\d+)/

const DEFAULT_HEADERS = {
	'User-Agent':
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:94.0) Gecko/20100101 Firefox/94.0',
	'Accept-Language': 'en-US,en;q=0.5',
	'Accept-Encoding': 'gzip, deflate, br',
	Connection: 'keep-alive',
	'Upgrade-Insecure-Requests': '1',
}

// const GET_REQUEST_HEADERS = {
// 	...DEFAULT_HEADERS,
// 	Origin: 'https://boatreservations.freedomboatclub.com',
// 	Referer: 'https://boatreservations.freedomboatclub.com/',
// }

const POST_REQUEST_HEADERS = {
	...DEFAULT_HEADERS,
	'X-Requested-With': 'XMLHttpRequest',
}

const LOCATION_EXCLUSIONS = [
	231, 169, 261, 446, 479, 345, 344, 114, 118, 216, 347, 354, 99, 433,
]

const parseHtmlFragment = (fragment: string) =>
	parseHtml(`<html><head></head><body>${fragment}</body></html>`)

export default class FBC {
	private cache

	private isLoggedIn = false
	private loginRequest: Promise<Response> | null | undefined

	private username
	private password

	private club: string | undefined
	private memberId: string | undefined

	constructor(options: FBCOptions) {
		this.password = options.password
		this.username = options.username

		this.cache = cacheManager.caching({
			store: fsStore,
			options: {
				path: 'diskcache', //path for cached files
				ttl: 60 * 60, //time to life in seconds
				subdirs: true, //create subdirectories to reduce the
				//files in a single dir (default: false)
				zip: true, //zip files to save diskspace (default: false)
			},
		})

		this.ping()
	}

	private login = async () => {
		if (!this.isLoggedIn && !this.loginRequest) {
			// Test if we're still logged in...
			// Return, if we are

			this.loginRequest = fetch(
				'https://boatreservations.freedomboatclub.com/rest-api/login/',
				{
					method: 'POST',
					headers: {
						...POST_REQUEST_HEADERS,
						Accept: 'application/xml, text/xml, */*; q=0.01',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
						'Cache-Control': 'max-age=0',
					},
					body: JSON.stringify({
						email: this.username,
						password: this.password,
						remember_user: '1',
					}),
				},
			)
		}

		if (!this.isLoggedIn && this.loginRequest) {
			const {
				data: { redirect },
			} = await this.loginRequest.then((res) => res.json())

			if (!this.club || !this.memberId) {
				const { club, memberId } = await this.getClubAndMemberId(redirect)
				this.club = club
				this.memberId = memberId
			}

			this.isLoggedIn = true
			this.loginRequest = null
		}
	}

	private ping = () =>
		fetch('https://boatreservations.freedomboatclub.com/', {
			headers: {
				...DEFAULT_HEADERS,
				Accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Upgrade-Insecure-Requests': '1',
				'Cache-Control': 'max-age=0',
			},
		})

	private getClubAndMemberId = async (reservationsUrl: string) => {
		debug(`Mocking the club and memberId instead of parsing ${reservationsUrl}`)

		return { club: '53', memberId: '73052' }
	}

	getLocations = async (): Promise<Location[]> => {
		return this.cache.wrap('locations', async () => {
			await this.login()

			debug(`Cache miss: getting locations`)

			return fetch(
				'https://boatreservations.freedomboatclub.com/cp/member/53/73052/reservations/avail',
				{
					headers: {
						...DEFAULT_HEADERS,
						Accept:
							'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
						Referer:
							'https://boatreservations.freedomboatclub.com/cp/member/53/73052/reservations/view',
					},
				},
			)
				.then((res) => res.text())
				.then(parseHtmlFragment)
				.then((element) => {
					return element
						.querySelectorAll('div.input_selection.reservations_avail')
						.reduce((acc, ele) => {
							const onclickAttr = ele.getAttribute('onclick')

							if (!onclickAttr) {
								return acc
							}

							const id = FBC_ID_REGEX.exec(onclickAttr)?.[0]

							const indexOfOpenParens = ele.text.indexOf('(')
							const indexOfClosedParens = ele.text.indexOf(')')

							const fullName =
								indexOfOpenParens > 0
									? ele.text.substring(0, indexOfOpenParens).trim()
									: ele.text.trim()

							const [name, description] = fullName.split(' - ')

							if (!id || !name) {
								// TODO: (@stephengfriend) We should add a tracing event here
								return acc
							}

							acc.push({
								id: parseInt(id, 10),
								name,
								description,
								details:
									ele.text.substring(
										indexOfOpenParens + 1,
										indexOfClosedParens,
									) || undefined,
							})

							return acc
						}, [] as Location[])
				})
				.then((locations) =>
					locations.filter(({ id }) => !LOCATION_EXCLUSIONS.includes(id)),
				)
		})
	}

	getVesselClassesByLocation = async (
		locationId: number,
	): Promise<{ id: number; name: string }[]> => {
		return this.cache.wrap(`classesByLocation:${locationId}`, async () => {
			debug(`Cache Miss: Getting classes for location ${locationId}`)

			await this.login()

			return fetch(
				'https://boatreservations.freedomboatclub.com/brcglobal/ajax/vessels/retrieve_vessel_class.php',
				{
					method: 'POST',
					headers: {
						...POST_REQUEST_HEADERS,
						Accept: 'application/xml, text/xml, */*; q=0.01',
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
						Referer: `https://boatreservations.freedomboatclub.com/cp/member/${this.club}/${this.memberId}/reservations/avail`,
					},
					body: `club=${this.club}&location=${locationId}`,
				},
			)
				.then((res) => res.text())
				.then((xmlString) => parseXml(xmlString)?.response?.html)
				.then(parseHtmlFragment)
				.then((element) => {
					return element
						.querySelectorAll('div.input_selection')
						.reduce((acc, ele) => {
							const id = FBC_ID_REGEX.exec(
								ele.getAttribute('onclick') ?? '',
							)?.[0]
							const name = ele
								.querySelector('div.input_selection_int')
								?.text.trim()

							if (!id || !name) {
								// TODO: (@stephengfriend) We should add a tracing event here
								return acc
							}

							acc.push({
								id: parseInt(id, 10),
								name,
							})

							return acc
						}, [] as { id: number; name: string }[])
				})
		})
	}

	getVesselsByLocation = async ({
		locationId,
		date = add(nextSaturday(new Date()), { weeks: 0 }),
    classification,
	}: // dateEnd = add(nextSunday(startOfTomorrow()), { weeks: 1 }),
	VesselsByLocationOptions): Promise<Vessel[]> => {
    const cacheKey = `vesselsByLocation:${locationId}:${format(
      date,
      'yyyy-MM-dd',
    )}${classification ? `:${classification}` : ''}`
    debug(`cacheKey: ${cacheKey}`)
		return this.cache.wrap(cacheKey
			,
			async () => {
				debug(
					`Cache Miss: Getting vessels for location ${locationId} on ${format(
						date,
						'yyyy-MM-dd',
					)}${classification ? ` with classification ${classification}`: ``}`,
				)

				await this.login()

				return fetch(
					'https://boatreservations.freedomboatclub.com/brcglobal/ajax/reservations/avail_request.php',
					{
						method: 'POST',
						headers: {
							...POST_REQUEST_HEADERS,
							Accept: 'application/xml, text/xml, */*; q=0.01',
							'Content-Type':
								'application/x-www-form-urlencoded; charset=UTF-8',
							Referer: `https://boatreservations.freedomboatclub.com/cp/member/${this.club}/${this.memberId}/reservations/avail`,
						},
						body: `club=${this.club}&member=${
							this.memberId
						}&date=${encodeURIComponent(
							format(date, FBC_DATE_FORMAT),
						)}&date_end=&location=${locationId}&vessel=&def_member=${
							this.memberId
						}&classification=${classification ?? ''}&fb_only=false`,
					},
				)
					.then((res) => res.text())
					.then((xmlString) => parseXml(xmlString)?.response?.html)
					.then(parseHtmlFragment)
					.then((element) => {
            const EXCLUDES = ['NO BIMINI', 'Paddle Board', 'Kayak']
						return element.querySelectorAll('div.vessel').reduce((acc, ele) => {
							const name = ele.querySelector('div.name')?.text.trim() || ''
							const onclickContents = ele
								.querySelector('.reservation_button')
								?.getAttribute('onclick')

							const id = FBC_ID_REGEX.exec(onclickContents ?? '')?.[0]
							const dateString = FBC_DATE_REGEX.exec(onclickContents ?? '')?.[0]

							if (!id || !dateString) {
								return acc
							}

							const date = parseDate(dateString, 'yyyy-MM-dd', new Date())

							const hasAvailability = !!onclickContents?.includes('reserve')

              if (!EXCLUDES.filter((exclude) => name.includes(exclude)).length) {
                acc.push({
                  id: parseInt(id, 10),
                  locationId,
                  name,
                  availabilities: [{ date, hasAvailability } as Reservation],
                  hasAvailability,
                } as Vessel)
              }

							return acc
						}, [] as Vessel[])
					})
			},
		)
	}

	public getReservations = async (
		locationId: number,
		vesselId: number,
		date: Date = startOfTomorrow(),
	): Promise<Reservation> => {
		return this.cache.wrap(
			`reservations:${locationId}:${vesselId}:${format(date, 'yyyy-MM-dd')}`,
			async () => {
				debug(
					`Cache Miss: Getting vessels for ${vesselId} at ${locationId} on ${format(
						date,
						'yyyy-MM-dd',
					)}`,
				)

				await this.login()

				const {
					response: { html },
				} = parseXml(
					await fetch(
						'https://boatreservations.freedomboatclub.com/brcglobal/ajax/reservations/avail.php',
						{
							method: 'POST',
							headers: {
								...POST_REQUEST_HEADERS,
								Accept: 'application/xml, text/xml, */*; q=0.01',
								'Content-Type':
									'application/x-www-form-urlencoded; charset=UTF-8',
								Referer: `https://boatreservations.freedomboatclub.com/cp/member/${this.club}/${this.memberId}/reservations/avail`,
							},
							body: `club=${this.club}&member=${
								this.memberId
							}&location=${locationId}&date=${format(
								date,
								'yyyy-MM-dd',
							)}&vessel=${vesselId}&type=reserve_confirm&notHiddenTimes=&passengers%5B%5D=73053`,
						},
					).then((res) => res.text()),
				)

				const availabilities = parseHtmlFragment(html)
					.querySelectorAll('div.reservation_button')
					.map((ele) => !!ele.getAttribute('onclick')?.includes('reserve'))

				// Weekends have separate availabilities and will return split am/pm
				const availability = {
					am: !!availabilities[0],
					pm: availabilities[1] ?? availabilities[0],
				}

				return {
					availability,
					date,
					hasAvailability: availability.am || availability.pm,
				}
			},
		)
	}
}

export interface Location {
	description: string
	details?: string
	id: number
	name: string
	vessels?: Vessel[]
}

export interface Reservation {
	date: Date
	hasAvailability: boolean
	availability?: Availability
}

export interface Availability {
	am: boolean
	pm: boolean
}

export interface Vessel {
	id: number
	locationId: number
	name: string
	availabilities: Reservation[]
	hasAvailability: boolean
}

export interface VesselsByLocationOptions {
	locationId: number
  date?: Date
	classification?: number
}

export interface FBCOptions {
	username: string
	password: string
}
