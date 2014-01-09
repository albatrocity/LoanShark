Controller = require 'controllers/base/controller'
Loan       = require 'models/loan'
Loans      = require 'models/loans'
LoansView  = require 'views/loans/loans-view'
LoanEditView = require 'views/loans/loan-edit-view'

module.exports = class LoansController extends Controller

  initialize: ->
    @subscribeEvent 'saveLoan', @update

  beforeAction: ->
    super
    # @people = new People
    # @people.fetch()
    @loans  = new Loans
    @loans.fetch()

  index: ->
    @view = new LoansView region: 'main', collection: @loans

  edit: (params) ->
    if params.id
      @model = @loans.get(params.id)
      console.log @model
    else
      @model = @loans.add({})

    @view  = new LoanEditView
      model: @model
      region: 'main'
      collection: @loans

  update: (model, success, error) ->
    item_name = model.get('item_name')
    if model.isNew()
      message = "Successfully loaned out #{item_name}."
    else
      message = "Successfully edited the loan for #{item_name}"

    model.save model.attributes,
      success: (model, attrs) =>
        success(model) if success
        @redirectTo 'home'
        @publishEvent 'flash_message', message
      error: (model, err) ->
        error(model, err) if error