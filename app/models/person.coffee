Model = require '/models/base/model'

module.exports = class Person extends Model
  defaults:
    type: 'person'
    first_name: ''
    last_name: ''
    bounty: 0

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

  destroy: ->
    loans = Chaplin.mediator.loans.where
      lendee_id: @get('id')
    for loan in loans
      loan.destroy()
    super

  validate: (attrs) ->
    errors = []
    if attrs.first_name is '' or attrs.last_name is ''
      errors.push "We're going to need a name to harass them by later..."
    return errors if errors.length
