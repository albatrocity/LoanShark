require 'lib/view-helper' # Just load the view helpers, no return value

module.exports = class View extends Chaplin.View
  # Auto-save `template` option passed to any view as `@template`.
  optionNames: Chaplin.View::optionNames.concat ['template']
  autoRender: true
  autoBind: true
  listen:
    "change model": "updateView"

  # Precompiled templates function initializer.
  getTemplateFunction: ->
    @template

  render: ->
    super
    if @model
      @attr_names = Object.keys(@model.attributes)
      @updateView() if @autoBind

  updateView: ->
    for attr_name in @attr_names
      input_el = @el.querySelector("[name='#{attr_name}']")
      if input_el
        input_el.value = @model.get(attr_name)

      text = @el.querySelector("[data-bind='#{attr_name}']")
      if text
        text.innerHTML(@model.get(attr_name))

  save: (e, success, error) ->
    # Simple binding/mapping
    input_els = []
    for el in @el.getElementsByTagName("input")
      input_els.push el
    for el in @el.getElementsByTagName("select")
      input_els.push el

    input_els.forEach (el) =>
      name = el.getAttribute('name')
      @model.set name, el.value, silent: true
    @publishEvent "save#{@model.constructor.name}", @model

  destroy: (e, success, error) ->
    e.preventDefault()
    @publishEvent "destroy#{@model.constructor.name}", @model