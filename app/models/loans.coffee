Collection = require '/models/base/collection'
Loan       = require '/models/loan'

module.exports = class Loans extends Collection
  model: Loan
  fallbackSelector: '.empty'
  localStorage: new Backbone.LocalStorage("loan_shark-loans")

  initialize: ->
    super
    @listenTo @, 'change', @sort
  comparator: (a,b) ->
    if a.get('reconciled')
      return 1
    else
      return -1