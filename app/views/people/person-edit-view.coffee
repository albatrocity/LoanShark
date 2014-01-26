View       = require 'views/base/view'
Person     = require 'models/person'
PeopleView = require 'views/people/people-view'

module.exports = class PersonEditView extends View
  template: require './templates/person-edit'
  events:
    'keyup' : 'handleKeys'
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
  handleKeys: (e) ->
    if e.keyCode == 13 then @save()