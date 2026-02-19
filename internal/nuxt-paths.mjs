import { joinRelativeURL } from 'ufo'

const base = process.env.NUXT_APP_BASE_URL || '/'
const cdn = process.env.NUXT_APP_CDN_URL || ''
const assetsDir = process.env.NUXT_APP_BUILD_ASSETS_DIR || '/_nuxt/'

const normalizeBaseURL = (value) => {
  if (!value) {
    return '/'
  }
  return value.endsWith('/') ? value : `${value}/`
}

export function baseURL() {
  return normalizeBaseURL(base)
}

export function buildAssetsDir() {
  return normalizeBaseURL(assetsDir)
}

export function publicAssetsURL(...path) {
  const root = cdn || baseURL()
  return path.length ? joinRelativeURL(root, ...path) : root
}

export function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path)
}
