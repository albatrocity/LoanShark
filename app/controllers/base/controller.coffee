SiteView   = require 'views/layout/site-view'
People     = require 'models/people'
Loans      = require 'models/loans'
HeaderView = require 'views/layout/header-view'

module.exports = class Controller extends Chaplin.Controller
  # Compositions persist stuff between controllers.
  # You may also persist models etc.
  beforeAction: ->
    @compose 'site', SiteView
    @compose 'header', HeaderView, region: 'header'

  findOrFetch: (id, collection, klass, cb) ->
    # Look up model in mediator collection.
    # If not found, fetch the collection and
    # find within collection. Saves DB calls.
    if id
      model = collection.get(id)
      if model
        cb(model)
      else
        collection.fetch
          success: (collection) =>
            model = collection.get(id)
            if model
              cb(model)
            else
              cb(collection.add())
    else
      model = new klass
      cb(model)

  udpateModel: (model, collection, options) ->
    if model.isNew()
      collection.add model
    model.set('updated_at', new Date)
    model.save model.attributes,
      success: (model, attrs) =>
        options.success(model) if options.success
      error: (model, err) ->
        error(model, err) if error