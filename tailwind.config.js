import typography from '@tailwindcss/typography';

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
      },
      keyframes: {
        'caret-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.06s step-end infinite',
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
        social: {
          github: themeColor('text-primary'),
          linkedin: '#0E4D8A',
          email: '#DC2626',
        },
      },
    },
  },
  plugins: [typography],
};
