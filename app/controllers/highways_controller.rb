class HighwaysController < ApplicationController

	

	def new
		@highway = Highway.new
	end

	def create
		
		@highway = Highway.new(origin_params)

		#@test_pesquisa = @highway.search

		@highwayInformedByUser = origin_params

		render :new
	
  	end

	def index
		@highways = Highway.all
	end

	def import
		Highway.import(params[:file])
		redirect_to highways_path, notice: "Dados das rodovias importados com sucesso!"
	end
	def origin_params
  		params.require(:highway).permit(:idBr)
  	end

end