Model = require '/models/base/model'

module.exports = class Person extends Model
  defaults:
    first_name: ''
    last_name: ''
    bounty: 0

  initialize: ->
    super
    @calculateBounty()
    @listenTo Chaplin.mediator.loans, 'change remove add', (model) ->
      if model.get('lendee_id') is @get('id')
        @calculateBounty()

  calculateBounty: ->
    loans = Chaplin.mediator.loans.where
      lendee_id: @get('id')
      reconciled: false
    values = loans.map (l) ->
      parseFloat(l.get('value'))
    if values.length is 0
      total = 0
    else
      total = values.reduce (memo, val) ->
        memo + val
    @set 'bounty', total
    @save()

  full_name: ->
    @get('first_name') + ' ' + @get('last_name')
