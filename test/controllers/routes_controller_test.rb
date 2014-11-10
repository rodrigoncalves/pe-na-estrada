require 'test_helper'

class RoutesControllerTest < ActionController::TestCase

	test "route" do
	assert_recognizes({:controller => "routes", :action => "index"}, {:path => "routes", :method => :get})
	assert_recognizes({:controller => "routes", :action => "create"}, {:path => "routes", :method => :post})

	end 


	test "should trace route" do 

		post :trace_route, :route => { :origin => routes(:one).origin, :destination => routes(:one).destination}
		assert_not_nil assigns(:route)
	end

	test "test index" do
		get :index
        assert_response :success
        assert_not_nil assigns(:route)
    end

	test "get accidents longitude at position 4 of the array" do
		assert_equal Accident.get_accidents_longitude[4], accidents(:five).longitude, "test if get accidents longitude at position 4 of the array"
	end

	test "get accidents longitude at position 1 of the array" do
		assert_equal Accident.get_accidents_longitude[1], accidents(:four).longitude, "test if get accidents longitude at position 1 of the array"
	end
 	
 	test "get accidents latitude at position 4 of the array" do
		assert_equal Accident.get_accidents_latitude[4], accidents(:five).latitude, "test if get accidents latidude at position 4 of the array"
	end

	test "get accidents latitude at position 1 of the array" do
		assert_equal Accident.get_accidents_latitude[1], accidents(:four).latitude, "test if get accidents latitude at position 1 of the array"
	end


end
