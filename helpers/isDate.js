const { DateTime } = require('luxon')

const isDate = (value) => {
  if (!value) return false
  if (DateTime.fromFormat(value, 'yyyy-MM-dd HH:mm:ss')) return true

  return false
}

module.exports = {
  isDate,
}
