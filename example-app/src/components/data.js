// let fs = require('fs')
import db from '../../db/db.json'

export default {
  db,
  register,
  unregister,
}

export function register(account, network) {
  db.accounts[account][network] = true
}
export function unregister(account, network) {
  db.accounts[account][network] = false
}
