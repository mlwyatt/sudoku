class Board < ActiveRecord::Base
  belongs_to :user
  serialize :cells, Array
end
