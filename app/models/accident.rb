class Accident < ActiveRecord::Base

	validates_presence_of :longitude
	validates_presence_of :latitude
	validates_presence_of :uf
	validates_presence_of :km
	validates_presence_of :br

	belongs_to :Highway

	def self.count_accidents

		group(:br).count

	end

=begin
	# Method used from parser
	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			Accident.create! row.to_hash
		end
	end
=end

end