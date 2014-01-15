View = require 'views/base/view'

module.exports = class PersonView extends View
  template: require './templates/person'
  className: 'person'
  events:
    'mouseover': 'toggleControls'
    'mouseout': 'toggleControls'

  render: ->
    super
    @$controls = @el.querySelector(".controls")
    @$controls.style.display = "none"

  toggleControls: (e) ->
    if e.type is 'mouseover'
      @$controls.style.display = "box"
    else
      @$controls.style.display = "none"