class BoardsController < ApplicationController
  before_action :logged_in_user
  before_action :force_trailing_slash, only: [:show, :index]
  before_action :get_board, only: [:show,:add,:options,:color_number,:save_notes,:reset,:destroy,:take_notes,:clear_notes]

  def index
    @boards = current_user.boards
  end

  def destroy
    @board.delete
    redirect_to boards_url
  end

  def show
    unless @board.user == current_user
      flash[:danger] = 'That is not your sudoku board! Creating a new board.'
      redirect_to new_board_url
    end
  end

  def color_number
    @colored_number = params[:colored_number].to_i if params[:colored_number].to_i > 0
    render(partial: 'boards/partials/show', layout: false)
  end

  def options
    @row = params[:row]
    @col = params[:col]
    @cell = @board.cells.find_by(row: @row.to_i, column: @col.to_i)
    render(partial: 'boards/partials/options', layout: false)
  end

  def new
    @board = current_user.boards.create!(size: params[:size] || 3)
    reset_board
    redirect_to board_url(@board)
  end

  def add
    @board.cells.find_by(row: params[:row].to_i, column: params[:col].to_i).update_attributes!(value: params[:number].to_i, notes: nil)
    render(partial: 'boards/partials/show', layout: false)
  end

  def save_notes
    @board.cells.find_by(row: params[:row].to_i, column: params[:col].to_i).update_attributes!(value: 0, notes: params[:notes].split(',').map(&:to_i))
    render(partial: 'boards/partials/show', layout: false)
  end

  def get_board
    @board = Board.find(params[:id] || params[:board_id])
  end

  def take_notes
    cells = @board.cells
    cells.each do |cell|
      notes = (1..9).to_a
      if cell.value.to_i == 0
        notes -= cells.where(row: cell.row).map(&:value)
        notes -= cells.where(column: cell.column).map(&:value)
        notes -= cells.where(region: cell.region).map(&:value)
        cell.notes = notes
      end
    end
    @board.save!
    render(partial: 'boards/partials/show', layout: false)
  end

  def clear_notes
    @board.cells.update_all(notes: nil)
    render(partial: 'boards/partials/show', layout: false)
  end

  def reset
    reset_board
    render(partial: 'boards/partials/show', layout: false)
  end

  private

  def reset_board
    size = @board.size
    sq = size * size
    sq.times do |r|
      sq.times do |c|
        cell = @board.cells.find_or_create_by!(row: r, column: c, region: size*(r/size)+(c/size))
        cell.update_attributes!(value: 0, notes: nil)
      end
    end
  end

  def board_params
    params.require(:board)
  end
end
