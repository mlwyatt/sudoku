class AddIndexToValues < ActiveRecord::Migration
  def change
    add_index :cells, :value
  end
end
