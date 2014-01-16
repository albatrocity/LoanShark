PersonView = require 'views/people/person-view'
LoansView  = require 'views/loans/loans-view'
Loans      = require 'models/loans'
template   = require 'views/people/templates/person-detail'

loans  = Chaplin.mediator.loans

module.exports = class PersonDetailView extends PersonView
  template: template
  regions:
    borrowed: '.borrowed-items'
  render: ->
    super
    @renderBorrowed()

  renderBorrowed: ->
    borrowed_items = loans.where
      lendee_id: @model.get('_id')
    borrowed_items = new Loans(borrowed_items)

    loans_view = new LoansView
      collection: borrowed_items
      details: false
      region: 'borrowed'

    @subview 'loans', loans_view