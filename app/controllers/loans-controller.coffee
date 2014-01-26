Controller = require 'controllers/base/controller'
Loan       = require 'models/loan'
LoansView  = require 'views/loans/loans-view'
LoanEditView = require 'views/loans/loan-edit-view'
Person     = require 'models/person'

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
    @findOrFetch params.id, loans, Loan, (model) =>
      if params.id
        @adjustTitle "Edit #{model.get('item_name')} loan"
      else
        @adjustTitle "New loan"

      if params.person_id
        model.set 'lendee_id', params.person_id

      @view  = new LoanEditView
        model: model
        region: 'main'

  update: (model, success, error) ->
    if model.get('first_name') or model.get('last_name')
      @create_person model, (person, model) =>
        model.set 'lendee_id', person.get('id')
        model.unset('first_name').unset('last_name')
        @persist model
    else
      @persist model

  create_person: (model, cb) ->
    person = new Person
      first_name: model.get('first_name')
      last_name:  model.get('last_name')
    @udpateModel person, people,
      success: (person) =>
        cb person, model
      error: (model, err) =>
        console.log err
        @publishEvent 'render_error', err

  persist: (model) ->
    item_name = model.get('item_name')
    if model.isNew()
      message = "Successfully loaned out #{item_name}."
    else
      message = "Successfully edited the loan for #{item_name}"

    @udpateModel model, loans,
      success: (model) =>
        @redirectTo 'home'
        @publishEvent 'flash_message', message
      error: (model, err) =>
        console.log err
        @publishEvent 'render_error', err
