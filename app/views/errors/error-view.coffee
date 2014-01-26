View     = require 'views/base/view'
template = require './templates/show'

module.exports = class ErrorView extends View
  template: template
  className: 'error'
  autoRender: true
  autoAttach: true

  render: ->
    super