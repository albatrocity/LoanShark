Collection = require '/models/base/collection'
Person     = require '/models/person'

module.exports = class People extends Collection
  model: Person
  localStorage: new Backbone.LocalStorage("loan_shark-people")

  initialize: ->
    super
    @subscribeEvent 'lendee_change', @recalcBounty
  recalcBounty: (person) ->
    person = @get(person)
    @get(person).calculateBounty()