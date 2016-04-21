class BoardsController < ApplicationController
  before_action :force_trailing_slash#, only: :show
  before_action :set_board, only: :show
  before_action :get_board, only: [:add,:options,:color_number,:save_notes]

  def show
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
    @board = Board.new
    reset_board
  end

  def add
    # debugger
    @board.data[params[:row].to_i][params[:col].to_i] = params[:number].to_i
    @board.save
    render(partial: 'boards/partials/show', layout: false)
  end

  def save_notes
    # debugger
    @board.data[params[:row].to_i][params[:col].to_i] = params[:notes].split(',').map(&:to_i)
    @board.save
    render(partial: 'boards/partials/show', layout: false)
  end

  def get_board
    @board = Board.find(params[:id])
  end



  def set_board
    # debugger
    @board = session[:board]
    reset_board if @board.nil?
  end

  def reset
    reset_board
    render(partial: 'boards/partials/show', layout: false)
  end

  private

  def reset_board
    @board.data = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]]
    @board.save
  end

  def board_params
    params.require(:board)
  end
end
