Model = require '/models/base/model'


module.exports = class Loan extends Model
  defaults:
    type: 'loan'
    reconciled: false
    interest_rate: .2
  reconcile: ->
    @set 'reconciled', true
    @set 'date_reconciled', new Date
    @save()
  unreconcile: ->
    @set 'reconciled', false
    @unset 'date_reconciled'
    @save()

  save: ->
    @updateBounties() if @isValid()
    super
  destroy: ->
    super
    @updateBounties()
  updateBounties: ->
    people = Chaplin.mediator.people
    lendee = people.get(@get('lendee_id'))
    lendee.calculateBounty() if lendee

  getDaysPastDue: ->
    if @get 'created_at'
      dateDiff = new Date() - new Date(@get 'created_at')
      Math.floor dateDiff/86400000
    else 0

  calculateInterest: ->
    initialValue = parseInt(@get 'value')
    totalOwed = initialValue
    interest = @get 'interest_rate'
    daysPastDue = @getDaysPastDue()

    if daysPastDue != 0
      for days in [1..daysPastDue]
        totalOwed += totalOwed*interest

      totalOwed - initialValue
    else 0

  getTotalValue: ->
    parseInt(@get 'value') + @calculateInterest()

  validate: (attrs) ->
    errors = []
    if attrs.item_name is ''
      errors.push "Make a note of what the loan is for. That description field is required."
    if attrs.value is ''
      errors.push "Add a value so we can calculate a bounty on this person's head."
    return errors if errors.length
