# Application routes.
module.exports = (match) ->
  match '',                'home#index',   name: 'home'
  match 'loans',           'loans#index',  name: 'loans'
  match 'loans/new',       'loans#edit',   name: 'new_loan'
  match 'loans/:id/edit',  'loans#edit',   name: 'edit_loan'

  match 'people',          'people#index', name: 'new_person'
  match 'people/new',      'people#edit',  name: 'new_person'
  match 'people/:id/edit', 'people#edit',  name: 'edit_person'
