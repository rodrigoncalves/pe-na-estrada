class RemoveAccidentrateFromHighway < ActiveRecord::Migration
  def change
    remove_column :highways, :accidentRate, :string
  end
end
