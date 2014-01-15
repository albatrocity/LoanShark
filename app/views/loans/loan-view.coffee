View = require 'views/base/view'

module.exports = class LoanView extends View
  template: require './templates/loan'
  events:
    "click .destroy"     : "destroy"
    "click .reconcile"   : "reconcile"
    "click .unreconcile" : "unreconcile"

  destroy: (e) ->
    e.preventDefault()
    @model.destroy()

  reconcile: (e) ->
    e.preventDefault()
    @model.reconcile()
    @render()
  unreconcile: (e) ->
    e.preventDefault()
    @model.unreconcile()
    @render()