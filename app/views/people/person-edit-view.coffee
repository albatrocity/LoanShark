View       = require 'views/base/view'
Person     = require 'models/person'
PeopleView = require 'views/people/people-view'

module.exports = class PersonEditView extends View
  template: require './templates/person-edit'
  events:
    'click button.save': 'save'
    'click button.destroy': 'destroy'

  save: ->
    unless @model
      @model = new Person()
    super