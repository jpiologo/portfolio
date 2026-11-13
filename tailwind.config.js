import typography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';

// Theme colors are RGB channels defined in src/index.css (light on :root, dark on .dark)
const themeColor = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Font roles are CSS variables set from fonts.config.ts (see vite-plugin-fonts.ts).
      // `sans` is the default for the whole site, so it maps to the body font.
      fontFamily: {
        sans: ['var(--font-body, system-ui, sans-serif)'],
        display: ['var(--font-hero, serif)'],
        heading: ['var(--font-heading, system-ui, sans-serif)'],
        title: ['var(--font-title, system-ui, sans-serif)'],
        label: ['var(--font-label, system-ui, sans-serif)'],
        mono: ['var(--font-mono, ui-monospace, monospace)'],
        // Handwritten accent (hero highlight); loaded in index.html, independent of the font preset
        signature: ["'Momo Signature'", 'cursive'],
      },
      keyframes: {
        // Two faces of a cube turning upwards (RotatingWord): the next word rolls in from below
        'cube-in': {
          '0%': { transform: 'rotateX(-90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        'cube-out': {
          '0%': { transform: 'rotateX(0deg)', opacity: '1' },
          '100%': { transform: 'rotateX(90deg)', opacity: '0' },
        },
        'caret-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        // Lazy drift used by the hero icons; duration and delay are set per icon
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(4px, -7px) rotate(5deg)' },
          '66%': { transform: 'translate(-4px, -3px) rotate(-4deg)' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.06s step-end infinite',
        'cube-in': 'cube-in 0.6s cubic-bezier(0.3, 0.7, 0.3, 1) both',
        'cube-out': 'cube-out 0.6s cubic-bezier(0.3, 0.7, 0.3, 1) forwards',
        float: 'float 6s ease-in-out infinite',
      },
      colors: {
        background: {
          base: themeColor('bg-base'),
          surface: themeColor('bg-surface'),
          elevated: themeColor('bg-elevated'),
        },
        accent: {
          primary: themeColor('accent-primary'),
          secondary: themeColor('accent-secondary'),
          hover: themeColor('accent-hover'),
          glow: 'rgba(14, 77, 138, 0.15)',
        },
        text: {
          primary: themeColor('text-primary'),
          muted: themeColor('text-muted'),
        },
        border: {
          subtle: themeColor('border'),
          focus: themeColor('accent-secondary'),
          hover: themeColor('accent-secondary'),
        },
        // Text placed on top of accent-primary backgrounds
        'on-accent': '#FFFFFF',
        feedback: {
          error: '#EF4444',
          'error-bg': 'rgba(239, 68, 68, 0.1)',
          success: '#22C55E',
          'success-bg': 'rgba(34, 197, 94, 0.1)',
        },
      },
    },
  },
  plugins: [
    typography,
    // Full-page mode on large screens (attribute set by src/lib/useFullPage.ts)
    plugin(({ addVariant }) => addVariant('full-page', ':root[data-full-page] &')),
  ],
};
