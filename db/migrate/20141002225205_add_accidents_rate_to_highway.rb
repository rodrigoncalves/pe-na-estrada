class AddAccidentsRateToHighway < ActiveRecord::Migration
  def change
    add_column :highways, :accidentsRate, :float
  end
end
