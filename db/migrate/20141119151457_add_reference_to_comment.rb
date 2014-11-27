class AddReferenceToComment < ActiveRecord::Migration
  def change
    add_column :comments, :idBr, :string
  end
end
