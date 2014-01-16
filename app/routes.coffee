# Application routes.
module.exports = (match) ->
  match '',                'loans#index',  name: 'home'
  match 'loans',           'loans#index',  name: 'loans'
  match 'loans/new',       'loans#edit',   name: 'new_loan'
  match 'loans/:id/edit',  'loans#edit',   name: 'edit_loan'

  match 'people',          'people#index', name: 'people'
  match 'people/new',      'people#edit',  name: 'new_person'
  match 'people/:id',      'people#show',  name: 'person'
  match 'people/:id/edit', 'people#edit',  name: 'edit_person'
  match 'people/:person_id/loans/new',      'loans#edit',  name: 'person_new_loan'

  match 'login',           'sessions#new', name: 'login'
  match 'register',        'sessions#register', name: 'register'
