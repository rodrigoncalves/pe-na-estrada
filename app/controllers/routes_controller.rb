#-*- encoding : utf-8 -*-

class RoutesController < ApplicationController

	def new
  		@route = Route.new
	end

	def create
		
		@route = Route.new(origin_params)

		@test_origem = @route.origin
		@test_destino = @route.destination

		render :new
	
  	end

  	def show
  		@route = Route.find_by_id(params[:id].to_i)
  	end

  	def index

  		puts ">>>>>>>>>>>>>>>>"
  		
  		puts = " >>>> AQUI #{@test_origem}"

  		puts ">>>>>>>>>>>>"
  		
		@routes = Route.all
	end
  	
	def origin_params
  		params.require(:route).permit(:origin, :destination)
  	end

end

