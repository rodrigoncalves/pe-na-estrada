class AddRankingpositionToHighway < ActiveRecord::Migration
  def change
    add_column :highways, :rankingPosition, :integer
  end
end
