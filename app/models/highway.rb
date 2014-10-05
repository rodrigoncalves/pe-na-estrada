class Highway < ActiveRecord::Base

	validates_presence_of :idBr
	validates_length_of :idBr, within: 2..3, too_short: 'The idBr is too short. Must be in the range 2..3.', too_long:'The idBr is too long. Must be in the range 2..3.'

	# Change this if the type of mileage change on schema
	validates_numericality_of :mileage, greater_than_or_equal_to: 1, allow_nil: true, message: 'Mileage cannot be shorter than 1' 

	def self.import file
		CSV.foreach(file.path, headers: true) do |row|
			Highway.create! row.to_hash
		end
	end

	def self.search_for_highway id_to_search
  		where("idBr LIKE ?", "%#{id_to_search}%")
  	end
  	
end
