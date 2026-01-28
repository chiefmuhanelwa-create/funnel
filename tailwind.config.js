/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4AF37', // Primary gold
          600: '#B8860B', // Dark gold
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        // Dark backgrounds
        dark: {
          50: '#374151',
          100: '#2D3748',
          200: '#1F2937',
          300: '#1A202C',
          400: '#171923',
          500: '#0D0D0D', // Primary dark
          600: '#0A0A0A',
          700: '#070707',
          800: '#050505',
          900: '#000000',
        },
        // Accent purple/magenta
        accent: {
          50: '#FDF4FF',
          100: '#FAE8FF',
          200: '#F5D0FE',
          300: '#F0ABFC',
          400: '#E879F9',
          500: '#D946EF', // Primary accent
          600: '#C026D3',
          700: '#A21CAF',
          800: '#86198F',
          900: '#701A75',
        },
        // Success/Trust green
        success: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
        },
        // Warning/urgency
        warning: {
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
        },
        // Error/alert
        error: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Mobile-first typography scale
        'hero': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-xl': ['4.5rem', { lineHeight: '1.05', fontWeight: '700' }],
        'section': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
        'section-lg': ['2.25rem', { lineHeight: '1.2', fontWeight: '600' }],
        'subhead': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'tiny': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'content': '1200px',
        'narrow': '800px',
        'tight': '600px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-gold-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
        'glow-accent': '0 0 20px rgba(217, 70, 239, 0.3)',
        'glow-accent-lg': '0 0 40px rgba(217, 70, 239, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.37)',
        'elevated': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'elevated-lg': '0 20px 60px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #FCD34D 50%, #B8860B 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0D0D0D 0%, #1A202C 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0D0D0D 0%, #1F2937 50%, #0D0D0D 100%)',
        'gradient-accent': 'linear-gradient(135deg, #D946EF 0%, #A21CAF 100%)',
        'gradient-cta': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
