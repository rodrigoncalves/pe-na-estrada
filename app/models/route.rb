class Route < ActiveRecord::Base

	validates_presence_of :origin , message: "Origin field must be present."
	validates_presence_of :destination, message: "Destination field must be present."

    geocoded_by :address
 	after_validation :geocode
end
