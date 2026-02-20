import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Dark Factories & AI-Generated Code',
  description: 'Research report — spec-driven development, consultancy dynamics, and adoption for PHP, WordPress and Laravel teams.',
  titleTemplate: ':title | Elixirr Digital',
  // GitHub Pages: set VITEPRESS_BASE in CI to e.g. '/repo-name/'. Local/dev: './'
  base: process.env.VITEPRESS_BASE ?? './',
  themeConfig: {
    siteTitle: 'Elixirr Digital',
    logoLink: { link: 'https://www.elixirrdigital.com', target: '_blank', rel: 'noopener' },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Report', link: '/report/' },
      { text: 'Elixirr Digital', link: 'https://www.elixirrdigital.com', target: '_blank' },
    ],
    sidebar: {
      '/report/': [
        {
          text: 'Report',
          items: [
            { text: '1. Executive Summary', link: '/report/#1-executive-summary' },
            { text: '2. What Is a Dark Factory?', link: '/report/#2-what-is-a-dark-factory' },
            { text: '3. New Development Workflow', link: '/report/#3-how-the-dark-factory-forms-a-new-development-workflow' },
            { text: '4. PHP / WordPress & Laravel', link: '/report/#4-application-to-a-php-wordpress-laravel-team' },
            { text: '4A. Consultancy Environment', link: '/report/#4a-dark-factory-in-a-consultancy-environment' },
            { text: '5. Scenario-Based Development', link: '/report/#5-scenario-based-development' },
            { text: '6. Creating Specifications', link: '/report/#6-recommended-approach-for-creating-specifications' },
            { text: '7. Spec Structure & Examples', link: '/report/#7-recommended-structure-for-specifications-and-examples' },
            { text: '8. Adopting the Shift', link: '/report/#8-adopting-the-shift-workflow-tools-skills-and-constitution' },
            { text: '9. Assumptions & Follow-Up', link: '/report/#9-assumptions-and-follow-up-questions' },
            { text: '10. References', link: '/report/#10-references-and-further-reading' },
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
