View       = require 'views/base/view'
PeopleView = require 'views/people/people-view'

module.exports = class PersonEditView extends View
  template: require './templates/person-edit'
  events:
    'click button.save': 'save'
    'click button.destroy': 'destroy'