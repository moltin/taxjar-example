import { createClient } from '@moltin/request'

export const client = new createClient({ // eslint-disable-line new-cap
  client_id: '4c1wMvFpowqjse795EwbddDIk56z3PKgSyMFNW7JSd',
})

export const generateUUID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}
