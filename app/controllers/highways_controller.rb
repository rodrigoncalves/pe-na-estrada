class HighwaysController < ApplicationController

      MAX_HIGHWAY_NUMBER_LENGTH = 3
      
    	def index

	        @highway_informed_by_user = params[:highway_search]

	        @highway_number_exists = check_length_and_if_exists (@highway_informed_by_user)

	   	@highway = setup_highway (@highway_informed_by_user)

	end

	# Set up the instance variable '@highway' on index with the result from 'search_for_highway' method
	def setup_highway highway

		if highway
		 	search_for_highway (highway)
		else
		 	return nil
		end

	end

	# Check the length of a highway informed and if it exists on DB
	def check_length_and_if_exists highway_to_check

		length_is_ok =  check_highway_number_length (highway_to_check)

		if length_is_ok
	         	check_highway_exists (highway_to_check)
	        else
	        		return false
	        end

	end

	# Search for a highway on DB
	def search_for_highway highway_to_search

		highway_cleaned = check_highway_number(highway_to_search)

		Highway.search_for_highway(highway_cleaned)

	end


      	# Check the length of the highway number informed
      	def check_highway_number_length highway_number
            
	        if !highway_number.blank?
	          
	              highway_number_length = highway_number.size

	              if  highway_number_length > MAX_HIGHWAY_NUMBER_LENGTH
	                   return false
	              else
	                   return true
	              end

	        else
	              return false
           	end

      	end

      	# Check if a highway exists on DB
      	def check_highway_exists highway_to_check

		if Highway.exists_highway(highway_to_check)
			return true
		else
			return false
		end

	end

  	# Ignore '0's on left on highway number
  	def check_highway_number highway_number

	        if !highway_number.blank?
	              
				i = 0

				while highway_number.at(i) == "0"

					highway_number = highway_number.from(i+1)

				end

				return highway_number

	        else
	   			return highway_number
	        end

	end

	def new
		
	end

	def count_accidents_by_highway

		@accident = Accident.count_accidents

	end


	def order_accidents_by_accidentsRate
		
		@highway = Highway.all_highways_by_accidentsRate

	end
	
	def calculate_accidentsRate accidents_number, mileage_highway

		if mileage_highway.blank?
			rate = 0.0
		else
			rate = accidents_number/mileage_highway.to_f
		end

		return rate
	end

	def find_highway_to_accident
		
		order_accidents_by_accidentsRate
		count_accidents_by_highway

		br_accident = nil
		count_accident = nil
		mileage_br = nil	

		@accident.each do |br, count|
		br_accident = br
			@highways.each do |h|
			mileage_br = h.mileage.to_s
				if h.idBr == br_accident
					h.accidentsRate = calculate_accidentsRate(count, mileage_br)
					h.save
				end
			end
		end
	end

	def show

		@highways = Highway.all
		find_highway_to_accident

	end

=begin
	# Method used for parser
	def import
		Highway.import(params[:file])
		redirect_to highways_path, notice: "Dados rodovias importados com sucesso!"
	end
=end

end