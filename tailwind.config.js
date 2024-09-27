// /** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            boxShadow: {
                brandShadow: '0px 2px 8px 0px #00000026',
            },
            colors: {
                'regal-blue': '#023047',
                brandGray1: 'var(--mp-text-gray1)',
                brandGray2: 'var(--mp-text-gray2)',
                brandGray: 'var(--mp-text-gray)',
                brandPrimaryColor: 'var(--mp-brand-color)',
                brandOrange: '#FB8500',
                'regal-orange': '#FFA229',
                dangerColor: '#FF4D4F',
                tootltipText: '#ffffff',
                tooltipBg: '#000000',
                //Below are the shadcn Changes
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'var(--mp-brand-color)',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'var(--mp-primary-background-color)',
                    foreground: 'var(--mp-primary-text-color)',
                },
                secondary: {
                    DEFAULT: 'var(--mp-secondary-color)',
                    foreground: 'var(--mp-secondary-text-color)',
                },
                destructive: {
                    DEFAULT: 'var(--mp-danger-primary-color)',
                    foreground: 'var(--mp-danger-primary-text-color)',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            // fontFamily: {
            //     sans: ['var(--font-sans)', ...fontFamily.sans],
            // },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}
