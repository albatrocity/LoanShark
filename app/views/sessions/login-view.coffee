View = require 'views/base/view'

module.exports = class LoginView extends View
  template: require './templates/login'
  tagName: 'form'
  events:
    'submit form': 'login'

  login: (e) ->
    e.preventDefault()
    console.log 'hey'