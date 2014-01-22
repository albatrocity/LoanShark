# Application-specific view helpers
jade.helpers =
  url: (routeName, params) ->
    Chaplin.utils.reverse routeName, params
