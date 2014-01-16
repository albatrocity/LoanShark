Model = require '/models/base/model'

module.exports = class Loan extends Model
  sync: BackbonePouch.sync
    db: PouchDB('loan-shark-db')
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