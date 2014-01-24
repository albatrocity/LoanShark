CollectionView = require 'views/base/collection-view'
PersonView     = require 'views/people/person-view'
template       = require 'views/people/templates/people'

module.exports = class PeopleView extends CollectionView
  itemView: PersonView
  template: template
  listSelector: '.people'
  fallbackSelector: '.empty'