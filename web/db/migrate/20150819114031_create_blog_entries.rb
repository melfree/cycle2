class CreateBlogEntries < ActiveRecord::Migration
  def change
    create_table :blog_entries do |t|
      t.string :title
      t.text :content
      t.string :photo

      t.timestamps null: false
    end
  end
end
