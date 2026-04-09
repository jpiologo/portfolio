/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          base: '#111318',
          surface: '#1C1F26',
          elevated: '#252830',
        },
        accent: {
          primary: '#0E4D8A',
          secondary: '#1E88E5',
          hover: '#1565C0',
          glow: 'rgba(14, 77, 138, 0.15)',
        },
        text: {
          primary: '#E8EAF0',
          muted: '#9CA3AF',
        },
        border: {
          subtle: '#2C3040',
          focus: '#1E88E5',
          hover: '#1E88E5',
        },
        feedback: {
          error: '#EF4444',
          'error-bg': 'rgba(239, 68, 68, 0.1)',
          success: '#22C55E',
          'success-bg': 'rgba(34, 197, 94, 0.1)',
        },
        social: {
          github: '#E8EAF0',
          linkedin: '#0E4D8A',
          email: '#DC2626',
        },
        category: {
          lang: '#22d3ee',
          front: '#a78bfa',
          back: '#34d399',
          db: '#fbbf24',
          tool: '#fb7185',
          best: '#38bdf8',
          vc: '#818cf8',
        },
      },
    },
  },
  plugins: [],
};
