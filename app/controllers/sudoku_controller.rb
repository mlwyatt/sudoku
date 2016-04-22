class SudokuController < ApplicationController
  before_action :force_trailing_slash#, only: :show

  def redirect_to_board
    redirect_to sudoku_url
  end










end
