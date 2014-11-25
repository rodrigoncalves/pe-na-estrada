class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :title
      t.string :text
      t.references :highways,:null=>false
      t.timestamps
    end
  end
end
