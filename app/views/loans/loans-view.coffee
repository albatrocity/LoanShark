CollectionView = require 'views/base/collection-view'
LoanView       = require 'views/loans/loan-view'

module.exports = class LoansView extends CollectionView
  itemView: LoanView
  # listSelector: "#loans"