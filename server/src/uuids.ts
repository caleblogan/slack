import * as uuid from 'uuid'

export function generateUrlUUID(): string {
    const idLong = uuid.v4().replace(/-/g, '')
    return Buffer.from(idLong, "hex")
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
}