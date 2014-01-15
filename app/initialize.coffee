Application = require 'application'
routes = require 'routes'

# Initialize the application on DOM ready event.
$ ->
  new Application {
    title: 'Loan Shark',
    controllerSuffix: '-controller',
    routes
  }
