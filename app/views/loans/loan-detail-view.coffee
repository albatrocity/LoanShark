LoanView = require 'views/loans/loan-view'
PersonView = require 'views/people/person-view'

module.exports = class LoanDetailView extends LoanView
  template: require './templates/loan-detail'

  render: ->
    super
    @renderUserView()

  renderUserView: ->
    person = Chaplin.mediator.people.get @model.get('lendee_id')
    new PersonView
      model: person
      el: @el.querySelector('.person')