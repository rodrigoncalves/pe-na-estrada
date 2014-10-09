class AddAccidentsratepercentToHighway < ActiveRecord::Migration
  def change
    add_column :highways, :accidentsRatePercent, :float
  end
end
