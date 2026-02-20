import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
const base = process.env.VITEPRESS_BASE ?? './'
// When base is a subpath (e.g. '/report/'), sidebar links must not repeat it or withBase() doubles the path
const reportPath = base === './' ? '/report' : ''

export default defineConfig({
  title: 'Dark Factories & AI-Generated Code',
  description: 'Research report — spec-driven development, consultancy dynamics, and adoption for PHP, WordPress and Laravel teams.',
  titleTemplate: ':title | Elixirr Digital',
  // GitHub Pages: set VITEPRESS_BASE in CI to e.g. '/repo-name/'. Local/dev: './'
  base,
  themeConfig: {
    siteTitle: 'Research',
    logoLink: '/',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Report', link: '/report/' },
      { text: 'Elixirr Digital', link: 'https://www.elixirrdigital.com', target: '_blank' },
    ],
    sidebar: {
      '/report/': [
        { text: 'Report overview', link: `${reportPath}/` },
        {
          text: 'Sections',
          items: [
            { text: '1. Executive Summary', link: `${reportPath}/01-executive-summary` },
            { text: '2. What Is a Dark Factory?', link: `${reportPath}/02-what-is-a-dark-factory` },
            { text: '3. New Development Workflow', link: `${reportPath}/03-new-development-workflow` },
            { text: '4. PHP / WordPress & Laravel', link: `${reportPath}/04-php-wordpress-laravel` },
            { text: '4A. Consultancy Environment', link: `${reportPath}/04a-consultancy-environment` },
            { text: '5. Scenario-Based Development', link: `${reportPath}/05-scenario-based-development` },
            { text: '6. Creating Specifications', link: `${reportPath}/06-creating-specifications` },
            { text: '7. Spec Structure & Examples', link: `${reportPath}/07-spec-structure-examples` },
            { text: '8. Adopting the Shift', link: `${reportPath}/08-adopting-the-shift` },
            { text: '9. Assumptions & Follow-Up', link: `${reportPath}/09-assumptions-follow-up` },
            { text: '10. References', link: `${reportPath}/10-references` },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/elixirr-digital' },
    ],
    footer: {
      message: 'Part of Elixirr Digital — Your digital partner.',
      copyright: 'Experience digital solutions that challenge the ordinary.',
    },
    outline: { level: [2, 3], label: 'On this page' },
  },
})
