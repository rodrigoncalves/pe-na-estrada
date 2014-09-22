class AccidentsController < ApplicationController

  def index
  	@accidents = Accident.all
  end

  def import
		Accident.import(params[:file])
		redirect_to accident_path, notice: "Dados de acidentes importados com sucesso!"
	end

end