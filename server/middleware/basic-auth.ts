import { createError, defineEventHandler, getHeader } from 'h3'

export const isAuthorizedBasicAuth = (
  authorizationHeader: string | undefined,
  expectedUser: string,
  expectedPassword: string,
): boolean => {
  if (!authorizationHeader?.startsWith('Basic ')) {
    return false
  }

  const encodedCredentials = authorizationHeader.slice('Basic '.length).trim()
  if (!encodedCredentials) {
    return false
  }

  let decodedCredentials = ''
  try {
    decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8')
  } catch {
    return false
  }

  const separatorIndex = decodedCredentials.indexOf(':')
  if (separatorIndex <= 0) {
    return false
  }

  const user = decodedCredentials.slice(0, separatorIndex)
  const password = decodedCredentials.slice(separatorIndex + 1)

  return user === expectedUser && password === expectedPassword
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const expectedUser = config.prototypeAuthUser
  const expectedPassword = config.prototypeAuthPassword

  // Fail-open for local/dev if credentials are not configured.
  if (!expectedUser || !expectedPassword) {
    return
  }

  const authorizationHeader = getHeader(event, 'authorization')
  const isAuthorized = isAuthorizedBasicAuth(authorizationHeader, expectedUser, expectedPassword)

  if (isAuthorized) {
    return
  }

  event.node.res.setHeader('WWW-Authenticate', 'Basic realm="Sparc Light Prototype"')
  throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
})
