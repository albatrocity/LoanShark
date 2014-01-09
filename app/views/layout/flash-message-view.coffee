View = require 'views/base/view'

module.exports = class FlashMessageView extends View
  autoRender: true
  autoAttach: true
  template: require './templates/flash-message'
  events:
    'click .dismiss': 'dismissFlash'

  initialize: ->
    super
    @subscribeEvent 'dismissFlash', @dismissFlash

  render: ->
    super
    # Dismiss after lifespan
    lifespan = setTimeout =>
      @dismissFlash()
      clearTimeout(lifespan)
    , @model.get('lifespan')

  dismissFlash: (e) ->
    e.preventDefault() if e
    @model.dispose() if @model