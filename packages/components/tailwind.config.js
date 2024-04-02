import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class", '.graphiql-dark'],
	content: ["src/**/*.{js,jsx}", "src/*.{js,jsx}", "src/components/*.{js,jsx}", "src/components/**/*.{js,jsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				'wp-primary': 'var(--wp--preset--color--primary)',
				'wp-secondary': 'var(--wp--preset--color--secondary)',
				'wp-base': 'var(--wp--preset--color--base)',
				'wp-contrast': 'var(--wp--preset--color--contrast)',
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
				display: ['Lexend', ...defaultTheme.fontFamily.sans],
			},
			fontSize: {
				'wp-small': 'var(--wp--preset--font-size--small)',
				'wp-medium': 'var(--wp--preset--font-size--medium)',
				'wp-large': 'var(--wp--preset--font-size--large)',
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				'fade-in': {
					from: {
						opacity: 0,
					},
					to: {
						opacity: 1,
					},
				},
				marquee: {
					'100%': {
						transform: 'translateY(-50%)',
					},
				},
				'spin-reverse': {
					to: {
						transform: 'rotate(-360deg)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s linear forwards',
				'marquee': 'marquee var(--marquee-duration) linear infinite',
				'spin-slow': 'spin 4s linear infinite',
				'spin-slower': 'spin 6s linear infinite',
				'spin-reverse': 'spin-reverse 1s linear infinite',
				'spin-reverse-slow': 'spin-reverse 4s linear infinite',
				'spin-reverse-slower': 'spin-reverse 6s linear infinite',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
	corePlugins: {
		preflight: true,
	},
	important: '#wpgraphql-ide-drawer-content'
}
