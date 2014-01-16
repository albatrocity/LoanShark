Person = require 'models/person'
People = require 'models/people'
Loans  = require 'models/loans'

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
    Chaplin.mediator.user   = new Person
    super
