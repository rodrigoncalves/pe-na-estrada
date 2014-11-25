require 'test_helper'

class HighwaysControllerTest < ActionController::TestCase

  QUANTITY_OF_FIXTURES = 3

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
  test "'@highway' should be null with a null argument" do

    get :index, {'highway_search' => nil}

    assert_nil @highway, "This should be null"

  end
  #End of tests for '@highway' instance variable

# End of tests for action 'index'

# Beginning of tests for 'count_accidents_by_highway' method
  test "Tests if count_accidents_by_highway returns the expected Hash" do

    #If count is used with group, it returns a Hash whose keys represent the aggregated column
    assert_kind_of Hash, @highways_controller.count_accidents_by_highway, "This should be a Hash object."
    assert_equal 1, @highways_controller.count_accidents_by_highway['MyString'], "This  should be equal to 1"
    assert_equal 1, @highways_controller.count_accidents_by_highway[nil], "This  should be equal to 1"
    assert_equal 1, @highways_controller.count_accidents_by_highway[''], "This  should be equal to 1"
    assert_equal 2, @highways_controller.count_accidents_by_highway['70'], "This  should be equal to 2"

  end
# End of tests for 'count_accidents_by_highway' method


# Beginning of tests of 'check_highway_number' method
  test "'check_highway_number' should be null with a null argument" do

    assert_nil @highways_controller.check_highway_number(nil), "Method 'check_highway_number' should return null"

  end

  test "'check_highway_number' should be empty with a empty argument" do

    assert_equal "", @highways_controller.check_highway_number(""), "Method 'check_highway_number' should return an empty string"

  end

  test "'check_highway_number' Should return the number without the zero on left" do

    assert_equal "40", @highways_controller.check_highway_number("040"), "Method 'check_highway_number' should return '40'"

  end

  test "'check_highway_number' Should return the number without  a lot of zero on left" do

    assert_equal "20", @highways_controller.check_highway_number("0000000020"), "Method 'check_highway_number' should return '20'"

  end

  test "'check_highway_number' Should return the same number input" do

    assert_equal "41", @highways_controller.check_highway_number("41"), "Method 'check_highway_number' should return '41'"

  end

  test "'check_highway_number' Should return the same number input with 2 digits" do

    assert_equal "24", @highways_controller.check_highway_number("24"), "Method 'check_highway_number' should return '24'"

  end

  test "'check_highway_number' Should return the same number input with 3 digits" do

    assert_equal "160", @highways_controller.check_highway_number("160"), "Method 'check_highway_number' should return '160'"

  end

  test "'check_highway_number' Should return the number with 3 digits without the zeros" do

    assert_equal "160", @highways_controller.check_highway_number("000000000160"), "Method 'check_highway_number' should return '160'"

  end

  test "'check_highway_number' Should return blank number input with many zeros" do

    assert_equal "", @highways_controller.check_highway_number("0000000000"), "Method 'check_highway_number' should return am empty String"

  end

  test "'check_highway_number' Should return the letters that was input" do

    assert_equal "abcd", @highways_controller.check_highway_number("abcd"), "Method 'check_highway_number' should return 'abcd'"

  end

  #The method check_highway_number should not remove zeros on right
  test "'check_highway_number' Should return the all number input with zeros after the number" do

    assert_equal "50", @highways_controller.check_highway_number("50"), "Method 'check_highway_number' should return '50'"

  end

  test "'check_highway_number' Should return the number with the zeros on right" do

    assert_equal "50000000", @highways_controller.check_highway_number("50000000"), "Method 'check_highway_number' should return '50000000'"

  end
# End of tests of 'check_highway_number' method


