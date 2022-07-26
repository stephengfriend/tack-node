import Head from 'next/head'

const Home: React.FunctionComponent = ({ children }) => (
	<div>
		<Head>
			<title>Tack</title>
			<link
				rel="apple-touch-icon"
				sizes="152x152"
				href="/apple-touch-icon.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/favicon-32x32.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/favicon-16x16.png"
			/>
			<link rel="manifest" href="/site.webmanifest" />
			<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2b5797" />
			<meta name="apple-mobile-web-app-title" content="Tack" />
			<meta name="application-name" content="Tack" />
			<meta name="msapplication-TileColor" content="#2b5797" />
			<meta name="theme-color" content="#2b5797" />
			<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
		</Head>
		<div className="bg-gray-800 pb-32">
			<nav className="bg-gray-800">
				<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
					<div className="border-b border-gray-700">
						<div className="flex items-center justify-between h-16 px-4 sm:px-0">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<span className="text-lg text-white font-semibold">
										<span className="text-xl">🛥</span> Tack
									</span>
								</div>
								<div className="hidden md:block">
									<div className="ml-10 flex items-baseline">
										<a
											href="/"
											className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
										>
											Dashboard
										</a>
										<a
											href="/reservations"
											className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
										>
											Reservations
										</a>
									</div>
								</div>
							</div>
							<div className="-mr-2 flex md:hidden">
								{/* <!-- Mobile menu button --> */}
								<button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
									{/* <!-- Menu open: "hidden", Menu closed: "block" --> */}
									<svg
										className="block h-6 w-6"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>

									{/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
									<svg
										className="hidden h-6 w-6"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* <!--
        Mobile menu, toggle classes based on menu state.

        Open: "block", closed: "hidden"
      --> */}
				<div className="hidden border-b border-gray-700 md:hidden">
					<div className="px-2 py-3 sm:px-3">
						<a
							href="/"
							className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700"
						>
							Dashboard
						</a>
						<a
							href="/reservations"
							className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
						>
							Reservations
						</a>
					</div>
				</div>
			</nav>
			<header className="py-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl leading-9 font-bold text-white">Dashboard</h1>
				</div>
			</header>
		</div>

		<main className="-mt-32">
			<div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 pb-64">
					{children}
				</div>
			</div>
		</main>
	</div>
)

export default Home
