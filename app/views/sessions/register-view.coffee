View = require 'views/base/view'

module.exports = class RegisterView extends View
  template: require './templates/register'
  events:
    'submit form': 'save'

  save: (e) ->
    e.preventDefault()
    super