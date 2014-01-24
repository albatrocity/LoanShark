CollectionView = require 'views/base/collection-view'
ErrorView      = require './error-view'
template       = require './templates/collection'

module.exports = class ErrorsView extends CollectionView
  itemView: ErrorView
  animationDuration: 0
  listen:
    'add collection': 'showView'

  render: ->
    super
    if @collection.length == 0
      @el.style.display = 'none'
  showView: ->
    if @collection.length > 0
      @el.style.display = ''