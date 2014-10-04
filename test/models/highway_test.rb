require 'test_helper'

class HighwayTest < ActiveSupport::TestCase

	def setup
		@highway = Highway.all
	end

	test "Test if are at least one highway registered on DB" do

		assert_not_nil Highway.first, "Object registered on DB cannot be null"
		assert_instance_of Highway, Highway.first, "Object on DB not correspond to it's expected class"

	end

	test "Test if all idBr's registered is not blank" do

		@highway.each do |highway|
 
			assert_not highway.idBr.blank?, "idBr  cannot be blank!"

		end

	end

	test "Test if the idBr has at least 3 caracters" do

		#assert_equal 

	end

end
