class DeleteBoardTable < ActiveRecord::Migration
  def change
    drop_table :boards
  end
end
