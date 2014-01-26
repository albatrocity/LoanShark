View = require 'views/base/view'

module.exports = class LoanView extends View
  template: require './templates/loan'
  events:
    "click .destroy"     : "destroy"
    "click .reconcile"   : "reconcile"
    "click .unreconcile" : "unreconcile"

  render: ->
    super
    @el.querySelector('.daysPastDue').innerHTML = @model.getDaysPastDue()
    @el.querySelector('.compoundInterest').innerHTML = @model.calculateInterest()
    @el.querySelector('.compoundValue').innerHTML = @model.getTotalValue()

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