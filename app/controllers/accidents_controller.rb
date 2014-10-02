class AccidentsController < ApplicationController

	def index

		@accidents = Accident.all
	end

	def new
		
	end

 	def import
		Accident.import(params[:file])
		redirect_to accidents_path, notice: "Dados acidentes importados com sucesso!"
	end

end