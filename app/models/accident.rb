class Accident < ActiveRecord::Base

	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			Accident.create! row.to_hash
		end
	end


end