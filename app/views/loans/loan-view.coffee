View = require 'views/base/view'
PersonView = require 'views/people/person-view'

module.exports = class LoanView extends View
  template: require './templates/loan'
  events:
    "click .destroy"     : "destroy"
    "click .reconcile"   : "reconcile"
    "click .unreconcile" : "unreconcile"

  render: ->
    super
    @renderUserView()

  renderUserView: ->
    person = Chaplin.mediator.people.get @model.get('lendee_id')
    new PersonView
      model: person
      container: @$el.find('.lendee')
      containerMethod: 'prepend'


  destroy: (e) ->
    e.preventDefault()
    @model.destroy()

  reconcile: (e) ->
    e.preventDefault()
    @model.reconcile()
    @render()
  unreconcile: (e) ->
    e.preventDefault()
    @model.unreconcile()
    @render()