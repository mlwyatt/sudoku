class AddSizeToBoard < ActiveRecord::Migration
  def change
    add_column :boards, :size, :integer, default: 3, null: false
  end
end
