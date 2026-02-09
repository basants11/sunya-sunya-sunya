/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'luxury-dark-green': '#0A2F1E',
        'luxury-dark-green-light': '#1A3C2E',
        'luxury-burnt-orange': '#CC5500',
        'luxury-gold': '#D4AF37',
        'luxury-off-white': '#F5F0E6',
        'luxury-charcoal': '#1F1F1F',
        'luxury-beige': '#EDE4D9',
        'warm-beige': '#F5F5DC',
        'warm-cream': '#FFFDD0',
        'warm-amber': '#FFBF00',
        'warm-peach': '#FFDAB9',
        'soft-ivory': '#FAF9F6',
        'muted-rose': '#E6B8C3',
        'gentle-green': '#B2D8B2',
        'vibrant-orange': '#FF6B35',
        'soft-lavender': '#C8A2C8',
        'deep-burgundy': '#722F37',
      },
      backgroundImage: {
        'luxury-dark-gradient': 'linear-gradient(135deg, #0A2F1E 0%, #1A3C2E 100%)',
        'luxury-gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #BFAF7A 100%)',
        'luxury-neutral-gradient': 'linear-gradient(135deg, #F5F0E6 0%, #EDE4D9 100%)',
      },
    },
  },
  plugins: [],
}