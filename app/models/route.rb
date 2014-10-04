class Route < ActiveRecord::Base

	validates_presence_of :origin , message: "Por favor, preencher esse campo"
	validates_presence_of :destination, message: "Por favor, preencher esse campo"

    geocoded_by :address
 	after_validation :geocode
end
