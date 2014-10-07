require 'test_helper'

class HighwaysControllerTest < ActionController::TestCase

# Beginning of tests for action 'index'

    # Beginning of tests for '@highway_informed_by_user' instance variable
	test "Test if the variable '@highway_informed_by_user' receives the params from form (first fixture)" do
		
		get :index, {'highway_search' => highways(:one).idBr}

		assert_equal assigns(:highway_informed_by_user), highways(:one).idBr, "This should be equal to '121'."

	end

	test "Test if the variable '@highway_informed_by_user' receives the params from form (second fixture)" do
		
		get :index, {'highway_search' => highways(:two).idBr}

		assert_equal assigns(:highway_informed_by_user), highways(:two).idBr, "This should be equal to '987'."

	end

	test "Test if the variable '@highway_informed_by_user' receives an empty param" do
		
		get :index, {'highway_search' => ""}

		assert assigns(:highway_informed_by_user).empty?, "This should be empty."

	end

	test "Test if the variable '@highway_informed_by_user' receives a null param" do
		
		get :index, {'highway_search' => nil}

		assert_nil assigns(:highway_informed_by_user), "This should be null."

	end
    # End of test for '@highway_informed_by_user' variable

    # Beginning of tests of '@highway_number_exists' instance variable
	test "'@highway_number_exists' should be true with a param equal to the first registered highway" do

		get :index, {'highway_search' => highways(:one).idBr}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to the second registered highway" do

		get :index, {'highway_search' => highways(:two).idBr}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	# Tests with part of idBr's from fixtures
	test "'@highway_number_exists' should be true with a param equal to 1" do

		get :index, {'highway_search' => "1"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to 2" do

		get :index, {'highway_search' => "2"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end


	test "'@highway_number_exists' should be true with a param equal to 9" do

		get :index, {'highway_search' => "9"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to 8" do

		get :index, {'highway_search' => "8"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to 7" do

		get :index, {'highway_search' => "7"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to '12'" do

		get :index, {'highway_search' => "12"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to '21'" do

		get :index, {'highway_search' => "21"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to '98'" do

		get :index, {'highway_search' => "98"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end

	test "'@highway_number_exists' should be true with a param equal to '87'" do

		get :index, {'highway_search' => "87"}

		assert assigns(:highway_number_exists), "@highway_number_exists should be true."

	end
	# End of tests with part of idBr's from fixtures

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

	test "'@highway_number_exists' should be false with a param equal to a nil" do

		get :index, {'highway_search' => nil}

		assert_not assigns(:highway_number_exists), "@highway_number_exists should be false."

	end

    # End of tests for '@highway_number_exists' variable

    #Beginning of tests for '@highway' instance variable

    	#Faça os testes pra variavel @highway

    #End of tests for '@highway' instance variable

# End of tests for action 'index'

end