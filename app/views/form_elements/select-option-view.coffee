View = require 'views/base/view'
template = require './templates/option'

module.exports = class SelectOptionView extends View
  autoRender: true
  tagName: 'option'

  initialize: (options) ->
    super
    @value_attr = options.value_attr
    if typeof @value_attr is 'function'
      @value_attr = @value_attr()

    @label_attr = options.label_attr
    if typeof @label_attr is 'function'
      @label_attr = @label_attr()

  render: ->
    super
    @$el.attr 'value', @model.get(@value_attr)
    @$el.text @label_attr