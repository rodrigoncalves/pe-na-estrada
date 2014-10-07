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


end
