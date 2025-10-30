// composables/useMetadata.js
export function useMetadata({
  title = 'Dev Piologo - Full Stack Developer Portfolio',
  description = 'Explore the portfolio of João Piologo, a Full Stack Developer specializing in creating modern web applications. Discover projects, skills, and more.',
  icons = '/favicon.ico',
} = {}) {
  return {
    title,
    meta: [
      { name: 'description', content: description },
      // Open Graph tags
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
    ],
    link: [
      { rel: 'icon', href: icons },
    ],
  };
}