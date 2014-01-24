View       = require 'views/base/form-view'
Person     = require 'models/person'
PeopleView = require 'views/people/people-view'

module.exports = class PersonEditView extends View
  template: require './templates/person-edit'
  events:
    'click button.save': 'save'
    'click button.destroy': 'destroy'
  initialize: (options) ->
    super
    @embedded = options.embedded
  render: ->
    super
    if @embedded
      button = @el.querySelector('button')
      @el.removeChild button
  save: ->
    unless @model
      @model = new Person()
    super