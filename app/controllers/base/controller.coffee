SiteView = require 'views/layout/site-view'
People   = require 'models/people'
Loans    = require 'models/loans'

module.exports = class Controller extends Chaplin.Controller
  # Compositions persist stuff between controllers.
  # You may also persist models etc.
  beforeAction: ->
    Chaplin.mediator.loans.fetch()
    Chaplin.mediator.people.fetch()
    @compose 'site', SiteView