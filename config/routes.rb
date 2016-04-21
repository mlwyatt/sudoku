Rails.application.routes.draw do

  root 'sudoku#redirect_to_board'

  get     'sudoku'    => 'sudoku#show'
  get     'sudoku/reset'    => 'sudoku#reset'
  get 'sudoku/options/:row/:col' => 'sudoku#options', as: :show_options
  match 'sudoku/:number/add' => 'sudoku#add', via: [:get,:post], as: :add_number
  match 'sudoku/:colored_number/color' => 'sudoku#color_number', via: :get, as: :color_number
  match 'sudoku/:notes/notes' => 'sudoku#save_notes', via: [:get,:post], as: :save_notes
  get     'login'     => 'sessions#new'
  post    'login'     => 'sessions#create'

  resource :boards
end
