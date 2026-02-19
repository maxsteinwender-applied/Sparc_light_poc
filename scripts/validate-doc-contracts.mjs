#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const root = process.cwd()
const allowedSlashTags = new Set(["/start", "/prod", "/ux", "/copy", "/fe", "/qa", "/help"])
const baseDocPaths = [
  "AGENTS.md",
  "README.md",
  ".codex/skills/prompts.md",
  ".codex/skills/start/PROJECT_START_CHECKLIST.md",
  ".codex/skills/product/PRD.md",
  ".codex/skills/product/features/README.md",
  "pages/index.vue",
]
const docPaths = [
  ...new Set([
    ...baseDocPaths,
    ...listMarkdownFiles(".codex/rules"),
    ...listMarkdownFiles(".codex/rules/stacks"),
    ...listMarkdownFiles(".codex/skills/playbooks"),
  ]),
]
const requiredCodexReadmeDirs = [
  ".codex",
  ".codex/agents",
  ".codex/rules",
  ".codex/rules/stacks",
  ".codex/skills",
  ".codex/skills/playbooks",
  ".codex/skills/product",
  ".codex/skills/product/features",
  ".codex/skills/qa",
  ".codex/skills/references",
  ".codex/skills/references/production",
  ".codex/skills/start",
]

const issues = []
const stalePathPatterns = [
  { pattern: /\.codex\/PROJECT_START_CHECKLIST\.md\b/, expected: ".codex/skills/start/PROJECT_START_CHECKLIST.md" },
  { pattern: /\.codex\/docs\/PRD\.md\b/, expected: ".codex/skills/product/PRD.md" },
  { pattern: /\.codex\/features\/INDEX\.md\b/, expected: ".codex/skills/product/features/INDEX.md" },
  { pattern: /\.codex\/features\/README\.md\b/, expected: ".codex/skills/product/features/README.md" },
  { pattern: /\.codex\/features\/PROJ-\*\.md\b/, expected: ".codex/skills/product/features/PROJ-*.md" },
  { pattern: /\.codex\/features\//, expected: ".codex/skills/product/features/" },
  { pattern: /\.codex\/templates\/qa-report\.md\b/, expected: ".codex/skills/qa/qa-report.md" },
  { pattern: /\.codex\/stacks\/vue\.md\b/, expected: ".codex/rules/stacks/vue.md" },
  { pattern: /\.codex\/stacks\/\*\.md\b/, expected: ".codex/rules/stacks/*.md" },
  { pattern: /\.codex\/STACKS\.md\b/, expected: ".codex/rules/stacks/STACKS.md" },
  { pattern: /\.codex\/POLICY\.md\b/, expected: ".codex/rules/policy.md" },
]

const standardFlowRegex =
  /\/start\s*->\s*\/prod\s*->\s*\/ux\s*->\s*\/copy\s*->\s*\/fe\s*->\s*\/qa\s*->\s*\/prod/

const invalidKickoffPatterns = [
  /For new projects,\s*start with\s*`?\/prod`?/i,
  /start with\s*\/prod\s+and\s+project_track/i,
  /new project[s]?\s+(must|should)?\s*start with\s*`?\/prod`?/i,
]
const deprecatedUiBaselinePatterns = [
  {
    pattern: /UI:\s*`?shadcn-vue`?/i,
    message: "Active docs must not define `shadcn-vue` as the UI baseline.",
  },
  {
    pattern: /shadcn-vue component baseline/i,
    message: "Roadmap and specs must use the PrimeVue component baseline.",
  },
  {
    pattern: /Use stack-selected UI defaults\s*\(`?shadcn-vue`?\)/i,
    message: "Frontend defaults must reference PrimeVue.",
  },
]

function addIssue(file, line, message) {
  issues.push(`${file}:${line} ${message}`)
}

function listMarkdownFiles(relDir) {
  const absDir = resolve(root, relDir)
  if (!existsSync(absDir)) {
    addIssue(relDir, 1, "Missing required directory.")
    return []
  }

  return readdirSync(absDir)
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => `${relDir}/${entry}`)
    .sort()
}

function readRequiredFile(relPath) {
  const absPath = resolve(root, relPath)
  if (!existsSync(absPath)) {
    addIssue(relPath, 1, "Missing required document.")
    return null
  }
  return readFileSync(absPath, "utf8")
}

function readPackageJson() {
  const packageRaw = readRequiredFile("package.json")
  if (!packageRaw) {
    return null
  }

  try {
    return JSON.parse(packageRaw)
  } catch {
    addIssue("package.json", 1, "Invalid JSON format.")
    return null
  }
}

function hasPackageDependency(pkg, name) {
  return Boolean(pkg?.dependencies?.[name] || pkg?.devDependencies?.[name])
}

