# Base model.
module.exports = class Model extends Chaplin.Model
  snyc: BackbonePouch.sync
  idAttribute: '_id'
  # Mixin a synchronization state machine.
  # _(@prototype).extend Chaplin.SyncMachine
  # initialize: ->
  #   super
  #   @on 'request', @beginSync
  #   @on 'sync', @finishSync
  #   @on 'error', @unsync
