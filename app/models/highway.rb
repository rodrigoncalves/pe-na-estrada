class Highway < ActiveRecord::Base

	validates_presence_of :idBr

	def self.import file
		CSV.foreach(file.path, headers: true) do |row|
			Highway.create! row.to_hash
		end
	end

	def self.search_for_highway id_to_search
  		where("idBr LIKE ?", "%#{id_to_search}%")
  	end
  	
end
