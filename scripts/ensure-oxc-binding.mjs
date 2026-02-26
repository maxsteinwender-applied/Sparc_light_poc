import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDir, '..')
const oxcParserPackageJsonPath = resolve(projectRoot, 'node_modules/oxc-parser/package.json')
const oxcParserBinaryDir = resolve(projectRoot, 'node_modules/oxc-parser/src-js')

const PLATFORM_BINDINGS = {
  darwin: {
    arm64: ['@oxc-parser/binding-darwin-arm64'],
    x64: ['@oxc-parser/binding-darwin-x64'],
  },
  linux: {
    arm64: ['@oxc-parser/binding-linux-arm64-gnu', '@oxc-parser/binding-linux-arm64-musl'],
    x64: ['@oxc-parser/binding-linux-x64-gnu', '@oxc-parser/binding-linux-x64-musl'],
  },
  win32: {
    arm64: ['@oxc-parser/binding-win32-arm64-msvc'],
    x64: ['@oxc-parser/binding-win32-x64-msvc'],
  },
}

const log = (message) => {
  // Keep output compact for normal script runs.
  process.stdout.write(`[ensure-oxc-binding] ${message}\n`)
}

const tryResolveBinding = (packageName) => {
  try {
    require.resolve(`${packageName}/package.json`, { paths: [projectRoot] })
    return true
  } catch {
    return false
  }
}

const hasLocalFallbackBinary = (platform, arch) => {
  const binaryPath = resolve(oxcParserBinaryDir, `parser.${platform}-${arch}.node`)
  return existsSync(binaryPath)
}

const installBinding = (packageName, version) => {
  const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const installResult = spawnSync(
    npmExecutable,
    ['install', '--no-save', '--ignore-scripts', `${packageName}@${version}`],
    {
      cwd: projectRoot,
      stdio: 'inherit',
      env: process.env,
    },
  )

  return installResult.status === 0
}

const main = () => {
  if (!existsSync(oxcParserPackageJsonPath)) {
    log('oxc-parser is not installed yet; skipping.')
    return
  }

  const platform = process.platform
  const arch = process.arch
  const platformBindings = PLATFORM_BINDINGS[platform]
  const candidates = platformBindings?.[arch] ?? []

  if (candidates.length === 0) {
    log(`no known binding mapping for ${platform}/${arch}; skipping.`)
    return
  }

  if (hasLocalFallbackBinary(platform, arch)) {
    log(`local parser binary already present for ${platform}/${arch}.`)
    return
  }

  for (const packageName of candidates) {
    if (tryResolveBinding(packageName)) {
      log(`binding already present: ${packageName}`)
      return
    }
  }

  const { version } = JSON.parse(readFileSync(oxcParserPackageJsonPath, 'utf8'))
  for (const packageName of candidates) {
    log(`missing binding for ${platform}/${arch}; installing ${packageName}@${version} ...`)
    if (!installBinding(packageName, version)) {
      continue
    }

    if (tryResolveBinding(packageName) || hasLocalFallbackBinary(platform, arch)) {
      log(`binding installed successfully: ${packageName}`)
      return
    }
  }

  process.stderr.write(
    `[ensure-oxc-binding] failed to install any oxc binding for ${platform}/${arch}. Please run npm install in a native ${arch} shell.\n`,
  )
  process.exitCode = 1
}

main()
