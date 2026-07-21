import ky from 'ky'

const prefixUrl = `${process.env.API_BASE_URL ?? ''}/`

export const instance = ky.extend({
  headers: {
    Accept: 'application/json',
  },
  prefixUrl,
})
