import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
// GitHub Pages: set VITEPRESS_BASE in CI to e.g. '/repo-name/'. Local/dev: './'
const base = process.env.VITEPRESS_BASE ?? './'

export default withMermaid(defineConfig({
  title: 'Dark Factories & AI-Generated Code',
  description: 'Research report — spec-driven development, consultancy dynamics, and adoption for PHP, WordPress and Laravel teams.',
  titleTemplate: ':title | Elixirr Digital',
  base,
  srcExclude: ['**/*-RECONCILED.md', '**/2026-02-23_cost-governor-200.md', '**/2026-02-23_critic-stress-test.md'],
  themeConfig: {
    siteTitle: 'Research',
    logoLink: '/',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Reports', link: '/reports/' },
      { text: 'Elixirr Digital', link: 'https://www.elixirrdigital.com', target: '_blank' },
    ],
    sidebar: {
      '/reports/': [
        { text: 'Reports', link: '/reports/' },
        { text: 'Dark Factories & AI-Generated Code', link: '/reports/dark-factory/' },
        { text: 'AI in the WordPress + Laravel Pipeline', link: '/reports/ai-wp-laravel-pipeline/' },
        { text: 'AI-Augmented Development Pipelines (Reconciled)', link: '/reports/ai-augmented-dev-pipeline/' },
        { text: 'AI Transformation Research Programme', link: '/reports/ai-transformation-programme/' },
      ],
      '/reports/dark-factory/': [
        { text: 'Report overview', link: '/reports/dark-factory/' },
        {
          text: 'Sections',
          items: [
            { text: '1. Executive Summary', link: '/reports/dark-factory/01-executive-summary' },
            { text: '2. What Is a Dark Factory?', link: '/reports/dark-factory/02-what-is-a-dark-factory' },
            { text: '3. New Development Workflow', link: '/reports/dark-factory/03-new-development-workflow' },
            { text: '4. PHP / WordPress & Laravel', link: '/reports/dark-factory/04-php-wordpress-laravel' },
            { text: '5. Consultancy Environment', link: '/reports/dark-factory/05-consultancy-environment' },
            { text: '6. Scenario-Based Development', link: '/reports/dark-factory/06-scenario-based-development' },
            { text: '7. Creating Specifications', link: '/reports/dark-factory/07-creating-specifications' },
            { text: '8. Spec Structure & Examples', link: '/reports/dark-factory/08-spec-structure-examples' },
            { text: '9. Exercises and Practice', link: '/reports/dark-factory/09-exercises-and-practice' },
            { text: '10. Adopting the Shift', link: '/reports/dark-factory/10-adopting-the-shift' },
            { text: '11. Assumptions & Follow-Up', link: '/reports/dark-factory/11-assumptions-follow-up' },
            { text: '12. References', link: '/reports/dark-factory/12-references' },
          ],
        },
      ],
      '/reports/ai-augmented-dev-pipeline/': [
        { text: 'Report overview', link: '/reports/ai-augmented-dev-pipeline/' },
        {
          text: 'Sections',
          items: [
            { text: '1. Overview', link: '/reports/ai-augmented-dev-pipeline/01-overview' },
            { text: '2. PR Review (AI-Augmented)', link: '/reports/ai-augmented-dev-pipeline/02-pr-review' },
            { text: '3. Refactoring (AI-Assisted)', link: '/reports/ai-augmented-dev-pipeline/03-refactoring' },
            { text: '4. Migration Intelligence', link: '/reports/ai-augmented-dev-pipeline/04-migration-intelligence' },
            { text: '5. Test Generation (AI-Assisted)', link: '/reports/ai-augmented-dev-pipeline/05-test-generation' },
            { text: '6. Documentation (AI-Assisted)', link: '/reports/ai-augmented-dev-pipeline/06-documentation' },
            { text: '7. Tooling Comparison (OSS vs SaaS)', link: '/reports/ai-augmented-dev-pipeline/07-tooling-comparison' },
            { text: '8. Governance and Controls', link: '/reports/ai-augmented-dev-pipeline/08-governance-and-controls' },
            { text: '9. 90-Day Roadmap', link: '/reports/ai-augmented-dev-pipeline/09-90-day-roadmap' },
            { text: '10. KPIs and Risks', link: '/reports/ai-augmented-dev-pipeline/10-kpis-and-risks' },
          ],
        },
      ],
      '/reports/ai-transformation-programme/': [
        { text: 'Report overview', link: '/reports/ai-transformation-programme/' },
        { text: '1. AI Transformation Whitepaper', link: '/reports/ai-transformation-programme/01-whitepaper' },
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
}))
