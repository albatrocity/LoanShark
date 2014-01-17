View = require 'views/base/view'

module.exports = class LoginView extends View
  template: require './templates/login'
  events:
    'submit form': 'login'

  login: (e) ->
    e.preventDefault()
    @save()