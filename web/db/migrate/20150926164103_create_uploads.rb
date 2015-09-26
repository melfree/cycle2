class CreateUploads < ActiveRecord::Migration
  def change
    create_table :uploads do |t|
      t.string :photo
      t.float :long
      t.float :lat
      t.text :tags
      t.datetime :time
      t.integer :width
      t.integer :height
      t.integer :copyright
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
