/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--university-primary)',
                secondary: 'var(--university-secondary)',
                accent: 'var(--university-accent)',
            },
            boxShadow: {
                'glow': '0 0 20px var(--glow-color)',
                'glow-lg': '0 0 40px var(--glow-color)',
            },
        },
    },
    plugins: [],
}

