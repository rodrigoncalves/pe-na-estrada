class HighwaysController < ApplicationController

	def index

		@highways = Highway.all
		@highways2 = Highway.new

	end

	def new
		@highway = Highway.new
	end

	def create

		@highways = Highway.all

		@highways2 = Highway.new(origin_params)

		@highwayInformedByUser = checkHighwayNumber(@highways2.idBr)

		render :index

  	end

  	# Check if the user typed a '0' on highway number first character
  	def checkHighwayNumber (highwayNumber)

  		if highwayNumber.at(0) == "0"

  			highwayNumber = highwayNumber.from(1)

  		else
  			# Nothing to do
  		end

  		return highwayNumber

  	end

	def import
		Highway.import(params[:file])
		redirect_to highways_path, notice: "Dados das rodovias importados com sucesso!"
	end

	def origin_params
  		
  		params.require(:highway).permit(:idBr)
  		
  	end
end