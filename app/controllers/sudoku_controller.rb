class SudokuController < ApplicationController
  before_action :force_trailing_slash#, only: :show
  before_action :set_board, only: :show
  before_action :get_board, only: [:add,:options,:color_number,:save_notes]

  def redirect_to_board
    redirect_to sudoku_url
  end










end
