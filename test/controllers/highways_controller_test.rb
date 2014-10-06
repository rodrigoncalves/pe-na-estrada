require 'test_helper'

class HighwaysControllerTest < ActionController::TestCase

	test "Test if the variable '@highway_informed_by_user' receives the params from form" do
		
		get :index, {'highway_search' => "121"}

		assert_equal assigns(:highway_informed_by_user), "121", "This should be equal to '121'."

	end

	test "'@highway_number_exists' should be true with a param equal to the first registered highway" do

		get :index, {'highway_search' => "121"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to the second registered highway" do

		get :index, {'highway_search' => "987"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to 1" do

		get :index, {'highway_search' => "1"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be false with a param equal to a not registered highway" do

		get :index, {'highway_search' => "123"}

		assert_not assigns(:highway_number_exists), "@highway_number_exists should be false."

	end

	test "'@highway_number_exists' should be false with a param equal to highway with 4 caracters" do

		get :index, {'highway_search' => "1234"}

		assert_not assigns(:highway_number_exists), "@highway_number_exists should be false."

	end

	test "'@highway_number_exists' should be false with a param with equal to a chain of letters" do

		get :index, {'highway_search' => "asdf"}

		assert_not assigns(:highway_number_exists), "@highway_number_exists should be false."

	end

end
