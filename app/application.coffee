People = require 'models/people'
Loans  = require 'models/loans'
# The application object.
module.exports = class Application extends Chaplin.Application
  # start: ->
  #   # You can fetch some data here and start app
  #   # (by calling `super`) after that.
  #   super
  initMediator: ->
    Chaplin.mediator.people = new People
    Chaplin.mediator.loans  = new Loans
    super
