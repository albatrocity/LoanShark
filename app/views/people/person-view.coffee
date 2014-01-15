View = require 'views/base/view'

module.exports = class PersonView extends View
  template: require './templates/person'
  className: 'person'
  events:
    'mouseover': 'toggleControls'
    'mouseout': 'toggleControls'

  render: ->
    super
    @$controls = @$el.find(".controls")
    @$controls.hide()

  toggleControls: (e) ->
    if e.type is 'mouseover'
      @$controls.show()
    else
      @$controls.hide()