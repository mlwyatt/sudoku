class Board < ActiveRecord::Base
  belongs_to :user
  has_many :cells, dependent: :destroy

  accepts_nested_attributes_for :cells, allow_destroy: true

  def region_single(region) # 0-8
    return self.cells.where(region: region).map(&:value)
  end

  def region_double(row,col)
    return self.cells.where(row: row, column: col).map(&:value)
  end

  def sq_size
    return self.size * self.size
  end

  def copy_cells_to(id)
    board = Board.find(id)
    self.cells.each do |cell|
      ocell = board.cells.find_by(row: cell.row,column: cell.column)
      ocell.update_attributes!(value: cell.value,notes: cell.notes)
    end
  end

  def number_class(num,blue = false)
    klass = ''
    klass = 'blue'  if blue
    klass = 'red'   if self.number_bad?(num)
    klass = 'green' if self.number_finished?(num)
    return klass
  end

  def finished?
    sq_size = self.sq_size
    finished = true
    cells = self.cells
    sq_size.times do |i|
      break unless finished
      # finished &&= cells.where(value: i+1).size == sq_size # counts for 1-9 shows 9 times each
      finished &&= cells.find_by_sql("select `region`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i+1} GROUP BY `region`").count{|c| c.c_val == 1} == sq_size
      finished &&= cells.find_by_sql("select `row`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i+1} GROUP BY `row`").count{|c| c.c_val == 1} == sq_size
      finished &&= cells.find_by_sql("select `column`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i+1} GROUP BY `column`").count{|c| c.c_val == 1} == sq_size
    end
    return finished
  end

  def number_finished?(number = 0)
    return false if number.to_i == 0
    cells = self.cells
    sq_size = self.sq_size
    return (
      cells.find_by_sql("select `region`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{number} GROUP BY `region`").count{|c| c.c_val == 1} == sq_size &&
      cells.find_by_sql("select `row`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{number} GROUP BY `row`").count{|c| c.c_val == 1} == sq_size &&
      cells.find_by_sql("select `column`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{number} GROUP BY `column`").count{|c| c.c_val == 1} == sq_size
    )
  end

  # returns hash of value => bools
  # ex: {1 => true,2 => false,3 => false,4 => false,5 => false,6 => false,7 => false,8 => false,9 => false}
  #     1 is finished others are not
  def numbers_finished
    sq_size = self.sq_size
    finished = (1..sq_size).map{|i| [i,true]}.to_h
    cells = self.cells
    finished.each_key do |i|
      finished[i] &&= cells.find_by_sql("select `region`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i} GROUP BY `region`").count{|c| c.c_val == 1} == sq_size
      finished[i] &&= cells.find_by_sql("select `row`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i} GROUP BY `row`").count{|c| c.c_val == 1} == sq_size
      finished[i] &&= cells.find_by_sql("select `column`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i} GROUP BY `column`").count{|c| c.c_val == 1} == sq_size
    end
    return finished
  end

  def number_bad?(number=0)
    return false if number.to_i == 0
    cells = self.cells
    return !(
    cells.find_by_sql("select `region`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{number} GROUP BY `region`").count{|c| c.c_val>1} == 0 &&
      cells.find_by_sql("select `row`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{number} GROUP BY `row`").count{|c| c.c_val>1} == 0 &&
      cells.find_by_sql("select `column`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{number} GROUP BY `column`").count{|c| c.c_val>1} == 0
    )
  end

  def numbers_bad
    sq_size = self.sq_size
    good = (1..sq_size).map{|i| [i,true]}.to_h
    cells = self.cells
    good.each_key do |i|
      good[i] &&= cells.find_by_sql("select `region`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i} GROUP BY `region`").count{|c| c.c_val>1} == 0
      good[i] &&= cells.find_by_sql("select `row`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i} GROUP BY `row`").count{|c| c.c_val>1} == 0
      good[i] &&= cells.find_by_sql("select `column`,count(value) as 'c_val' from cells where board_id=#{self.id} and value=#{i} GROUP BY `column`").count{|c| c.c_val>1} == 0
    end
    return good.each{|i,b| good[i] =!b}
  end
end
