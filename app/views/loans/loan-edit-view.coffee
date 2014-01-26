View            = require 'views/base/form-view'
PeopleView      = require 'views/people/people-view'
PersonEditView  = require 'views/people/person-edit-view'
SelectInputView = require 'views/form_elements/select-input-view'
Loan            = require 'models/loan'

module.exports = class LoanEditView extends View
  template: require './templates/loan-edit'
  events:
    'click button': 'save'
    'change select': 'checkOption'
  regions:
    people: '.people'
    new_person: '.new-person'

  render: ->
    super
    people_select = new SelectInputView
      collection: Chaplin.mediator.people
      value_attr: 'id'
      extra_options: [
        label: '> Somebody new <', value: 'new-person', method: 'append'
      ]
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
    @checkOption()

  save: ->
    new_lendee = @el.querySelector("[name='lendee_id']").value
    old_lendee = @model.get('lendee_id')
    unless @model
      @model = new Loan()
    super
    if old_lendee and new_lendee != old_lendee and @model.isValid()
      @publishEvent 'lendee_change', old_lendee

  checkOption: (e) ->
    select = @subview('people_select').el
    if select.value is 'new-person'
      person_view = new PersonEditView
        region: 'new_person'
        embedded: true
      @subview 'new_person', person_view
    else
      @removeSubview 'new_person' if @subview 'new_person'

  handleKeys: (e) ->
    if e.keyCode == 13 then @save()
