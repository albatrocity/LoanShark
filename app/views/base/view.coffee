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
      @attr_names = _.keys @model.attributes
      @updateView() if @autoBind

  updateView: ->
    for attr_name in @attr_names
      @$el.find("[name='#{attr_name}']").val(@model.get(attr_name))
      @$el.find("[data-bind='#{attr_name}']").text(@model.get(attr_name))

  save: (e, success, error) ->
    @$el.find("input, select").each (i, el) =>
      $el = $(el)
      name = $el.attr('name')
      @model.set name, $el.val(), silent: true
    @publishEvent "save#{@model.constructor.name}", @model

  destroy: (e, success, error) ->
    e.preventDefault()
    @publishEvent "destroy#{@model.constructor.name}", @model