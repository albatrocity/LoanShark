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
    @view = new PeopleView region: 'main', collection: people

  edit: (params) ->
    if params.id
      model = people.get(params.id)
      @adjustTitle "Edit #{model.full_name()}"
    else
      model = people.add({})
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
    model.set('updated_at', new Date)
    model.save model.attributes,
      success: (model, attrs) =>
        success(model) if success
        @redirectTo 'person', id: model.get('id')
        @publishEvent 'flash_message', message
      error: (model, err) ->
        error(model, err) if error

  show: (params) ->
    model = people.get(params.id)
    @adjustTitle "#{model.full_name()}"
    @view  = new PersonDetailView model: model, region: 'main'

  destroy: (model) ->
    model.destroy()
    message = "#{model.get('first_name')} was sucessfully removed"
    @redirectTo 'people'
    @publishEvent 'flash_message', message