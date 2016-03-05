class CreateBoards < ActiveRecord::Migration
  def change
    create_table :boards do |t|
      t.string :hint
      t.string :answer
      t.timestamps null: false
    end
  end
end
