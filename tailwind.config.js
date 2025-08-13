import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			default: 'var(--aw-color-text-default)',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--aw-font-sans, ui-sans-serif)',
                    ...defaultTheme.fontFamily.sans
                ],
  			serif: [
  				'var(--aw-font-serif, ui-serif)',
                    ...defaultTheme.fontFamily.serif
                ],
  			heading: [
  				'var(--aw-font-heading, ui-sans-serif)',
                    ...defaultTheme.fontFamily.sans
                ]
  		},
  		animation: {
  			fade: 'fadeInUp 1s both',
  			'fade-left': 'fadeInLeft 0.9s both',
  			'fade-right': 'fadeInRight 0.9s both',
  			wave: 'wave 1.5s ease-in-out infinite'
  		},
  		keyframes: {
  			fadeInUp: {
  				'0%': {
  					opacity: 0,
  					transform: 'translateY(2rem)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			fadeInLeft: {
  				'0%': {
  					opacity: 0,
  					transform: 'translateX(-2rem)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateX(0)'
  				}
  			},
  			fadeInRight: {
  				'0%': {
  					opacity: 0,
  					transform: 'translateX( 2rem)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateX(0)'
  				}
  			},
  			wave: {
  				'0%,100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-0.15em)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
      require("tailwindcss-animate")
],
  darkMode: ['class', 'class'],
};
