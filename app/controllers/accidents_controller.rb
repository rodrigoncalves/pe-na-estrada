class AccidentsController < ApplicationController

	def index
		@highways = Highway.all
		@accident = Accident.group(:br).count
		@accidents = Accident.all.order(:br)

	end

	def new

	end

	#Method used for parser
 	def import
		Accident.import(params[:file])
		redirect_to accidents_path, notice: "Dados acidentes importados com sucesso!"
	end

end