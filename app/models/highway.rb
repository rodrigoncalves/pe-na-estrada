class Highway < ActiveRecord::Base

	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			Highway.create! row.to_hash
		end
	end
	

	def self.search(query)
  		where("idBr like ?", :query=> "%#{query}%")
  	end
end