#Beginning of tests of 'check_highway_number_length' method

  test "Should return false with a nil argument" do

      assert_not @highways_controller.check_highway_number_length(nil), "This should return false with an null argument"

  end

  test "Should return false with an empty argument" do

      assert_not @highways_controller.check_highway_number_length(""), "This should return false with an empty argument"

  end

  test "Should return false with an argument which length is greater than MAX_HIGHWAY_NUMBER_LENGTH" do

      assert_not @highways_controller.check_highway_number_length("4000"), "Method 'check_highway_number_length' should return false"

  end

  test "Should return false with an argument (letters chain) which length is greater than MAX_HIGHWAY_NUMBER_LENGTH" do

      assert_not @highways_controller.check_highway_number_length("abcde"), "Method 'check_highway_number_length' should return false"

  end

  test "Should return true with an argument which length is lower than MAX_HIGHWAY_NUMBER_LENGTH by two caracters" do

      assert @highways_controller.check_highway_number_length("3"), "Method 'check_highway_number_length' should return true"

  end

  test "Should return true with an argument which length is lower than MAX_HIGHWAY_NUMBER_LENGTH by one caracter" do

      assert @highways_controller.check_highway_number_length("35"), "Method 'check_highway_number_length' should return true"

  end

  test "Should return true with an argument (letters chain) which length is lower than MAX_HIGHWAY_NUMBER_LENGTH" do

      assert @highways_controller.check_highway_number_length("ab"), "Method 'check_highway_number_length' should return true"

  end

  test "Should return true with an argument which length is equal to MAX_HIGHWAY_NUMBER_LENGTH" do

      assert @highways_controller.check_highway_number_length("116"), "Method 'check_highway_number_length' should return true"

  end

  test "Should return true with an argument (letters chain) which length is equal to MAX_HIGHWAY_NUMBER_LENGTH" do

      assert @highways_controller.check_highway_number_length("abc"), "Method 'check_highway_number_length' should return true"

  end
#End of tests of 'check_highway_number_length' method


#Begining of tests of 'check_highway_exists' method
  test "'check_highway_exists' should return false with a null argument" do

      assert_not @highways_controller.check_highway_exists(nil), "This should return false with a null argument"

  end

  test "'check_highway_exists' should return false with an empty argument" do

      assert_not @highways_controller.check_highway_exists(""), "This should return false with an empty argument"

  end

  test "Should return true with an argument that exists on DB (first fixture)" do

      assert @highways_controller.check_highway_exists("121"),"check_highway_exists should return true."

  end

  test "Should return true with an argument that exists on DB (second fixture)" do

      assert @highways_controller.check_highway_exists("987"),"check_highway_exists should return true."

  end

  test "Should return true with an argument that is part of an existing register on DB" do

      assert @highways_controller.check_highway_exists("1"),"check_highway_exists should return true."
      assert @highways_controller.check_highway_exists("2"),"check_highway_exists should return true."
      assert @highways_controller.check_highway_exists("9"),"check_highway_exists should return true."
      assert @highways_controller.check_highway_exists("8"),"check_highway_exists should return true."
      assert @highways_controller.check_highway_exists("7"),"check_highway_exists should return true."
      assert @highways_controller.check_highway_exists("12"),"check_highway_exists should return true."
      assert @highways_controller.check_highway_exists("21"),"check_highway_exists should return true."
      assert @highways_controller.check_highway_exists("98"),"check_highway_exists should return true."
      assert @highways_controller.check_highway_exists("87"),"check_highway_exists should return true."

  end

  test "Should return false with an argument that doesn't exists on DB" do

      assert_not @highways_controller.check_highway_exists("356"),"check_highway_exists should return false."
      assert_not @highways_controller.check_highway_exists("0"),"check_highway_exists should return false."
      assert_not @highways_controller.check_highway_exists("abcd"),"check_highway_exists should return false."
      assert_not @highways_controller.check_highway_exists("60"),"check_highway_exists should return false."

  end
#End of tests of 'check_highway_exists' method


