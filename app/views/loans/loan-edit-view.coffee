View = require 'views/base/view'

module.exports = class LoanEditView extends View
  template: require './templates/loan-edit'
  events:
    'click button': 'save'
