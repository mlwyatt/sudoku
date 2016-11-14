class Board < ActiveRecord::Base
  belongs_to :user
  serialize :cells, Array

  def region_single(big_cell) # 0-8
    # 0 | 1 | 2
    # 3 | 4 | 5
    # 6 | 7 | 8
    # returns [] of length 9 with values in given region
    return_cells = []
    cells = self.cells
    row = (big_cell / size) * size # big_cell/3 *3
                             # 0 | 0 | 0
                             # 3 | 3 | 3
                             # 6 | 6 | 6
    col = (big_cell % size) * size # big_cell%3 *3
                             # 0 | 3 | 6
                             # 0 | 3 | 6
                             # 0 | 3 | 6
    size.times do |i|
      size.times do |j|
      return_cells << cells[row + i][col + j]
      end
    end
    return return_cells
    end

  def region_double(row,col)
    return region_single(size * (row / size) + (col / size))
  end

  def finished?
    sq_size = size * size
    finished = true
    sq_size.times do |i| # counts for 1-9 shows 9 times each
      break unless finished
      finished = finished && self.cells.flatten(1).count(i+1) == sq_size
    end
    return finished unless finished
    sq_size.times do |i| # each row is 1-9
      break unless finished
      finished = finished && self.cells[i].sort == (1..sq_size).to_a
    end
    return finished unless finished
    sq_size.times do |i| # each col is 1-9
      break unless finished
      finished = finished && self.cells.map{|row| row[i]}.sort == (1..sq_size).to_a
    end
    return finished unless finished
    sq_size.times do |i| # each 3x3 has 1-9
      break unless finished
      finished = finished && self.region_single(i).sort == (1..sq_size).to_a
    end
    return finished
  end

  def number_finished?(number)
    sq_size = size * size
    finished = true
    finished = finished && self.cells.flatten(1).count(number) == sq_size
    return finished unless finished
    sq_size.times do |i| # each row has number once
      break unless finished
      finished = finished && self.cells[i].count(number) == 1
    end
    return finished unless finished
    sq_size.times do |i| # each col has number once
      break unless finished
      finished = finished && self.cells.map{|row| row[i]}.count(number) == 1
    end
    return finished unless finished
    sq_size.times do |i| # each 3x3 has number once
      break unless finished
      finished = finished && self.region_single(i).count(number) == 1
    end
    return finished
  end
end