#Beginning of tests of 'search_for_highway' method
  test "'search_for_highway' Should return all highways registered with a null argument" do

    search_for_highway_result = @highways_controller.search_for_highway(nil)

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal QUANTITY_OF_FIXTURES, search_for_highway_result.count, "This quantity should be equal to 2"

  end

  test "'search_for_highway' Should return all highways registered with an empty argument" do

    search_for_highway_result = @highways_controller.search_for_highway("")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal QUANTITY_OF_FIXTURES, search_for_highway_result.count, "This quantity should be equal to 2"

  end

  test "'search_for_highway' should return only one record on relation equal to the first fixture" do

    search_for_highway_result = @highways_controller.search_for_highway("121")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal 1, search_for_highway_result.count, "This quantity should be equal to 1"
    assert_kind_of Highway, search_for_highway_result.first, "This should be an Highway object"
    assert_not_nil search_for_highway_result.first, "This object should not be null"
    assert_equal "121", search_for_highway_result.first.idBr, "This idBr should be equal to the first fixture idBr"
    assert_equal 1500, search_for_highway_result.first.mileage, "This mileage should be equal to the first fixture mileage"

  end

  test "'search_for_highway' should return only one record on relation equal to the second fixture" do

    search_for_highway_result = @highways_controller.search_for_highway("987")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal 1, search_for_highway_result.count, "This quantity should be equal to 1"
    assert_kind_of Highway, search_for_highway_result.first, "This should be an Highway object"
    assert_not_nil search_for_highway_result.first, "This object should not be null"
    assert_equal "987", search_for_highway_result.first.idBr, "This idBr should be equal to the first fixture idBr"
    assert_equal 2570, search_for_highway_result.first.mileage, "This mileage should be equal to the first fixture mileage"

  end

  test "'search_for_highway' should return only one record on relation equal to the third fixture" do

    search_for_highway_result = @highways_controller.search_for_highway("128")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal 1, search_for_highway_result.count, "This quantity should be equal to 1"
    assert_kind_of Highway, search_for_highway_result.first, "This should be an Highway object"
    assert_not_nil search_for_highway_result.first, "This object should not be null"
    assert_equal "128", search_for_highway_result.first.idBr, "This idBr should be equal to the first fixture idBr"
    assert_equal 5678, search_for_highway_result.first.mileage, "This mileage should be equal to the first fixture mileage"

  end

  test "'search_for_highway' should return only two records on relation because of first and third fixtures that contains '12'" do

    search_for_highway_result = @highways_controller.search_for_highway("12")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal 2, search_for_highway_result.count, "This quantity should be equal to 2"

    cont = 0
    search_for_highway_result.each do |highway|
      assert_kind_of Highway, highway, "This should be an Highway object"
      assert_not_nil highway, "This object should not be null"
      cont = cont + 1

      if cont == 1
        assert_equal highways(:one).idBr, highway.idBr, "This idBr should be equal to the first fixture idBr"
      else
        assert_equal highways(:three).idBr, highway.idBr, "This idBr should be equal to the third fixture idBr"
      end

    end

  end

  test "'search_for_highway' should return only two records on relation because of first and third fixtures that contains '1'" do

    search_for_highway_result = @highways_controller.search_for_highway("1")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal 2, search_for_highway_result.count, "This quantity should be equal to 2"

    cont = 0
    search_for_highway_result.each do |highway|
      assert_kind_of Highway, highway, "This should be an Highway object"
      assert_not_nil highway, "This object should not be null"
      cont = cont + 1

      if cont == 1
        assert_equal highways(:one).idBr, highway.idBr, "This idBr should be equal to the first fixture idBr"
      else
        assert_equal highways(:three).idBr, highway.idBr, "This idBr should be equal to the third fixture idBr"
      end

    end

  end

  test "'search_for_highway' should return only two records on relation because of second and third fixtures that contains '8'" do

    search_for_highway_result = @highways_controller.search_for_highway("8")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal 2, search_for_highway_result.count, "This quantity should be equal to 2"

    cont = 0
    search_for_highway_result.each do |highway|
      assert_kind_of Highway, highway, "This should be an Highway object"
      assert_not_nil highway, "This object should not be null"
      cont = cont + 1

      if cont == 1
        assert_equal highways(:three).idBr, highway.idBr, "This idBr should be equal to the third fixture idBr"
      else
        assert_equal highways(:two).idBr, highway.idBr, "This idBr should be equal to the two fixture idBr"
      end

    end

  end

  test "'search_for_highway' should clean the 0's on left and return only two records on relation due to second and third fixtures" do

    search_for_highway_result = @highways_controller.search_for_highway("00000000008")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert_not search_for_highway_result.empty?, "This relation should not be empty"
    assert_equal 2, search_for_highway_result.count, "This quantity should be equal to 2"

    cont = 0
    search_for_highway_result.each do |highway|
      assert_kind_of Highway, highway, "This should be an Highway object"
      assert_not_nil highway, "This object should not be null"
      cont = cont + 1

      if cont == 1
        assert_equal highways(:three).idBr, highway.idBr, "This idBr should be equal to the third fixture idBr"
      else
        assert_equal highways(:two).idBr, highway.idBr, "This idBr should be equal to the two fixture idBr"
      end

    end

  end

  test "'search_for_highway' should return an empty relation with an unregistered highway as argument" do

    search_for_highway_result = @highways_controller.search_for_highway("365")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert search_for_highway_result.empty?, "This relation should be empty"

  end

  test "'search_for_highway' should return an empty relation with an invalid highway as argument" do

    search_for_highway_result = @highways_controller.search_for_highway("abcd")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert search_for_highway_result.empty?, "This relation should be empty"

  end

  test "'search_for_highway' should return an empty relation with an invalid highway as argument even with 0's on left" do

    search_for_highway_result = @highways_controller.search_for_highway("000000abcd")

    assert_kind_of ActiveRecord::Relation, search_for_highway_result, "This should be a Relation"
    assert search_for_highway_result.empty?, "This relation should be empty"

  end
