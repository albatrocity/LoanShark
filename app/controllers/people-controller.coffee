Controller       = require 'controllers/base/controller'
Person           = require 'models/person'
People           = require 'models/people'
PeopleView       = require 'views/people/people-view'
PersonDetailView = require 'views/people/person-detail-view'
PersonEditView   = require 'views/people/person-edit-view'

loans  = Chaplin.mediator.loans
people = Chaplin.mediator.people

module.exports = class LoansController extends Controller

  initialize: ->
    super
    @subscribeEvent 'savePerson', @update
    @subscribeEvent 'destroyPerson', @destroy

  index: ->
    @adjustTitle "People"
    people.fetch
      success: ->
        console.log people
      error: (col, err) ->
        console.log col
        console.log err

    @view = new PeopleView region: 'main', collection: people

  edit: (params) ->
    @findOrFetch params.id, people, Person, (model) =>
      if params.id
        @adjustTitle "Edit #{model.full_name()}"
      else
        @adjustTitle "New Person"
      @view  = new PersonEditView
        model: model
        region: 'main'
        collection: people

  update: (model, success, error) ->
    name = model.get('first_name') + " " + model.get('last_name')
    if model.isNew()
     message = "Successfully added #{name}"
    else
      message = "Successfully edited #{name}"

    @udpateModel model, people,
      success: (model) =>
        @redirectTo 'person', id: model.get('_id')
        @publishEvent 'flash_message', message
      error: (model, err) ->
        console.log err
        @publishEvent 'error', err


  show: (params) ->
    @findOrFetch params.id, people, Person, (model) =>
      @adjustTitle "#{model.full_name()}"
      @view  = new PersonDetailView model: model, region: 'main'


  destroy: (model) ->
    model = people.get(model)
    model.destroy
      success: =>
        message = "#{model.get('first_name')} was sucessfully removed"
        @redirectTo 'people'
        @publishEvent 'flash_message', message