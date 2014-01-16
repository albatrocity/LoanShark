Collection = require '/models/base/collection'
Person     = require '/models/person'

module.exports = class People extends Collection
  model: Person
  sync: BackbonePouch.sync(
    db: PouchDB("loan-shark-db")
    fetch: "query"
    options:
      query:
        include_docs: true
        fun:
          map: (doc) ->
            emit doc.position, null  if doc.type is "person"

        limit: 10

      changes:
        include_docs: true
        filter: (doc) ->
          doc._deleted or doc.type is "person"
  )
  parse: (result) ->
    console.log "People"
    # console.log result
    result.rows.map (value) ->
      value["doc"]