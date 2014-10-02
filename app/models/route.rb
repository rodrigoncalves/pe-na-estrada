class Route < ActiveRecord::Base

	validates_presence_of :origin
	validates_presence_of :destination

    geocoded_by :address
 	after_validation :geocode
end