for (const relPath of docPaths) {
  const content = readRequiredFile(relPath)
  if (!content) {
    continue
  }

  const lines = content.split(/\r?\n/)

  lines.forEach((line, index) => {
    const lineNumber = index + 1

    if (/(^|[\s`|(>])\/requirements\b/.test(line)) {
      addIssue(relPath, lineNumber, "Deprecated tag `/requirements` is not allowed.")
    }

    const tagRegex = /(^|[\s`|(>])(\/[a-z]+)\b/g
    let match
    while ((match = tagRegex.exec(line)) !== null) {
      const tag = match[2]
      if (!allowedSlashTags.has(tag)) {
        addIssue(relPath, lineNumber, `Unsupported slash tag \`${tag}\`.`)
      }
    }

    for (const stalePath of stalePathPatterns) {
      if (stalePath.pattern.test(line)) {
        addIssue(
          relPath,
          lineNumber,
          `Stale path reference detected. Use \`${stalePath.expected}\`.`
        )
      }
    }

    for (const deprecatedUiBaseline of deprecatedUiBaselinePatterns) {
      if (!relPath.startsWith(".codex/legacy/") && deprecatedUiBaseline.pattern.test(line)) {
        addIssue(relPath, lineNumber, deprecatedUiBaseline.message)
      }
    }
  })

  for (const invalidPattern of invalidKickoffPatterns) {
    if (invalidPattern.test(content)) {
      addIssue(relPath, 1, "Invalid kickoff guidance detected. New projects must start with `/start`.")
    }
  }
}

const readmeContent = readRequiredFile("README.md")
if (readmeContent) {
  if (!standardFlowRegex.test(readmeContent)) {
    addIssue(
      "README.md",
      1,
      "Required standard flow `/start -> /prod -> /ux -> /copy -> /fe -> /qa -> /prod` is missing or inconsistent."
    )
  }

  if (!/For new projects,\s*always start with `\/start`\./.test(readmeContent)) {
    addIssue("README.md", 1, "Required kickoff hint `For new projects, always start with `/start`.` is missing.")
  }
}

const promptsContent = readRequiredFile(".codex/skills/prompts.md")
if (promptsContent && !standardFlowRegex.test(promptsContent)) {
  addIssue(
    ".codex/skills/prompts.md",
    1,
    "Standard flow order must be `/start -> /prod -> /ux -> /copy -> /fe -> /qa -> /prod`."
  )
}

const stacksContent = readRequiredFile(".codex/rules/stacks/STACKS.md")
if (stacksContent && !/PrimeVue/i.test(stacksContent)) {
  addIssue(".codex/rules/stacks/STACKS.md", 1, "Stack defaults must explicitly include PrimeVue.")
}
if (stacksContent && !/chart\.js/i.test(stacksContent)) {
  addIssue(".codex/rules/stacks/STACKS.md", 1, "Stack defaults must mention chart.js for PrimeVue Chart.")
}

const vueStackContent = readRequiredFile(".codex/rules/stacks/vue.md")
if (vueStackContent && !/PrimeVue/i.test(vueStackContent)) {
  addIssue(".codex/rules/stacks/vue.md", 1, "Vue stack profile must explicitly include PrimeVue.")
}
if (vueStackContent && !/chart\.js/i.test(vueStackContent)) {
  addIssue(".codex/rules/stacks/vue.md", 1, "Vue stack profile must mention chart.js for PrimeVue Chart.")
}

const pkg = readPackageJson()
if (pkg) {
  const requiredDeps = ["primevue", "@primevue/nuxt-module", "chart.js"]
  for (const dep of requiredDeps) {
    if (!hasPackageDependency(pkg, dep)) {
      addIssue("package.json", 1, `Missing required dependency for documented defaults: \`${dep}\`.`)
    }
  }
}

const pageContent = readRequiredFile("pages/index.vue")
if (pageContent) {
  if (!standardFlowRegex.test(pageContent)) {
    addIssue(
      "pages/index.vue",
      1,
      "Landing page must include the standard flow `/start -> /prod -> /ux -> /copy -> /fe -> /qa -> /prod`."
    )
  }

  if (!/For new projects, always start with \/start\./.test(pageContent)) {
    addIssue(
      "pages/index.vue",
      1,
      "Landing page must include the kickoff hint `For new projects, always start with /start.`"
    )
  }
}

const checklistContent = readRequiredFile(".codex/skills/start/PROJECT_START_CHECKLIST.md")
if (checklistContent) {
  if (!/Do not hand off to .*\/copy.*before checklist summary is complete\./.test(checklistContent)) {
    addIssue(
      ".codex/skills/start/PROJECT_START_CHECKLIST.md",
      1,
      "Stop rules must include `/copy` before handoff is allowed."
    )
  }

  if (
    !/\/start`?\s*->\s*`?\/prod`?\s*->\s*\[\/ux\]\s*->\s*\[\/copy\]\s*->\s*\[\/fe\]\s*->\s*\[\/qa\]/.test(
      checklistContent
    )
  ) {
    addIssue(
      ".codex/skills/start/PROJECT_START_CHECKLIST.md",
      1,
      "Initial sequence must be `/start -> /prod -> [/ux] -> [/copy] -> [/fe] -> [/qa]`."
    )
  }
}

for (const dir of requiredCodexReadmeDirs) {
  const readmePath = `${dir}/README.md`
  if (!existsSync(resolve(root, readmePath))) {
    addIssue(readmePath, 1, "Missing required README for active .codex folder.")
  }
}

if (issues.length > 0) {
  console.error("Doc contract validation failed:")
  for (const issue of issues) {
    console.error(`- ${issue}`)
  }
  process.exit(1)
}

console.log("Doc contract validation passed.")
