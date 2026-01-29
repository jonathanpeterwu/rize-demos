/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Rize brand colors
        rize: {
          bg: '#111113',
          'bg-elevated': '#141419',
          'bg-card': '#1a1a1f',
          border: 'rgba(255,255,255,0.1)',
          'border-strong': 'rgba(255,255,255,0.2)',
        },
        // Zinc scale (matching current usage)
        zinc: {
          850: '#1f1f23',
          950: '#111113',
        },
        // Tier accent colors
        tier: {
          lite: '#a78bfa',
          pro: '#a78bfa',
          team: '#a78bfa',
          enterprise: '#a78bfa',
        }
      },
      backgroundColor: {
        // Dynamic tier backgrounds with opacity
        'tier-lite/10': 'rgba(167, 139, 250, 0.1)',
        'tier-lite/15': 'rgba(167, 139, 250, 0.15)',
        'tier-lite/20': 'rgba(167, 139, 250, 0.2)',
      },
      borderColor: {
        'tier-lite/40': 'rgba(167, 139, 250, 0.4)',
      },
      maxWidth: {
        'container': '1200px',
      }
    },
  },
  plugins: [],
}
