View = require 'views/base/view'
template = require './templates/option'

module.exports = class SelectOptionView extends View
  autoRender: true
  tagName: 'option'

  initialize: (options) ->
    super
    @src_model  = options.src_model
    @name       = options.name
    @value_attr = options.value_attr
    @value      = options.value

    if typeof @value_attr is 'function'
      @value_attr = @value_attr()

    @label_attr = options.label_attr
    if typeof @label_attr is 'function'
      @label_attr = @label_attr()

  render: ->
    super
    @el.innerHTML = @label_attr
    if @model
      # get model attribute if model
      @el.value = @model.get(@value_attr)
      if @model.get(@value_attr) is @src_model.get(@name)
        @el.selected = true
    else
      # use supplied value for model-less options
      @el.value = @value