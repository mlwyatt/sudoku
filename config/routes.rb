Rails.application.routes.draw do

  root 'static_pages#home'

  get     'sudoku'    => 'sudoku#show'
  get     'sudoku/reset'    => 'sudoku#reset'
  get 'sudoku/options/:row/:col' => 'sudoku#options', as: :show_options
  match 'sudoku/:number/add' => 'sudoku#add', via: [:get,:post], as: :add_number
  get     'login'     => 'sessions#new'
  post    'login'     => 'sessions#create'
  delete  'logout'    => 'sessions#destroy'

  resources :users

end
