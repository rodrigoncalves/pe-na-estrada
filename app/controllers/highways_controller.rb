class HighwaysController < ApplicationController

	def index

            @search_highway_form_result = params[:highway_search]

            @param_exists = check_highway_exists (@search_highway_form_result)

		if @search_highway_form_result
		    @highway = Highway.search_for_highway(check_highway_number(@search_highway_form_result))
		else
		    @highway = nil
		end

	end

	# Count the number of highways registered on DB
  	def count_number_of_highways
  		
  		@highways = Highway.all
  		number_of_highways = 0

  		@highways.each do |h|
  			number_of_highways = number_of_highways + 1
  		end	

  		return number_of_highways

  	end

      def check_highway_exists (highway_to_check)

            if Highway.exists?(['idBr LIKE ?', "%#{highway_to_check}%"])
                return true
            else
                return false
            end

      end

  	# Check if the user typed a '0' on highway number first character
  	def check_highway_number (highway_number)

  		if highway_number.at(0) == "0"

  			highway_number = highway_number.from(1)

  		else
  			# Nothing to do
  		end

  		return highway_number

  	end

end