class CreateHighways < ActiveRecord::Migration
  def change
    create_table :highways do |t|
      t.string :idBr
      t.integer :mileage
      t.references :comments
      t.timestamps
    end
  end
end
