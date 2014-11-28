class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :title
      t.string :text
      t.string :idBr

      t.timestamps
    end
  end
end
