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
      finished = finished && cells.where(value: i+1).size == sq_size # counts for 1-9 shows 9 times each
      break unless finished
      finished = finished && cells.where(row: i).order(:value).map(&:value) == (1..sq_size).to_a # each row is 1-9
      break unless finished
      finished = finished && cells.where(column: i).order(:value).map(&:value) == (1..sq_size).to_a # each col is 1-9
      break unless finished
      finished = finished && cells.where(region: i).order(:value).map(&:value) == (1..sq_size).to_a # each 3x3 has 1-9
    end
    return finished
  end

  def number_finished?(number = 0)
    return false if number.to_i == 0
    sq_size = self.sq_size
    finished = true
    finished &&= self.cells.where(value: number).size == sq_size
    return finished unless finished
    cells = self.cells
    sq_size.times do |i|
      break unless finished
      finished &&= cells.where(value: number, row: i).size == 1 # each row has number once
      break unless finished
      finished &&= cells.where(value: number, column: i).size == 1 # each col has number once
      break unless finished
      finished &&= cells.where(value: number, region: i).size == 1 # each 3x3 has number once
    end
    return finished
  end

  def number_bad?(number = 0)
    return false if number.to_i == 0
    sq_size = self.sq_size
    good = true
    good &&= self.cells.where(value: number).size <= sq_size
    return !good unless good
    cells = self.cells
    sq_size.times do |i|
      break unless good
      good &&= cells.where(value: number, row: i).size <= 1 # each row has number once
      break unless good
      good &&= cells.where(value: number, column: i).size <= 1 # each col has number once
      break unless good
      good &&= cells.where(value: number, region: i).size <= 1 # each 3x3 has number once
    end
    return !good
  end
end
