CollectionView = require 'views/base/collection-view'
LoanView       = require 'views/loans/loan-view'
LoanDetailView = require 'views/loans/loan-detail-view'
template       = require './templates/loans'

module.exports = class LoansView extends CollectionView
  template: template
  listSelector: '.loans'
  fallbackSelector: '.empty'
  initialize: (options) ->
    super
    @lendee   = options.lendee
    @detailed = options.detailed
  render: ->
    super
    if @lendee
      @el.querySelector('.target-lendee').innerHTML = @lendee.get('first_name')
      loan_link = @el.querySelector('.new-loan-link')
      loan_link.parentNode.removeChild(loan_link)
  initItemView: (model) ->
    if @detailed
      new LoanDetailView model: model
    else
      new LoanView model: model