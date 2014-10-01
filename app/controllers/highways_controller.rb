class HighwaysController < ApplicationController

	def index

		@highways = Highway.all

	end

	def create

		@highways = Highway.all

		@highway_informed_by_user = check_highway_number(params[:highway_search])

		render :index

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

  	# Check if the user typed a '0' on highway number first character
  	def check_highway_number (highway_number)

  		if highway_number.at(0) == "0"

  			highway_number = highway_number.from(1)

  		else
  			# Nothing to do
  		end

  		return highway_number

  	end

	def import
		
		Highway.import(params[:file])
		redirect_to highways_path, notice: "Dados das rodovias importados com sucesso!"

	end

end