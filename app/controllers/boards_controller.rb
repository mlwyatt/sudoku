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
    # debugger
    @row = params[:row]
    @col = params[:col]
    @cell = @board.cells[@row.to_i][@col.to_i]
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

  def take_notes
    @board.cells.each_with_index do |row,row_i|
      row.each_with_index do |col,col_i|
        notes = (1..9).to_a
        if col.is_a?(Array) || col == 0
          notes -= @board.cells.map{|i| i[col_i].is_a?(Array) ? 0 : i[col_i]}
          notes -= row.map{|i| i.is_a?(Array) ? 0 : i}
          r_region = row_i / 3
          c_region = col_i / 3
          3.times do |i|
            3.times do |j|
              next if 3 * r_region + i == row_i && 3 * c_region + j == col_i
              next if @board.cells[3 * r_region + i][3 * c_region + j].is_a?(Array)
              notes -= [@board.cells[3 * r_region + i][3 * c_region + j]]
            end
          end
          @board.cells[row_i][col_i] = notes
        end
      end
    end
    @board.save
    render(partial: 'boards/partials/show', layout: false)
  end

  def clear_notes
    @board.cells.each_with_index do |row,row_i|
      row.each_with_index do |col,col_i|
        if col.is_a?(Array)
          @board.cells[row_i][col_i] = 0
        end
      end
    end
    @board.save
    render(partial: 'boards/partials/show', layout: false)
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
