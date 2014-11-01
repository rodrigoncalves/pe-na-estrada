#-*- encoding : utf-8 -*-

class RoutesController < ApplicationController

  def index
    @route = Route.new
  end

  def trace_route
    @route = Route.new(origin_params)
    @origin_informed_by_user = @route.origin
    @destination_informed_by_user = @route.destination


    @latitude = Accident.get_accidents_latitude
    @longitude = Accident.get_accidents_longitude
    @br = Accident.get_accidents_br

    gon.latitude = @latitude
    gon.longitude = @longitude
    gon.br = @br

    render :index
  end

  def origin_params
    params.require(:route).permit(:origin, :destination)
  end


end
