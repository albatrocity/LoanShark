View      = require 'views/base/view'
LoansView = require 'views/loans/loans-view'

module.exports = class HomePageView extends View
  autoRender: true
  className: 'home-page'
  template: require './templates/home'

  render: ->
    super
    loans_view = new LoansView
      collection: Chaplin.mediator.loans
      container: @$el