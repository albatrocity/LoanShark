Application = require 'application'
routes = require 'routes'
# Initialize the application on DOM ready event.

document.addEventListener "DOMContentLoaded", (->
  document.removeEventListener "DOMContentLoaded"
  new Application {
    title: 'Loan Shark',
    controllerSuffix: '-controller',
    routes
  }
), false
