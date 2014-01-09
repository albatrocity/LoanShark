# Application routes.
module.exports = (match) ->
  match '', 'loans#index', name: 'home'
  match 'loans/new', 'loans#edit', name: 'new_loan'
  match 'loans/:id/edit', 'loans#edit', name: 'edit_loan'
