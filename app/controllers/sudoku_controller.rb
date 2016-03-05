class SudokuController < ApplicationController
  before_action :force_trailing_slash
  before_action :set_board, only: :show
  before_action :get_board, only: [:add,:options]

  def options
    # debugger
    session[:row] = params[:row]
    session[:col] = params[:col]
    render(partial: 'sudoku/partials/options', layout: false)
  end

  def add
    # debugger
    @board[session[:row].to_i][session[:col].to_i] = params[:number].to_i
    render(partial: 'sudoku/partials/show', layout: false)
  end

  def get_board
    @board = session[:board]
    # @board = [[],[],[],[],[],[],[],[],[]]
    # @board = params[:board]
  end

  def show
    session[:board] = @board
  end

  def reset
    reset_board
    render(partial: 'sudoku/partials/show', layout: false)
    # session[:reset] = 0
  end

  def set_board
    @board = session[:board]
    reset_board if @board.nil?
  end

  def reset_board
    @board = [
        [nil,nil,nil,nil,nil,nil,nil,nil,nil],
        [nil,nil,nil,nil,nil,nil,nil,nil,nil],
        [nil,nil,nil,nil,nil,nil,nil,nil,nil],
        [nil,nil,nil,nil,nil,nil,nil,nil,nil],
        [nil,nil,nil,nil,nil,nil,nil,nil,nil],
        [nil,nil,nil,nil,nil,nil,nil,nil,nil],
        [nil,nil,nil,nil,nil,nil,nil,nil,nil],
        [nil,nil,nil,nil,nil,nil,nil,nil,nil],
        [nil,nil,nil,nil,nil,nil,nil,nil,nil]
    ]
    session[:board] = @board
  end

  def board_params
    params.require(:board)
  end
end
