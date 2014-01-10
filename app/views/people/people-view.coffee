CollectionView = require 'views/base/collection-view'
PersonView     = require 'views/people/person-view'

module.exports = class PeopleView extends CollectionView
  itemView: PersonView