# End of tests of 'search_for_highway' method


# Beginning of tests of check_length_and_if_exists
  test "'check_length_and_if_exists' Should return false with a null argument" do

    assert_not @highways_controller.check_length_and_if_exists(nil), "Method 'check_length_and_if_exists' should return false"

  end


  test "'check_length_and_if_exists' Should return false with an empty argument" do

    assert_not @highways_controller.check_length_and_if_exists(""), "Method 'check_length_and_if_exists' should return false"

  end

  test "'check_length_and_if_exists' Should return false with an unregistered highway as param" do

    assert_not @highways_controller.check_length_and_if_exists("111"), "Method 'check_length_and_if_exists' should return false"

  end

  test "'check_length_and_if_exists' Should return false with letters as argument" do

    assert_not @highways_controller.check_length_and_if_exists("abc"), "Method 'check_length_and_if_exists' should return false"

  end

  test "'check_length_and_if_exists' should return false with a highway with 4 caracters length as argument" do

    assert_not @highways_controller.check_length_and_if_exists("1234"), "'check_length_and_if_exists' should return false."

  end

  test "''check_length_and_if_exists' should return false with a highway with a valid length but unregistered as argument" do

    assert_not @highways_controller.check_length_and_if_exists("040"), "'check_length_and_if_exists' should return false."

  end

  test "''check_length_and_if_exists' should return false with a highway with an invalid length and unregistered as argument" do

    assert_not @highways_controller.check_length_and_if_exists("012340"), "'check_length_and_if_exists' should return false."

  end

  test "'check_length_and_if_exists' Should return false due to the invalid length" do

    assert_not  @highways_controller.check_length_and_if_exists("0000000000"), "Method 'check_length_and_if_exists' should return false"

  end

  test "'check_length_and_if_exists' Should return false due to the unregistered highway even with a valid length" do

    assert_not @highways_controller.check_length_and_if_exists("000"), "Method 'check_length_and_if_exists' should return false"

  end

  test "'check_length_and_if_exists' Should return true due to the registered highway as argument" do

    assert @highways_controller.check_length_and_if_exists("121"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("987"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("128"), "Method 'check_length_and_if_exists' should return true"

  end

  test "'check_length_and_if_exists' Should return true due to the registered highways as argument even with 0's on left" do

    assert @highways_controller.check_length_and_if_exists("0000000128"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("0000000987"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("0000000121"), "Method 'check_length_and_if_exists' should return true"

  end

  test "'check_length_and_if_exists' Should return true due to parts of registered highways as argument" do

    assert @highways_controller.check_length_and_if_exists("1"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("2"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("9"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("8"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("7"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("12"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("21"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("98"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("87"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("28"), "Method 'check_length_and_if_exists' should return true"

  end

  test "'check_length_and_if_exists' Should return true due to parts of registered highways as argument even with 0's on left" do

    assert @highways_controller.check_length_and_if_exists("000001"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("000002"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("000009"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("000008"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("000007"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("0000012"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("0000021"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("0000098"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("0000087"), "Method 'check_length_and_if_exists' should return true"
    assert @highways_controller.check_length_and_if_exists("0000028"), "Method 'check_length_and_if_exists' should return true"

  end
# End of tests of 'check_length_and_if_exists' method


# Beginning od tests of 'setup' method
  test "'setup_highway' Should return null with a null argument" do

    assert_nil @highways_controller.setup_highway(nil), "Method 'setup_highway' should return 'nil'"

  end

  test "'setup_highway' Should return all highways registered" do

    setup_highway_result = @highways_controller.setup_highway("")

    assert_kind_of ActiveRecord::Relation, setup_highway_result, "This should be an ActiveRecord::Relation object"
    assert_equal QUANTITY_OF_FIXTURES, setup_highway_result.count, "This relation should contain QUANTITY_OF_FIXTURES records"
    assert_not setup_highway_result.empty?, "This relation should not be empty"
    assert_equal QUANTITY_OF_FIXTURES, setup_highway_result.count, "This quantity should be equal to QUANTITY_OF_FIXTURES"

  end

  test "'setup_highway' Should return the first first fixture" do

    setup_highway_result = @highways_controller.setup_highway("121")

    assert_kind_of ActiveRecord::Relation, setup_highway_result, "This should be an ActiveRecord::Relation object"
    assert_not setup_highway_result.empty?, "This relation should not be empty"
    assert_equal 1, setup_highway_result.count, "This relation should contain only one record"
    assert_equal highways(:one), setup_highway_result.first, "This relation should be equal to the first fixture"

  end

  test "'setup_highway' Should return the first second fixture" do

    setup_highway_result = @highways_controller.setup_highway("987")

    assert_kind_of ActiveRecord::Relation, setup_highway_result, "This should be an ActiveRecord::Relation object"
    assert_not setup_highway_result.empty?, "This relation should not be empty"
    assert_equal 1, setup_highway_result.count, "This relation should contain only one record"
    assert_equal highways(:two), setup_highway_result.first, "This relation should be equal to the second fixture"

  end

  test "'setup_highway' Should return the first third fixture" do

    setup_highway_result = @highways_controller.setup_highway("128")

    assert_kind_of ActiveRecord::Relation, setup_highway_result, "This should be an ActiveRecord::Relation object"
    assert_not setup_highway_result.empty?, "This relation should not be empty"
    assert_equal 1, setup_highway_result.count, "This relation should contain only one record"
    assert_equal highways(:three), setup_highway_result.first, "This relation should be equal to the third fixture"

  end

  test "'setup_highway' Should return the first third fixture even with 0's on left" do

    setup_highway_result = @highways_controller.setup_highway("00000000128")

    assert_kind_of ActiveRecord::Relation, setup_highway_result, "This should be an ActiveRecord::Relation object"
    assert_not setup_highway_result.empty?, "This relation should not be empty"
    assert_equal 1, setup_highway_result.count, "This relation should contain only one record"
    assert_equal highways(:three), setup_highway_result.first, "This relation should be equal to the third fixture"

  end

  test "'setup_highway' Should return an empty relation for an unregistered highway as param" do

    setup_highway_result = @highways_controller.setup_highway("456")

    assert_kind_of ActiveRecord::Relation, setup_highway_result, "This should be an ActiveRecord::Relation object"
    assert setup_highway_result.empty?, "This relation should be empty"

  end

  test "'setup_highway' Should return an empty relation for an invalid highway as param" do

    setup_highway_result = @highways_controller.setup_highway("asdf")

    assert_kind_of ActiveRecord::Relation, setup_highway_result, "This should be an ActiveRecord::Relation object"
    assert setup_highway_result.empty?, "This relation should be empty"

  end
# End of tests of 'setup_highway' method


# Beginning of tests of the 'calculate_accidentesRatePercent' method
  test "calculate_accidentsRate should return the rate with correct params" do

    assert_equal 0.1, @highways_controller.calculate_accidentsRate(2, 20), "This should return 0.1 as accidents rate"

  end

  test "calculate_accidentsRate should return zero the rate with params blank" do

    assert_equal 0.0, @highways_controller.calculate_accidentsRate(2, " "), "This should return 0.0 as accidents rate"

  end

  test "calculate_accidentsRate should return zero the rate with correct params" do

    assert_equal 0.0, @highways_controller.calculate_accidentsRate(0, 20), "This should return 0.0 as accidents rate"

  end

 test "calculate_accidentsRatePercent should return the rate with correct params" do

    assert_equal 10, @highways_controller.calculate_accidentsRatePercent(2, 20), "This should return 10 as accidents rate"

  end

  test "calculate_accidentsRatePercent should return zero the rate with accidents number zero" do

    assert_equal 0.0, @highways_controller.calculate_accidentsRatePercent(0, 20), "This should return 0.0 as accidents rate"

  end

  test "calculate_accidentsRatePercent should return zero the rate with params zero" do

    assert_equal 0.0, @highways_controller.calculate_accidentsRatePercent(0, 0), "This should return 0.0 as accidents rate"

  end
# End of the tests of the 'calculate_accidentesRatePercent' method


# Beginning of the tests of the action 'new'
  test "Tests if new return a Hash" do

    assert_kind_of Hash, @highways_controller.ranking_1, "This should be a Hash object."

  end

  test "Tests if the method new return the correct hash"  do

    @highway_hash = @highways_controller.ranking_1
    assert @highway_hash.has_key?("70"), "This Hash should contain a key equal to 70"
    assert @highway_hash.has_value?(2), "This Hash should contain a value equal to 2"

  end
# End of the tests of the action 'new'


# Beginning of the tests of the action 'show'
  test "Tests if the method show return the correct hash" do

    @highway_hash = @highways_controller.ranking_2
    assert @highway_hash.has_key?("70"), "This Hash should contain a key equal to 70"
    assert @highway_hash.has_value?(2), "This Hash should contain a value equal to 2"

  end
# End of the tests of the action 'show'

end