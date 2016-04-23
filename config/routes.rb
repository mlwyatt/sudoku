Rails.application.routes.draw do

  root 'boards#index'

  get     'sudoku'    => 'sudoku#show'


  get   'signup' => 'users#new'
  get   'login'  => 'sessions#new'
  post  'login'  => 'sessions#create'
  get   'logout' => 'sessions#destroy'

  resources :users
  resources :boards do
    match 'color/:colored_number' => 'boards#color_number', via: :get, as: :color_number
    get   'reset'    => 'boards#reset'
    get   'options/:row/:col' => 'boards#options', as: :show_options
    match 'add/:number' => 'boards#add', via: [:get,:post], as: :add_number
    match 'notes/:notes/' => 'boards#save_notes', via: [:get,:post], as: :save_notes
  end
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:edit, :create, :new, :update]
end
