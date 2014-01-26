View = require './view'
ErrorsCollection = require 'models/errors'
ErrorsView = require 'views/errors/errors-view'
Error = require 'models/error'

module.exports = class FormView extends View
  autoRender: true
  regions:
    'errors': '.errors'
  initialize: ->
    super
    @errors = new ErrorsCollection()
    @subscribeEvent 'render_error', @renderError
  render: ->
    super
    @errors_view = new ErrorsView
      collection: @errors
      container: @el.querySelector('.errors')
      autoRender: true
    if @model
      @listenTo @model, 'invalid', (model, error) =>
        @renderError(error)

  renderError: (error, model) ->
    @errors.reset()
    @errors_view.render()
    if typeof error is 'string'
      errorObj =
        text: error
      @errors.add(errorObj)
    else if typeof error is 'object'
      for err in error
        errorObj =
          text: err
        @errors.add(errorObj)
    else
      console.log error