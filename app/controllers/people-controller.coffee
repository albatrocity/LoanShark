Controller     = require 'controllers/base/controller'
Person         = require 'models/person'
People         = require 'models/people'
PeopleView     = require 'views/people/people-view'
PersonEditView = require 'views/people/person-edit-view'

loans  = Chaplin.mediator.loans
people = Chaplin.mediator.people

module.exports = class LoansController extends Controller

  initialize: ->
    super
    @subscribeEvent 'savePerson', @update

  index: ->
    @view = new PeopleView region: 'main', collection: people

  edit: (params) ->
    if params.id
      model = people.get(params.id)
    else
      model = people.add({})

    @view  = new PersonEditView
      model: model
      region: 'main'
      collection: people

  update: (model, success, error) ->
    name = model.get('first_name') + " " + model.get('last_name')
    if model.isNew()
      message = "Successfully added #{name}."
    else
      message = "Successfully edited #{name}"

    model.save model.attributes,
      success: (model, attrs) =>
        success(model) if success
        @redirectTo 'home'
        @publishEvent 'flash_message', message
      error: (model, err) ->
        error(model, err) if error