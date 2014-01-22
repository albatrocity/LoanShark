People = require 'models/people'
Loans  = require 'models/loans'
config = require 'config'

# The application object.
module.exports = class Application extends Chaplin.Application
  start: ->
    Chaplin.mediator.people.fetch()
    Chaplin.mediator.loans.fetch()
    super
  #   # You can fetch some data here and start app
  #   # (by calling `super`) after that.
  initMediator: ->
    Chaplin.mediator.people = new People
    Chaplin.mediator.loans  = new Loans
    super

  initRouter: (routes, options) ->
    options.root = config.root
    super