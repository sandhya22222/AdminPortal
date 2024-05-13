// /** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
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
                'regal-orange': '#FFA229',
            },
        },
    },
    plugins: [],
}
