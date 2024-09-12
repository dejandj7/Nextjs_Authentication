module.exports = {
	mode: 'jit',
	purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	darkMode: false, // or 'media' or 'class',
	important: true,
	theme: {
		extend: {
			spacing: {
				108: '27rem',
				120: '30rem',
				132: '33rem',
				144: '36rem',
				156: '40rem',
				240: '72rem',
				360: '84rem'
			},
			zIndex: {
				100: '100'
			},
			boxShadow: {
				broker: '2px 1px 43px -5px #0f0fa2, 2px 1px 48px -5px #470066'
			},
			backgroundImage: {
				'top-pattern': 'url("/page-bg-top.svg")',
				'bottom-pattern': 'url("/page-bg-bottom.svg")'
			},
			dropShadow: {
				'3xl': '0 35px 35px rgba(0, 0, 0, 0.25)'
			},
			borderWidth: {
				3: '3px'
			},
			colors: {
				purple: {
					150: '#e6e9ff',
					750: '#470066',
					650: '#33057A',
					550: '#3E007B',
					450: '#2727ab',
					350: '#bc34c5',
					250: '#4c1cae'
				},
				blue: {
					750: '#0f0fa2',
					350: '#3A18AB'
				},
				yellow: {
					650: '#cc581f'
				},
				green: {
					550: '#baf518',
					650: '#16E000',
					350: '#16e000',
					450: '#3bc357'
				},
				gray: {
					50: '#f8f9fd',
					150: '#f8fafb',
					250: '#131219',
					350: '#596879'
				},
				orange: {
					400: '#ffbb00',
					500: '#e1ab17',
					600: '#f57f17'
				},
				red: {
					// 150: '#EF5350',
					// 750: '#D32F2F',
					// 650: '#E53935',
					// 550: '#C62828',
					// 450: '#C62828',
					// 350: '#F44336',
					// 250: '#B71C1C'

					150: '#64b5f6',
					750: '#002171',
					650: '#33057A',
					550: '#42a5f5',
					450: '#1976d2',
					350: '#2196f3',
					250: '#0d47a1'
				}
			},
			ringColor: {
				purple: {
					750: '#470066',
					350: '#bc34c5'
				},
				blue: {
					750: '#0f0fa2'
				}
			}
		},
		fontFamily: {
			play: ['Open Sans', 'sans-serif']
		}
	},
	variants: {
		extend: {},
		scrollbar: ['rounded']
	},
	plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')]
}
