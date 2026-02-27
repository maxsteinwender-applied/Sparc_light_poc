import { describe, expect, it } from 'vitest'
import { isAuthorizedBasicAuth } from '../../server/middleware/basic-auth'

describe('basic auth middleware helper', () => {
  const expectedUser = 'sparc'
  const expectedPassword = 'light'

  it('rejects when header is missing', () => {
    const result = isAuthorizedBasicAuth(undefined, expectedUser, expectedPassword)

    expect(result).toBe(false)
  })

  it('rejects when credentials are wrong', () => {
    const wrongHeader = `Basic ${Buffer.from('sparc:wrong').toString('base64')}`

    const result = isAuthorizedBasicAuth(wrongHeader, expectedUser, expectedPassword)

    expect(result).toBe(false)
  })

  it('accepts when credentials are correct', () => {
    const validHeader = `Basic ${Buffer.from('sparc:light').toString('base64')}`

    const result = isAuthorizedBasicAuth(validHeader, expectedUser, expectedPassword)

    expect(result).toBe(true)
  })
})
