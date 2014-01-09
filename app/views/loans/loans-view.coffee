CollectionView = require 'views/base/collection-view'
LoanView       = require 'views/loans/loan-view'

module.exports = class LoansView extends CollectionView
  template: require './templates/loans'
  itemView: LoanView
  listSelector: "#loans"
