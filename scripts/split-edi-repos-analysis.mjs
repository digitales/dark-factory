#!/usr/bin/env node
/**
 * Split edi-repos-analysis.md into VitePress section files.
 * Source: /Users/rosstweedie/Sites/edi/edi-repos-analysis.md
 */
import fs from 'node:fs';
import path from 'node:path';

const sourcePath = '/Users/rosstweedie/Sites/edi/edi-repos-analysis.md';
const outDir = path.resolve('reports/edi-repos-analysis');

const source = fs.readFileSync(sourcePath, 'utf8');

const sections = [
  {
    file: '01-executive-summary.md',
    title: 'Executive summary',
    description: 'Key findings and priority repos for PHP and WordPress teams.',
    start: '## Executive summary',
    end: '## Portfolio overview',
  },
  {
    file: '02-portfolio-overview.md',
    title: 'Portfolio overview',
    description: 'Category breakdown, cross-cutting patterns, weaknesses, and repos requiring attention.',
    start: '## Portfolio overview',
    end: '## Repository analysis',
  },
  {
    file: '03-ai-enablement-boilerplates.md',
    title: 'AI enablement boilerplates',
    description: 'Eleven Cursor and stack boilerplate repositories — purpose, stack, and WP transfer notes.',
    start: '### AI enablement boilerplates',
    end: '### Secure SDLC and agent governance',
  },
  {
    file: '04-secure-sdlc-governance.md',
    title: 'Secure SDLC and agent governance',
    description: 'SSDLC agent pack, Cloud Buddy, data-engineering AI plan, and multi-agent curriculum.',
    start: '### Secure SDLC and agent governance',
    end: '### Academy and LMS',
  },
  {
    file: '05-academy-lms.md',
    title: 'Academy and LMS',
    description: 'Twelve training and course repositories — AWS, AI, data science, and tutorials.',
    start: '### Academy and LMS',
    end: '### DSO internal tooling',
  },
  {
    file: '06-dso-internal-tooling.md',
    title: 'DSO internal tooling',
    description: 'Docker builds, security scanning, interview vault, and Terraform enablement scaffolds.',
    start: '### DSO internal tooling',
    end: '### MSDP data platform',
  },
  {
    file: '07-msdp-data-platform.md',
    title: 'MSDP data platform',
    description: 'CloudFormation templates, dbt, Redshift, and serverless pipeline repos.',
    start: '### MSDP data platform',
    end: '### Client delivery and production',
  },
  {
    file: '08-client-delivery-production.md',
    title: 'Client delivery and production',
    description: 'Endeavor datalake, ms-shared, ML lab, PII R&D, and internal knowledge base.',
    start: '### Client delivery and production',
    end: '### QA and testing',
  },
  {
    file: '09-qa-testing.md',
    title: 'QA and testing',
    description: 'QA enablement demo, legacy Cypress scaffold, and PR validation gate.',
    start: '### QA and testing',
    end: '### Front-end boilerplates and utilities',
  },
  {
    file: '10-frontend-and-infra.md',
    title: 'Front-end boilerplates and infrastructure',
    description: 'TypeScript CRA boilerplate, OpenAPI mock backend, and AWS/Azure/CDK snippets.',
    start: '### Front-end boilerplates and utilities',
    end: '## Coding style summary',
  },
  {
    file: '11-patterns-and-maturity.md',
    title: 'Coding patterns and maturity matrix',
    description: 'Cross-portfolio style patterns and comparative maturity ratings.',
    start: '## Coding style summary',
    end: '## Recommendations for PHP and WordPress teams',
  },
  {
    file: '12-wp-recommendations.md',
    title: 'WordPress and PHP recommendations',
    description: 'Adoption priorities, definition of done, leadership tiers, and bottom line.',
    start: '## Recommendations for PHP and WordPress teams',
    end: null,
  },
];

function extract(start, end) {
  const startIdx = source.indexOf(start);
  if (startIdx === -1) throw new Error(`Start marker not found: ${start}`);
  const endIdx = end ? source.indexOf(end, startIdx + start.length) : source.length;
  if (end && endIdx === -1) throw new Error(`End marker not found: ${end}`);
  return source.slice(startIdx, endIdx).trim();
}

function toPageHeading(title, body) {
  const lines = body.split('\n');
  if (lines[0].startsWith('##')) {
    lines[0] = `# ${lines[0].replace(/^#+\s*/, '')}`;
  } else if (lines[0].startsWith('###')) {
    lines[0] = `# ${lines[0].replace(/^#+\s*/, '')}`;
  }
  return lines.join('\n');
}

for (const section of sections) {
  const body = toPageHeading(section.title, extract(section.start, section.end));
  const content = `---
title: ${section.title}
description: ${section.description}
---

${body}
`;
  fs.writeFileSync(path.join(outDir, section.file), content);
  console.log(`Wrote ${section.file}`);
}

