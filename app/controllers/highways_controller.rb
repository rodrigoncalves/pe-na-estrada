class HighwaysController < ApplicationController

	def index

		@highways = Highway.all
		@highways2 = Highway.new
		
	end

	def show
	end

	def new
	end

	def create

		@highways = Highway.all

		@highways2 = Highway.new(origin_params)

		@highwayInformedByUser = @highways2.idBr

		render :index

  	end

	def import
		Highway.import(params[:file])
		redirect_to highways_path, notice: "Dados das rodovias importados com sucesso!"
	end

	def origin_params
  		
  		params.require(:highway).permit(:idBr)
  		
  	end
end