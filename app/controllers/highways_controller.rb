class HighwaysController < ApplicationController

	def index
		@highways = Highway.all
	end

	def show
	end

	def new
	end

	def import
		Highway.import(params[:file])
		redirect_to highways_path, notice: "Dados das rodovias importados com sucesso!"
	end

end