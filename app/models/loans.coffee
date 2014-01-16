Collection = require '/models/base/collection'
Loan       = require '/models/loan'

module.exports = class Loans extends Collection
  model: Loan
  fallbackSelector: '.empty'
  sync: BackbonePouch.sync(
    db: PouchDB("loan-shark-db")
    fetch: "query"
    options:
      query:
        include_docs: true
        fun:
          map: (doc) ->
            emit doc.position, null  if doc.type is "loan"

        limit: 10

      changes:
        include_docs: true
        filter: (doc) ->
          doc._deleted or doc.type is "loan"
  )
  parse: (result) ->
    result.rows.map (value) ->
      value["doc"]

  initialize: ->
    super
    @listenTo @, 'change', @sort
  comparator: (a,b) ->
    if a.get('reconciled')
      return 1
    else
      return -1