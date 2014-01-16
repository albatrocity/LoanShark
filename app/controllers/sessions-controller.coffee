SiteView     = require 'views/layout/site-view'
HeaderView   = require 'views/layout/header-view'
Controller   = require 'controllers/base/controller'
LoginView    = require 'views/sessions/login-view'
RegisterView = require 'views/sessions/register-view'
Person       = require 'models/person'

loans  = Chaplin.mediator.loans
people = Chaplin.mediator.people

module.exports = class SessionsController extends Controller
  initialize: ->
    super
    @subscribeEvent 'savePerson', @registerPerson
  beforeAction: ->
    @compose 'site', SiteView
    @compose 'header', HeaderView, region: 'header'
  new: ->
    model = Chaplin.mediator.user
    @view = new LoginView model: model, region: 'main'
  register: ->
    @model = new Person
    @view  = new RegisterView model: @model, region: 'main'

  registerPerson: (person) ->
    person.save person.attributes,
      success: (model) =>
        Chaplin.mediator.user.set model.attributes
        console.log Chaplin.mediator.user
        @redirectTo 'loans'
        @publishEvent 'flash_message', "Thanks for regiterin', dude"

