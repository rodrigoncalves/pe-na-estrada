require 'test_helper'

class RouteTest < ActiveSupport::TestCase
  
  	#fixtures :routes

    test "should not save route without origin" do
      @route = Route.new
      @route.origin = routes(:two).origin
      @route.destination = routes(:one).destination
  	  assert !@route.save, "Por favor, preencher esse campo"
  	end

  	test "should not save route without destination" do
  	  @route = Route.new
  	  @route.origin = routes(:one).origin
  	  @route.destination = routes(:two).destination
  	  assert !@route.save, "Por favor, preencher esse campo"
  	end

    test "should save route with data" do
      @route = Route.new
      @route.origin = routes(:one).origin
      @route.destination = routes(:one).destination
      assert @route.save
    end
  end