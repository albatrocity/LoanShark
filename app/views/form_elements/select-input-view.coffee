CollectionView   = require 'views/base/collection-view'
SelectOptionView = require './select-option-view'

module.exports = class SelectInputView extends CollectionView
  autoRender: true
  tagName: 'select'
  animationDuration: 0

  initialize: (options) ->
    super

    # Pull from options to pass to option tag view
    @value_attr  = options.value_attr
    @label_attr  = options.label_attr
    @name        = options.name
    @placeholder = options.placeholder
    @extra_ops   = options.extra_options


  render: ->
    super
    @el.name = @name
    @el.placeholder = @placeholder
    for option in @extra_ops
      if option.method is 'append'
        index = @subviews.length
      else
        index = 0
      view = new SelectOptionView
        model: null
        value: option.value
        label_attr: option.label
        src_model: @model
        name: @name

      @insertView null, view, index

  initItemView: (model) ->
    # Override initItemView to pass value and label
    # options to collection item views
    new SelectOptionView
      model: model
      value_attr: @value_attr
      label_attr: @label_attr
      src_model: @model
      name: @name