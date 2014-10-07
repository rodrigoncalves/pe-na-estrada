#-*- encoding : utf-8 -*-

class RoutesController < ApplicationController


  	def index
		
		@route = Route.new

	end

  	def trace_route

  		@route = Route.new(origin_params)

		@origin_informed_by_user = @route.origin
		@destination_informed_by_user = @route.destination

		render :index
  	end

   	
	def origin_params
  		
  		params.require(:route).permit(:origin, :destination)
  		
  	end

end

