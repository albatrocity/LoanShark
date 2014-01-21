Application = require 'application'
routes = require 'routes'
# Initialize the application on DOM ready event.
document.onreadystatechange = ->
  if document.readyState == "complete" || document.readyState == "loaded"
    new Application {
      title: 'Loan Shark',
      controllerSuffix: '-controller',
      routes
    }
