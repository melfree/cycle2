class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.integer :user_id
      t.integer :upload_id
      t.datetime :time

      t.timestamps null: false
    end
  end
end
