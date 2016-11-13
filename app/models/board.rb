class Board < ActiveRecord::Base
  belongs_to :user
  serialize :cells, Array

  def region(big_cell) # 0-8
    # 0 | 1 | 2
    # 3 | 4 | 5
    # 6 | 7 | 8
    # returns [] of length 9 with values in given region
    return_cells = []
    cells = self.cells
    row = (big_cell / 3) * 3 # big_cell/3 *3
                             # 0 | 0 | 0
                             # 3 | 3 | 3
                             # 6 | 6 | 6
    col = (big_cell % 3) * 3 # big_cell%3 *3
                             # 0 | 3 | 6
                             # 0 | 3 | 6
                             # 0 | 3 | 6
    3.times do |i|
      return_cells << cells[row + i][col]
      return_cells << cells[row + i][col + 1]
      return_cells << cells[row + i][col + 2]
    end
    return return_cells.flatten
  end

  def finished?
    finished = true
    9.times do |i| # counts for 1-9 shows 9 times each
      break unless finished
      finished = finished && self.cells.flatten(1).count(i+1) == 9
    end
    return finished unless finished
    9.times do |i| # each row is 1-9
      break unless finished
      finished = finished && self.cells[i].sort == (1..9).to_a
    end
    return finished unless finished
    9.times do |i| # each col is 1-9
      break unless finished
      finished = finished && self.cells.map{|row| row[i]}.sort == (1..9).to_a
    end
    return finished unless finished
    9.times do |i| # each 3x3 has 1-9
      break unless finished
      finished = finished && self.region(i).sort == (1..9).to_a
    end
    return finished
  end

  def number_finished?(number)
    finished = true
    finished = finished && self.cells.flatten(1).count(number) == 9
    return finished unless finished
    9.times do |i| # each row has number once
      break unless finished
      finished = finished && self.cells[i].count(number) == 1
    end
    return finished unless finished
    9.times do |i| # each col has number once
      break unless finished
      finished = finished && self.cells.map{|row| row[i]}.count(number) == 1
    end
    return finished unless finished
    9.times do |i| # each 3x3 has number once
      break unless finished
      finished = finished && self.region(i).count(number) == 1
    end
    return finished
  end
end
