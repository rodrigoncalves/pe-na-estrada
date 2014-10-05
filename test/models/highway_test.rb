require 'test_helper'

class HighwayTest < ActiveSupport::TestCase

	def setup
		@highways = Highway.all
		@highway = Highway.new
	end

	# Based on fixtures
	test "Test if are at least one highway is registered on DB" do

		assert_instance_of Highway, Highway.first, "Object on DB not correspond to it's expected class"
		assert_not_nil Highway.first, "Object registered on DB cannot be null"

	end

	# Based on fixtures
	test "Should be equal to 2 the quantity of Highway objects on DB" do

		assert_equal 3, Highway.count, "Registered data does not match the actual quantity registered"

	end

	# Based on fixtures
	test "Test if all idBr's registered is present" do

		@highways.each do |highway|
 
			assert highway.idBr.present?, "idBr  must be present!"

		end

	end

	# Test validates_uniqueness_of :idBr
	test "Should not save duplicated data on DB" do

		@highway.idBr = "121"
		@highway.mileage = "1500"

		assert_not @highway.save, "This idBr already exists. Cannot save duplicated idBr"

	end

	# Begin tests to 'validates_presence_of :idBr
	
	test "Should save a valid Highway object" do

		@highway.idBr = "131"
		@highway.mileage = 1234

		assert @highway.save, "Could not save this object"

	end

	test "Should not save a empty object" do

		assert_not @highway.save, "Cannot save an empty object"

	end

	test "Should not save without an idBr" do 
		
		@highway.mileage = 1200

		assert_not @highway.save, "Cannot save without an idBr"
	end

	test "Should not save with a empty idBr" do

		@highway.idBr = ""

		assert_not @highway.save, "Cannot save with an empty idBr"

	end

	test "Should not save with a null idBr" do

		@highway.idBr = nil

		assert_not @highway.save, "Cannot save with a null idBr"

	end
	# End of tests to 'validates_presence_of :idBr'

	# Begin tests to 'validates_length_of :idBr'
	test "Should save an Highway object with an idBr in the range 2..3 of length. Test the maximum edge." do

		@highway.idBr = "111"

		assert @highway.save, "Cannot save an idBr out of range 2..3"

	end

	test "Should save an Highway object with an idBr in the range 2..3 of length. Test the minimum edge" do

		@highway.idBr = "50"

		assert @highway.save, "Cannot save an idBr out of range 2..3"

	end

	test "Should not save an Highway object wiith an idBr out of range 2..3 of length. Test a shorter than 2 idBr length" do 

		@highway.idBr = "1"

		assert_not @highway.save, "Too short idBr. Cannot save an idBr with a length shorter than 2 caracters"

	end

	test "Should not save an Highway object wiith an idBr out of range 2..3 of length. Test a greater than 2 idBr length" do 

		@highway.idBr = "2222"

		assert_not @highway.save, "Too long idBr. Cannot save an idBr with a length greater than 3 caracters"

	end
	#End of tests to 'validates_length_of :idBr'

	# Begin tests to 'validates_numericality_of :mileage'
	test "Should save an Highway object with a mileage greater than 1" do

		@highway.idBr = "111"
		@highway.mileage = 200

		assert @highway.save, "Cannot save a mileage shorter than 1"

	end

	test "Should save an Highway object with a mileage equal to 1" do

		@highway.idBr = "111"
		@highway.mileage = 1

		assert @highway.save, "Cannot save a mileage shorter than 1"

	end

	test "Should not save an Highway object with a mileage equal to 0" do

		@highway.idBr = "111"
		@highway.mileage = 0

		assert_not @highway.save, "Cannot save a mileage shorter than 1"

	end

	test "Should not save an Highway object with a negative mileage" do

		@highway.idBr = "111"
		@highway.mileage = -1

		assert_not @highway.save, "Cannot save a mileage shorter than 1"

	end

	test "Should save an Highway object with a null mileage" do

		@highway.idBr = "111"
		@highway.mileage = nil

		assert @highway.save, "Could not save a null mileage"

	end
	# End of tests to 'validates_numericality_of :mileage'

	test "Test the 'search_for_highway' method" do

		@highway_search_result = Highway.search_for_highway "121"

		assert_kind_of ActiveRecord::Relation, @highway_search_result, "Not a instance of ActiveRecord::Relation returned from the method 'search_for_highway'"

		@highway_search_result.each do |highway|

			assert_instance_of Highway, highway, "Result from search is not a Highway object"
			assert_not_nil highway, "Result from search is a null Highway object"
			assert_instance_of String, highway.idBr, "The Highway object idBr from search is not a String"
			assert_instance_of Fixnum, highway.mileage, "The Highway object mileage from search is not a Fixnum"
			assert_equal highway.idBr, "121", "The idBr got is not the same that was registered"
			assert_equal highway.mileage, 1500, "The mileage got is not the same that was registered"

		end

	end

end
