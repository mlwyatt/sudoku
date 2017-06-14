class RemoveCellsColumnFromBoard < ActiveRecord::Migration
  def change
    remove_column :boards, :cells
  end
end
