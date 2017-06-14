class CreateCells < ActiveRecord::Migration
  def change
    create_table :cells do |t|
      t.integer :board_id
      t.integer :value
      t.integer :row
      t.integer :column
      t.integer :region
      t.string :notes
      t.timestamps null: false
    end
    add_index :cells, :board_id
  end
end
