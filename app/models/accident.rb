class Accident < ActiveRecord::Base

	belongs_to :Highway
	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			Accident.create! row.to_hash
		end
	end

	def self.search_for_accident(br_to_search)
		where("br LIKE ?", "%#{br_to_search}%")
	end

end