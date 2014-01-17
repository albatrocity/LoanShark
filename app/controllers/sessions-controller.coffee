SiteView     = require 'views/layout/site-view'
HeaderView   = require 'views/layout/header-view'
Controller   = require 'controllers/base/controller'
LoginView    = require 'views/sessions/login-view'
Login        = require 'models/login'
RegisterView = require 'views/sessions/register-view'
Person       = require 'models/person'

loans  = Chaplin.mediator.loans
people = Chaplin.mediator.people

module.exports = class SessionsController extends Controller
  initialize: ->
    super
    @subscribeEvent 'savePerson', @registerPerson
    @subscribeEvent 'saveLogin',  @login
  beforeAction: ->
    @compose 'site', SiteView
    @compose 'header', HeaderView, region: 'header'
  new: ->
    @model = new Login()
    @view = new LoginView model: @model, region: 'main'
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


  login: (login) ->
    user_email = login.get('email')
    db = PouchDB('loan-shark-db')

    map = (doc) ->
      emit doc.email, null if doc.email

    db.query
      map: (doc) ->
        if doc.type is 'person' and doc.email
          emit doc.email, null
    ,
      reduce: false
    , (err, response) =>
      matches = response.rows.filter (p) ->
        return p.id if p.key is user_email
      user = matches[0]
      db.get user.id, (err,u) =>
        @setCurrentUser(u)

  setCurrentUser: (attrs) ->
    current_user = Chaplin.mediator.user
    Chaplin.mediator.user.set attrs
    @redirectTo 'home'
    @publishEvent 'flash_message', "You have been logged in, #{current_user.get('first_name')}"

