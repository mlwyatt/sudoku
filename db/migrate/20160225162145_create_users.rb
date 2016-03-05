class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :password_digest
      t.string :remember_token
      t.datetime :last_active
      t.boolean :status
      t.string :remember_digest
      t.boolean :admin
      t.string :activation_digest
      t.boolean :activated
      t.datetime :activated_at

      t.timestamps null: false
    end
  end
end
