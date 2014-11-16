#-*- encoding : utf-8 -*-

class RoutesController < ApplicationController

  def index
    @route = Route.new
  end

  def trace_route
    @route = Route.new(origin_params)
    @origin_informed_by_user = @route.origin
    @destination_informed_by_user = @route.destination

    get_accidents_data_to_sinalize

    render :index
  end

  def get_accidents_data_to_sinalize

    latitude = Accident.get_accidents_latitude
    longitude = Accident.get_accidents_longitude
    br = Accident.get_accidents_br

    remove_unusable_coordinates latitude, longitude, br
  end

  def remove_unusable_coordinates latitude, longitude, br
    # Arrays to store the usables coordinates and highways
    latitudeUsable = [];
    longitudeUsable = [];
    highways = [];

    i = 0; #Count to get the latitudes from database
    j = 0; #Get the latitude, longitude e br usables
  
    while i < latitude.length

      if latitude[i].blank? == false
        latitudeUsable[j] = latitude[i]
        longitudeUsable[j] = longitude[i]
        highways[j] = br[i]
        j = j + 1
      end

      i = i + 1
    end

    send_accidents_data_to_js latitudeUsable, longitudeUsable, highways
  end

  def send_accidents_data_to_js latitude, longitude, br
    gon.latitude = latitude
    gon.longitude = longitude
    gon.br = br
  end

  def origin_params
    params.require(:route).permit(:origin, :destination)
  end

end
