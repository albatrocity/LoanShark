CollectionView = require 'views/base/collection-view'
LoanView       = require 'views/loans/loan-view'
LoanDetailView = require 'views/loans/loan-detail-view'
template       = require './templates/loans'

module.exports = class LoansView extends CollectionView
  template: template
  listSelector: '.loans'
  initialize: (options) ->
    super
    @detailed = options.detailed
  initItemView: (model) ->
    if @detailed
      new LoanDetailView model: model
    else
      new LoanView model: model