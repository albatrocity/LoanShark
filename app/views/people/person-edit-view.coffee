View       = require 'views/base/form-view'
Person     = require 'models/person'
PeopleView = require 'views/people/people-view'

module.exports = class PersonEditView extends View
  template: require './templates/person-edit'
  events:
    'submit form' : 'save'
    'click button.destroy': 'destroy'
  initialize: (options) ->
    super
    @embedded = options.embedded
  render: ->
    super
    if @embedded
      button = @el.querySelector('button')
      @el.removeChild button
  save: (e) ->
    e.preventDefault()
    unless @model
      @model = new Person()
    super