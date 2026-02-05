/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                purevit: {
                    dark: "#1A1B14", // Deep Charcoal/Black
                    primary: "#16A34A", // Logo Green
                    secondary: "#FDFBF7", // Light Cream (Secondary)
                    cream: "#F9F3EB", // Richer Cream
                    surface: "#FFFFFF", // White Primary
                    muted: "#6B7280",
                    // Mapping missing keys to new theme
                    card: "#1A1B14",
                    charcoal: "#1A1B14",
                    accent: "#16A34A",
                    beige: "#F9F3EB",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
                heading: ['"Playfair Display"', 'serif'],
                outfit: ['Outfit', 'sans-serif'],
                montserrat: ['Montserrat', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
