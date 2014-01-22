Model = require '/models/base/model'


module.exports = class Loan extends Model
  defaults:
    type: 'loan'
    reconciled: false
  reconcile: ->
    @set 'reconciled', true
    @set 'date_reconciled', new Date
    @save()
  unreconcile: ->
    @set 'reconciled', false
    @unset 'date_reconciled'
    @save()

  save: ->
    @updateBounties()
    super
  destroy: ->
    super
    @updateBounties()
  updateBounties: ->
    people = Chaplin.mediator.people
    lendee     = people.get(@get('lendee_id'))
    lendee.calculateBounty()
