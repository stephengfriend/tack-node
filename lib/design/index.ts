import { createStitches } from '@stitches/react'

const stitches = createStitches({
	theme: {
		fonts: {
			system: 'system-ui',
		},
		colors: {
			hiContrast: 'hsl(206,10%,5%)',
			loContrast: 'white',
		},
		fontSizes: {
			1: '13px',
			2: '15px',
			3: '17px',
		},
	},
})

export default stitches
export const {
	styled,
	css,
	globalCss,
	keyframes,
	theme,
	createTheme,
	getCssText,
} = stitches
