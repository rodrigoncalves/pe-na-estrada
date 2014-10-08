require 'test_helper'

class HighwaysControllerTest < ActionController::TestCase

	def setup

		@highways_controller = HighwaysController.new

	end


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


# Beginning of tests for 'count_accidents_by_highway' method

	test "Tests if count_accidents_by_highway returns a Hash" do

		#If   count   is used with group, it returns a Hash whose keys represent the aggregated column
		assert_kind_of Hash, @highways_controller.count_accidents_by_highway, "This should be a Hash object."
		assert_equal 1, @highways_controller.count_accidents_by_highway['MyString'], "This  should be equal to 1"

	end

# End of tests for 'count_accidents_by_highway' method


# Beginning of tests for 'order_accidents_by_accidentsRate' method

	test "Tests if order_accidents_by_accidentsRate returns a 'ActiveRecord::Relation'" do

		assert_kind_of ActiveRecord::Relation, @highways_controller.order_accidents_by_accidentsRate, "This should be a 
		'ActiveRecord::Relation' object."

	end

# End of tests for 'order_accidents_by_accidentsRate' method


# Beginning of tests for 'show' method

	test "Tests if show return a Hash" do

		assert_kind_of Hash, @highways_controller.show, "This should be a Hash object."

	end

# End of tests for 'show' method




# Beginning of tests of 'check_highway_number' method

	
	test "'@check_highway_number' Should be null with a null argument" do

		assert_nil @highways_controller.check_highway_number(nil), "Method 'check_highway_number' should return null"

	end


	test "'@check_highway_number' Should be null with a empty argument" do

		assert_equal "", @highways_controller.check_highway_number(""), "Method 'check_highway_number' 
																		                                should return an empty string"

	end


	test "'@check_highway_number' Should return the number without the zero on left" do

		assert_equal "40", @highways_controller.check_highway_number("040"), "Method 'check_highway_number' 
																			                                   should return '40'"

	end


	test "'@check_highway_number' Should return the number without  a lot of zero on left" do

		assert_equal "20", @highways_controller.check_highway_number("0000000020"), "Method 'check_highway_number' 
																					                                       should return '20'"

	end


	test "'@check_highway_number' Should return the same number input" do

		assert_equal "41", @highways_controller.check_highway_number("41"), "Method 'check_highway_number' 
																			                                   should return '41'"

	end


	test "'@check_highway_number' Should return the same number input with 2 digits" do

		assert_equal "24", @highways_controller.check_highway_number("24"), "Method 'check_highway_number' 
																				                                should return '24'"

	end


	test "'@check_highway_number' Should return the same number input with 3 digits" do

		assert_equal "160", @highways_controller.check_highway_number("160"), "Method 'check_highway_number' 
																				                                  should return '160'"

	end


	test "'@check_highway_number' Should return blank  number input with many zeros" do

		assert_equal "", @highways_controller.check_highway_number("0000000000"), "Method 'check_highway_number' 
																				                                      should return blank"

	end


	test "'@check_highway_number' Should return the letters input with letters" do

		assert_equal "abcd", @highways_controller.check_highway_number("abcd"), "Method 'check_highway_number' 
																				                                    should return blank 'abcd'"

	end

	
	#The method check_highway_number can not remover zeros after number
	test "'@check_highway_number' Should return the all number input with zeros after number" do

		assert_equal "50", @highways_controller.check_highway_number("50"), "Method 'check_highway_number' 
																				                                should return blank '50'"

  end


# End of tests of 'check_highway_number' method


#Begining of tests of check_highway_exists

#Lucas

#End of tests of check_highway_exists

#Begining of tests of check_highway_number_length

#Lucas

#End of tests of check_highway_number_length



#Begining of tests of search_for_highway

	test "'@search_for_highway' Should be null the return  with a null argument" do#

		assert @highways_controller.search_for_highway(nil), "Method 'search_for_highway' should return null"

	end


	test "'@search_for_highway' Should be null the return  with a empty argument" do#

		assert @highways_controller.search_for_highway(""), "Method 'search_for_highway' 
																		                    should return an empty string"

	end


	test "'@search_for_highway' Should return  the number without the zero on left" do

		assert @highways_controller.search_for_highway("040"), "Method 'search_for_highway' 
																			                     should return '40'"

	end


	test "'@search_for_highway' Should return   the number without  a lot of zero on left" do

		assert @highways_controller.search_for_highway("0000000020"), "Method 'search_for_highway' 
																					                         should return '20'"

	end


	test "'@search_for_highway' Should return  the same number input" do

		assert  @highways_controller.search_for_highway("41"), "Method 'search_for_highway' 
																			                       should return '41'"

	end


	test "'@search_for_highway' Should return  the same number input with 2 digits" do

		assert @highways_controller.search_for_highway("24"), "Method 'search_for_highway' 
																				                  should return '24'"

	end


	test "'@search_for_highway' Should return  the same number input with 3 digits" do

		assert @highways_controller.search_for_highway("160"), "Method 'search_for_highway' 
																				                    should return '160'"

	end


	test "'@search_for_highway' Should return  blank  number input with many zeros" do#

		assert @highways_controller.search_for_highway("0000000000"), "Method 'search_for_highway' 
																				                          should return blank"

	end


	test "'@search_for_highway' Should return  the letters input with letters" do#

		assert @highways_controller.search_for_highway("abcd"), "Method 'search_for_highway' 
																				                    should return blank 'abcd'"

	end

	
	#The method search_for_highway can not remover zeros after number
	test "'@search_for_highway' Should return a ythe all number input with zeros after number" do

		assert @highways_controller.search_for_highway("50"), "Method 'search_for_highway' 
																				                  should return blank '50'"

	end


