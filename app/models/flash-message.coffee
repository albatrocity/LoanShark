Model = require './base/model'

# SiteView handles listening for `flash_message` event and creates
# a message and a view. ex: @publishEvent 'flash_message', "Logged in"

module.exports = class FlashMessage extends Model
  defaults:
    message: "Something needs your attention"
    lifespan: 5000