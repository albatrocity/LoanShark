Controller = require 'controllers/base/controller'
Loan       = require 'models/loan'
LoansView  = require 'views/loans/loans-view'
LoanEditView = require 'views/loans/loan-edit-view'

loans  = Chaplin.mediator.loans
people = Chaplin.mediator.people

module.exports = class LoansController extends Controller

  initialize: ->
    super
    @subscribeEvent 'saveLoan', @update

  index: ->
    @adjustTitle ''
    @view = new LoansView region: 'main', collection: loans, detailed: true

  edit: (params) ->
    if params.id
      model = loans.get(params.id)
      @adjustTitle "Edit #{model.get('item_name')} loan"
    else
      model = new Loan()
      @adjustTitle 'New Loan'

    if params.person_id
      model.set 'lendee_id', params.person_id

    @view  = new LoanEditView
      model: model
      region: 'main'

  update: (model, success, error) ->
    item_name = model.get('item_name')
    model = loans.add model
    if model.isNew()
      message = "Successfully loaned out #{item_name}."
    else
      message = "Successfully edited the loan for #{item_name}"
    model.set('updated_at', new Date)
    model.save model.attributes,
      success: (model, attrs) =>
        success(model) if success
        @redirectTo 'home'
        @publishEvent 'flash_message', message
      error: (model, err) ->
        error(model, err) if error