class BoardsController < ApplicationController
  before_action :logged_in_user
  before_action :force_trailing_slash, only: :show
  before_action :get_board, only: [:show,:add,:options,:color_number,:save_notes,:reset]

  def show
    unless @board.user == current_user
      flash[:danger] = 'That is not your sudoku board! Creating a new board.'
      redirect_to new_board_url
    end
  end

  def color_number
    @colored_number = params[:colored_number].to_i
    render(partial: 'boards/partials/show', layout: false)
  end

  def options
    # debugger
    @row = params[:row]
    @col = params[:col]
    render(partial: 'boards/partials/options', layout: false)
  end

  def new
    @board = current_user.boards.new
    reset_board
    redirect_to board_url(@board)
  end

  def add
    # debugger
    @board.cells[params[:row].to_i][params[:col].to_i] = params[:number].to_i
    @board.save
    render(partial: 'boards/partials/show', layout: false)
  end

  def save_notes
    # debugger
    @board.cells[params[:row].to_i][params[:col].to_i] = params[:notes].split(',').map(&:to_i)
    @board.save
    render(partial: 'boards/partials/show', layout: false)
  end

  def get_board
    # debugger
    @board = Board.find(params[:id] || params[:board_id])
  end

  def reset
    reset_board
    render(partial: 'boards/partials/show', layout: false)
  end

  private

  def reset_board
    @board.cells = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]
    @board.save
  end

  def board_params
    params.require(:board)
  end
end