#End of tests of search_for_highway/


#Begining of tests of check_length_and_if_exists

	test "'@check_length_and_if_exists' Should be  return  false  with param not exists" do

		assert_equal false, @highways_controller.check_length_and_if_exists('111'), "Method 'search_for_highway' 
                                                                                should return 153"
	end


  test "'@check_length_and_if_exists' Should be false the return  with a null argument" do

    assert_not @highways_controller.check_length_and_if_exists(nil), "Method 'check_length_and_if_exists' 
                                                                      should return null"

  end


  test "'@check_length_and_if_exists' Should be false the return  with a empty argument" do

    assert_equal false, @highways_controller.check_length_and_if_exists(""), "Method 'check_length_and_if_exists' 
                                                                              should return an empty string"

  end


  test "'@check_length_and_if_exists' Should return  the letters input with letters" do

    assert_equal false, @highways_controller.check_length_and_if_exists("abcd"), "Method 
                                                                                 'check_length_and_if_exists'
                                                                                  should return blank 'abcd'"

  end


  test "'@check_length_and_if_exists' should be false with a param equal to highway with 4 caracters" do

    assert_not @highways_controller.check_length_and_if_exists("1234"), "'@check_length_and_if_exists' 
                                                                          should be false."

  end


  test "''@check_length_and_if_exists' should be true with a param equal to highway with '040'" do# 

    assert_not @highways_controller.check_length_and_if_exists("040"), "'@check_length_and_if_exists' 
                                                                        should be true."

  end

  
  test "'@check_length_and_if_exists' Should return  blank  number input with many zeros" do

    assert_not  @highways_controller.check_length_and_if_exists("0000000000"), "Method 'check_length_and_if_exists' 
                                                                                should return false"
  end


  test "'@check_length_and_if_exists' Should be null with a null argument" do#

    assert_not  @highways_controller.check_length_and_if_exists(nil), "Method 'check_length_and_if_exists' 
                                                                      should return null"

  end

 

  test "'@check_length_and_if_exists' Should be null with a empty argument" do#

    assert_not @highways_controller.check_length_and_if_exists(""), "Method 'check_length_and_if_exists' 
                                                                    should return an empty string"

  end


  test "'@check_length_and_if_exists' Should return the number without the zero on left" do#

    assert_not @highways_controller.check_length_and_if_exists("040"), "Method 'check_length_and_if_exists' 
                                                                        should return '40'"

  end


  test "'@check_length_and_if_exists' Should return the number without  a lot of zero on left" do#

    assert_not @highways_controller.check_length_and_if_exists("0000000020"), "Method 'check_length_and_if_exists' 
                                                                              should return '20'"

  end


  test "'@check_length_and_if_exists' Should return the same number input" do#

    assert_not @highways_controller.check_length_and_if_exists("41"), "Method 'check_length_and_if_exists' 
                                                                      should return '41'"

  end


  test "'@check_length_and_if_exists' Should return the same number input with 1 digit" do#

    assert_not @highways_controller.check_length_and_if_exists("3"), "Method 'check_length_and_if_exists' 
                                                                      should return '3'"
  end


  test "'@check_length_and_if_exists' Should return the same number input with 2 digits" do#

    assert_not @highways_controller.check_length_and_if_exists("24"), "Method 'check_length_and_if_exists' 
                                                                      should return '24'"
  end


  test "'@check_length_and_if_exists' Should return the same number input with 3 digits" do#

    assert_not @highways_controller.check_length_and_if_exists("160"), "Method 'check_length_and_if_exists' 
                                                                        should return '160'"

  end

  
  #The method '@check_length_and_if_exists'  can not remover zeros after number
  test "'@check_length_and_if_exists' Should return the all number input with zeros after number" do#

    assert_not @highways_controller.check_length_and_if_exists("50"), "Method 'check_length_and_if_exists' 
                                                                      should return blank '50'"

  end



#Tiago

#End of tests of setup_highway

  test "'@setup_highway' Should return nil whit param not existents" do#

    assert_nil @highways_controller.setup_highway(nil), "Method 'setup_highway' 
                                                            should return 'nil'"

  end


  test "'@setup_highway' Should be  return  false  with param not exists" do#

    assert @highways_controller.setup_highway('111'), "Method 'search_for_highway' 
                                                                                should return 153"
  end


  test "'@setup_highway' Should be false the return  with a null argument" do

    assert_not @highways_controller.setup_highway(nil), "Method 'setup_highway' 
                                                                      should return null"

  end


  test "'@setup_highway' Should be false the return  with a empty argument" do

    assert @highways_controller.setup_highway(""), "Method 'setup_highway' 
                                                                              should return an empty string"

  end


  test "'@setup_highway' Should return  the letters input with letters" do

    assert @highways_controller.setup_highway("abcd"), "Method 
                                                                                 'setup_highway'
                                                                                  should return blank 'abcd'"

  end


  test "'@setup_highway' should be false with a param equal to highway with 4 caracters" do

    assert @highways_controller.setup_highway("1234"), "'@setup_highway' 
                                                        should be false."

  end
#Beging of tests of setup_highway

#End of tests of check_length_and_if_exists

end