const index = `---
layout: doc
title: EDI Repository Portfolio Analysis
description: Senior-engineer review of 57 Elixirr/iOLAP git repositories — AI enablement, academy, DSO, MSDP, client delivery, and WordPress transfer guidance.
---

# EDI Repository Portfolio Analysis

Senior-engineer review of **57 git repositories** under the Elixirr/iOLAP internal portfolio: AI enablement boilerplates, academy training material, DSO tooling, MSDP data platform infrastructure, client delivery artifacts, and QA patterns.

**Prepared:** 2026-06-08 · **Scope:** \`/Users/rosstweedie/Sites/edi\`

---

## Key findings

- No substantive PHP or WordPress application code exists in this portfolio
- The only WordPress touchpoint is Cypress selectors against a demo page in \`qa-cypress\`
- Several clones are empty or stub-only (README on \`main\`, real code on unfetched branches)
- Highest-value repos for engineering standards adoption are the AI enablement boilerplates and secure SDLC agent pack
- Cross-cutting weakness: tests and CI lag behind documentation across most repos

**Recommended priority for PHP/WordPress teams:**

1. [\`apps-cursor-ai-enablement\`](/reports/edi-repos-analysis/03-ai-enablement-boilerplates#apps-cursor-ai-enablement) — AI-assisted delivery workflow reference
2. [\`elixirr-secure-sdlc-agent-pack\`](/reports/edi-repos-analysis/04-secure-sdlc-governance#elixirr-secure-sdlc-agent-pack) — security governance (includes PHP globs)
3. [\`apps-ai-enablement-fastapi\`](/reports/edi-repos-analysis/03-ai-enablement-boilerplates#apps-ai-enablement-fastapi) — module architecture pattern
4. [\`apps-ai-enablement-netAPI\`](/reports/edi-repos-analysis/03-ai-enablement-boilerplates#apps-ai-enablement-netapi) — boundary testing and CI enforcement
5. [\`qa-cursor-ai-enablement\`](/reports/edi-repos-analysis/09-qa-testing#qa-cursor-ai-enablement) — modern testing standards
6. [\`pull-request-validation\`](/reports/edi-repos-analysis/09-qa-testing#pull-request-validation) — PR gate pattern

---

## Report sections

| Section | Description |
|--------|-------------|
| [1. Executive summary](/reports/edi-repos-analysis/01-executive-summary) | Key findings and priority repos |
| [2. Portfolio overview](/reports/edi-repos-analysis/02-portfolio-overview) | Category counts, patterns, weaknesses, attention list |
| [3. AI enablement boilerplates](/reports/edi-repos-analysis/03-ai-enablement-boilerplates) | 11 Cursor and stack template repos |
| [4. Secure SDLC and governance](/reports/edi-repos-analysis/04-secure-sdlc-governance) | SSDLC agent pack, Cloud Buddy, AI plan repos |
| [5. Academy and LMS](/reports/edi-repos-analysis/05-academy-lms) | 12 training and course repositories |
| [6. DSO internal tooling](/reports/edi-repos-analysis/06-dso-internal-tooling) | Docker builds, scans, interview vault |
| [7. MSDP data platform](/reports/edi-repos-analysis/07-msdp-data-platform) | CloudFormation, dbt, Redshift, pipelines |
| [8. Client delivery and production](/reports/edi-repos-analysis/08-client-delivery-production) | Endeavor, ms-shared, ML lab, iolap-kb |
| [9. QA and testing](/reports/edi-repos-analysis/09-qa-testing) | QA enablement, Cypress, PR validation |
| [10. Front-end and infrastructure](/reports/edi-repos-analysis/10-frontend-and-infra) | CRA boilerplate, OpenAPI mock, CDK snippets |
| [11. Patterns and maturity](/reports/edi-repos-analysis/11-patterns-and-maturity) | Style summary and maturity matrix |
| [12. WordPress recommendations](/reports/edi-repos-analysis/12-wp-recommendations) | Adoption plan, leadership tiers, bottom line |

Start with the [executive summary](/reports/edi-repos-analysis/01-executive-summary).

---

## Bottom line

This portfolio is an **AI enablement and cloud training ecosystem**, not a WordPress codebase. The gap between these repos and typical WP delivery is **standardization**: Cursor rules as coding standards, architecture boundary enforcement, and CI as a non-negotiable merge gate. Those three practices transfer directly without requiring a stack change.

Source: \`edi-repos-analysis.md\` (Dark Factory formatting pass, 2026-06-08).
`;

fs.writeFileSync(path.join(outDir, 'index.md'), index);
console.log('Wrote index.md');
