View            = require 'views/base/view'
PeopleView      = require 'views/people/people-view'
SelectInputView = require 'views/form_elements/select-input-view'
Loan            = require 'models/loan'

module.exports = class LoanEditView extends View
  template: require './templates/loan-edit'
  events:
    'click button': 'save'
  regions:
    people: '.people'

  render: ->
    super
    people_select = new SelectInputView
      collection: Chaplin.mediator.people
      value_attr: '_id'
      container: @el
      name: 'lendee_id'
      placeholder: 'Lendee'
      region: 'people'
      model: @model
      label_attr: ->
        person = this.model
        person.get('first_name') + ' ' +
        person.get('last_name')
    @subview 'people_select', people_select

  save: ->
    unless @model
      @model = new Loan()
    super