Collection = require '/models/base/collection'
Person     = require '/models/person'

module.exports = class People extends Collection
  model: Person
  url: '/people'
  # localStorage: new Backbone.LocalStorage("ls-People")