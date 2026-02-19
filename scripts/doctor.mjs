#!/usr/bin/env node

import { existsSync } from "node:fs"
import { resolve } from "node:path"

const REQUIRED_NODE_MAJOR = 20
const root = process.cwd()

const errors = []
const warnings = []

const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "0", 10)
if (Number.isNaN(nodeMajor) || nodeMajor < REQUIRED_NODE_MAJOR) {
  errors.push(
    `Node.js ${REQUIRED_NODE_MAJOR}+ is required. Current version: ${process.versions.node}.`
  )
}

const requiredPaths = [
  "node_modules",
  "package-lock.json",
  "AGENTS.md",
  "README.md",
  ".codex/README.md",
  ".codex/skills/prompts.md",
  ".codex/rules/stacks/STACKS.md",
  ".codex/skills/start/PROJECT_START_CHECKLIST.md",
  ".codex/skills/product/PRD.md",
  ".codex/skills/product/features/INDEX.md",
]

for (const relPath of requiredPaths) {
  if (!existsSync(resolve(root, relPath))) {
    errors.push(`Missing required path: ${relPath}`)
  }
}

if (!existsSync(resolve(root, ".env.local"))) {
  warnings.push(
    "Optional file .env.local not found. This is fine unless your project needs backend credentials."
  )
}

if (errors.length === 0) {
  console.log("Doctor check passed.")
} else {
  console.error("Doctor check failed:")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
}

if (warnings.length > 0) {
  console.warn("Warnings:")
  for (const warning of warnings) {
    console.warn(`- ${warning}`)
  }
}

process.exit(errors.length > 0 ? 1 : 0)
