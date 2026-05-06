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
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap' }],
  ],
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
        { text: 'Theme-only theme audit', link: '/reports/theme-only-audit/' },
        { text: 'Theme-only theme audit (2)', link: '/reports/theme-only-audit-2/' },
        { text: 'AI in the WordPress + Laravel Pipeline', link: '/reports/ai-wp-laravel-pipeline/' },
        { text: 'AI-Augmented Development Pipelines (Reconciled)', link: '/reports/ai-augmented-dev-pipeline/' },
        { text: 'AI Transformation Research Programme', link: '/reports/ai-transformation-programme/' },
        { text: 'Agentic Engineering Techniques', link: '/reports/agentic-engineering-techniques/' },
        { text: 'AI as an Interface Layer', link: '/reports/ai-as-an-interface/' },
        { text: 'Structured-Prompt-Driven Development (SPDD)', link: '/reports/structured-prompt-driven/' },
        { text: 'nWave vs Superpowers', link: '/reports/agentic-framework-comparison/' },
        { text: 'PR Review Continuity Under Capacity Loss', link: '/reports/pr-review-continuity/' },
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
      '/reports/agentic-engineering-techniques/': [
        { text: 'Report overview', link: '/reports/agentic-engineering-techniques/' },
        {
          text: 'Sections',
          items: [
            { text: '1. Executive Summary', link: '/reports/agentic-engineering-techniques/01-executive-summary' },
            { text: '2. Technique Inventory', link: '/reports/agentic-engineering-techniques/02-technique-inventory' },
            { text: '3. Current State Assessment', link: '/reports/agentic-engineering-techniques/03-current-state' },
            { text: '4. High-Impact Gaps', link: '/reports/agentic-engineering-techniques/04-high-impact-gaps' },
            { text: '5. Medium-Impact Gaps', link: '/reports/agentic-engineering-techniques/05-medium-impact-gaps' },
            { text: '6. Pattern Matching', link: '/reports/agentic-engineering-techniques/06-pattern-matching' },
            { text: '7. Action Plan', link: '/reports/agentic-engineering-techniques/07-action-plan' },
          ],
        },
      ],
      '/reports/ai-as-an-interface/': [],
      '/reports/agentic-framework-comparison/': [
        { text: 'Report overview', link: '/reports/agentic-framework-comparison/' },
        {
          text: 'Sections',
          items: [
            { text: 'Executive summary (leadership)', link: '/reports/agentic-framework-comparison/executive-summary' },
          ],
        },
      ],
      '/reports/structured-prompt-driven/': [
        { text: 'Microsite overview', link: '/reports/structured-prompt-driven/' },
        {
          text: 'Sections',
          items: [
            { text: '1. What SPDD is & REASONS', link: '/reports/structured-prompt-driven/01-spdd-and-reasons' },
            { text: '2. Workflow & openspdd', link: '/reports/structured-prompt-driven/02-openspdd-and-workflow' },
            { text: '3. Case study — billing engine', link: '/reports/structured-prompt-driven/03-case-study-billing-engine' },
            { text: '4. Skills, fitness & trade-offs', link: '/reports/structured-prompt-driven/04-skills-fitness-and-trade-offs' },
            { text: '5. Sources & next steps', link: '/reports/structured-prompt-driven/05-sources-and-next-steps' },
          ],
        },
      ],
      '/reports/pr-review-continuity/': [
        { text: 'Microsite overview', link: '/reports/pr-review-continuity/' },
        {
          text: 'Sections',
          items: [
            { text: '1. Problem shape and signals', link: '/reports/pr-review-continuity/01-problem-shape-and-signals' },
            { text: '2. Failure modes and risk model', link: '/reports/pr-review-continuity/02-failure-modes-and-risk-model' },
            { text: '3. Operating model for constrained capacity', link: '/reports/pr-review-continuity/03-operating-model-for-constrained-review-capacity' },
            { text: '4. PR design and work slicing patterns', link: '/reports/pr-review-continuity/04-pr-design-and-work-slicing-patterns' },
            { text: '5. AI-assisted review without blind trust', link: '/reports/pr-review-continuity/05-ai-assisted-review-without-blind-trust' },
            { text: '6. 30-60-90 rollout', link: '/reports/pr-review-continuity/06-30-60-90-rollout' },
            { text: '7. Sources and evidence map', link: '/reports/pr-review-continuity/07-sources-and-evidence-map' },
          ],
        },
      ],
      '/reports/theme-only-audit/': [
        { text: 'Report overview', link: '/reports/theme-only-audit/' },
        {
          text: 'Sections',
          items: [
            { text: '0. Summary', link: '/reports/theme-only-audit/00-summary' },
            { text: '1. Conventions and structure', link: '/reports/theme-only-audit/01-conventions-and-structure' },
            { text: '2. Non-native APIs', link: '/reports/theme-only-audit/02-non-native-apis' },
            { text: '3. Performance', link: '/reports/theme-only-audit/03-performance' },
            { text: '4. Security', link: '/reports/theme-only-audit/04-security' },
            { text: '5. Dependencies', link: '/reports/theme-only-audit/05-dependencies' },
            { text: '6. Blocks and components', link: '/reports/theme-only-audit/06-blocks-and-components' },
            { text: '7. Reusability and plugin extraction', link: '/reports/theme-only-audit/07-reusability-and-plugin-extraction' },
            { text: '8. Roadmap', link: '/reports/theme-only-audit/08-roadmap' },
          ],
        },
      ],
      '/reports/theme-only-audit-2/': [
        { text: 'Report overview (audit 2)', link: '/reports/theme-only-audit-2/' },
        {
          text: 'Sections',
          items: [
            { text: '0. Summary', link: '/reports/theme-only-audit-2/00-summary' },
            { text: '1. Conventions and structure', link: '/reports/theme-only-audit-2/01-conventions-and-structure' },
            { text: '2. Non-native APIs', link: '/reports/theme-only-audit-2/02-non-native-apis' },
            { text: '3. Performance', link: '/reports/theme-only-audit-2/03-performance' },
            { text: '4. Security', link: '/reports/theme-only-audit-2/04-security' },
            { text: '5. Dependencies', link: '/reports/theme-only-audit-2/05-dependencies' },
            { text: '6. Blocks and components', link: '/reports/theme-only-audit-2/06-blocks-and-components' },
            { text: '7. Reusability and plugin extraction', link: '/reports/theme-only-audit-2/07-reusability-and-plugin-extraction' },
            { text: '8. Roadmap', link: '/reports/theme-only-audit-2/08-roadmap' },
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
}))
