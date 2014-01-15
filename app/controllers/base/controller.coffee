SiteView   = require 'views/layout/site-view'
People     = require 'models/people'
Loans      = require 'models/loans'
HeaderView = require 'views/layout/header-view'

module.exports = class Controller extends Chaplin.Controller
  # Compositions persist stuff between controllers.
  # You may also persist models etc.
  beforeAction: ->
    Chaplin.mediator.loans.fetch()
    Chaplin.mediator.people.fetch()
    @compose 'site', SiteView
    @compose 'header', HeaderView, region: 'header'