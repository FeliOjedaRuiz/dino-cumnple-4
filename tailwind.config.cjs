/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        celeste: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#60a5fa',
        },
        'accent-rojo': '#e74c3c',
        'accent-verde': '#27ae60',
        'tren-azul': {
          100: '#DCEEFB', 200: '#B9DCF6', 300: '#8AC4EF', 400: '#4D9DE3',
          500: '#2D8FD9', 600: '#2580C4', 700: '#1A6FAB', 800: '#155888', 900: '#0E3D60',
          DEFAULT: '#2D8FD9',
        },
        'tren-verde': {
          100: '#E0F2DA', 200: '#C0E4B5', 300: '#94CF7C', 400: '#78C063',
          500: '#5BB04A', 600: '#4E9C3D', 700: '#3D8B2C', 800: '#2E6A1F', 900: '#1F4A15',
          DEFAULT: '#5BB04A',
        },
        'tren-violeta': {
          100: '#ECDEF3', 200: '#D9BFE5', 300: '#C39AD7', 400: '#B57DCD',
          500: '#A86BC4', 600: '#9457B0', 700: '#7E4A9E', 800: '#603879', 900: '#432654',
          DEFAULT: '#A86BC4',
        },
        'tren-rojo': {
          100: '#FBE2E0', 200: '#F6BFBB', 300: '#EE9690', 400: '#E3645C',
          500: '#D8322B', 600: '#C42A23', 700: '#A82018', 800: '#821711', 900: '#5C0F0B',
          DEFAULT: '#D8322B',
        },
        'tren-amarillo': {
          100: '#FDF4D6', 200: '#FBE8AC', 300: '#F9D876', 400: '#F6CE4E',
          500: '#F4C430', 600: '#EAB520', 700: '#E0A810', 800: '#B5870C', 900: '#806107',
          DEFAULT: '#F4C430',
        },
        'tren-negro': {
          100: '#DCDCDC', 200: '#B8B8B8', 300: '#969696', 400: '#545454',
          500: '#2A2A2A', 600: '#1F1F1F', 700: '#1A1A1A', 800: '#0F0F0F', 900: '#050505',
          DEFAULT: '#1A1A1A',
        },
        'cielo-claro': '#B8E0EE',
        'cielo-medio': '#7CC0DC',
        'pasto-claro': '#9BC97E',
        madera: '#8B5A2B',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        fredoka: ['Fredoka', 'sans-serif'],
        'lilita-one': ["'Lilita One'", 'sans-serif'],
      },
      keyframes: {
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Subtle organic orbits so each SVG floats around its own origin
        // position. Different keyframes + different durations make the two
        // SVGs drift independently — they go in and out of phase forever
        // without ever syncing like a rigid block.
        'drift-a': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(5px, -2px)' },
          '50%': { transform: 'translate(0, 3px)' },
          '75%': { transform: 'translate(-5px, -2px)' },
        },
        // Same idea as drift-a but combined with a more pronounced scale
        // pulse so cumple-4 also "breathes" (zoom-in / zoom-out) in addition
        // to drifting. 1.20 = 20% bigger on the inhale, 0.95 = slight shrink
        // on the exhale. Cycle tightened from 8s to 6s for a livelier feel.
        'drift-b': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(-2px, 1px) scale(1.20)' },
          '50%': { transform: 'translate(0, -2px) scale(1)' },
          '75%': { transform: 'translate(3px, 1px) scale(0.95)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '2%': { transform: 'rotate(2.5deg)' },
          '4%': { transform: 'rotate(-2.5deg)' },
          '6%': { transform: 'rotate(1.5deg)' },
          '8%': { transform: 'rotate(-1.5deg)' },
          '10%': { transform: 'rotate(0deg)' },
        },
        // The ping expands only during the same first 10% window as wiggle,
        // then stays invisible for the remaining 90% of the 5s cycle.
        'ping-sync': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '10%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        // CTA enters from outside the left edge, overshoots slightly, then
        // settles into its normal centered position.
        'cta-enter-left': {
          '0%': { opacity: '0', transform: 'translateX(-100vw)' },
          '72%': { opacity: '1', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'cover-title-in': {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'cover-photo-in': {
          '0%': { opacity: '0', transform: 'scale(0.72) translateY(18px)' },
          '68%': { opacity: '1', transform: 'scale(1.04) translateY(-3px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'cover-button-in': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'cover-title-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(-0.5deg)' },
          '50%': { transform: 'translateY(-5px) rotate(0.5deg)' },
        },
        'cover-photo-float': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '30%': { transform: 'translate(-4px, 2px) rotate(-0.5deg)' },
          '70%': { transform: 'translate(4px, -2px) rotate(0.5deg)' },
        },
        'cover-button-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) both',
        'fade-up': 'fade-up 1s ease-out both',
        wiggle: 'wiggle 5s ease-in-out infinite',
        'drift-a': 'drift-a 6.5s ease-in-out infinite',
        'drift-b': 'drift-b 6s ease-in-out infinite',
        // Same keyframes as Tailwind's built-in `ping`, but 2.5s instead
        // of 1s for a softer, less attention-grabbing pulse.
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-sync': 'ping-sync 5s ease-out 5s infinite',
        'cta-enter-left': 'cta-enter-left 1.4s cubic-bezier(0.22, 1, 0.36, 1) 2.2s both',
        'cover-title-in': 'cover-title-in 0.9s ease-out 0.1s both',
        'cover-photo-in': 'cover-photo-in 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both',
        'cover-button-in': 'cover-button-in 0.85s ease-out 0.9s both',
        'cover-title-float': 'cover-title-float 6s ease-in-out infinite',
        'cover-photo-float': 'cover-photo-float 7.5s ease-in-out infinite',
        'cover-button-float': 'cover-button-float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
