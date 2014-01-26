Error = require 'models/error'
Collection = require './base/collection'

module.exports = class Errors extends Collection
  model: Error