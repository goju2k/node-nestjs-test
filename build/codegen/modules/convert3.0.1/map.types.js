const typeMapForPath = new Map()
typeMapForPath.set('string', 'string')
typeMapForPath.set('integer', 'number')
typeMapForPath.set('number', 'number')
typeMapForPath.set('boolean', 'boolean')
typeMapForPath.set('array', '[]')
typeMapForPath.set('object', '')

module.exports = typeMapForPath