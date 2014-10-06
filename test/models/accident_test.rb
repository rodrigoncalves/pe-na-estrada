require 'test_helper'

class AccidentTest < ActiveSupport::TestCase


	def setup
        @accident = Accident.new
    end

    test "test_accident_one" do 
        @accident = Accident.new 
	 	@accident.latitude = accidents(:one).longitude
	 	@accident.longitude = accidents(:one).latitude
        @accident.uf = accidents(:one).uf
        @accident.km = accidents(:one).km
        @accident.br = accidents(:one).br
     assert @accident.save
    end

    test "test_presenceOf_Accidents" do
        @accident.latitude = accidents(:two).longitude
		@accident.longitude = accidents(:two).latitude
        @accident.uf = accidents(:two).uf
        @accident.km = accidents(:two).km
        @accident.br = accidents(:two).br
     assert_not @accident.save, "Cannot be null"
    end

	test "test_presenceOf_logitude" do
        @accident.latitude = accidents(:two).longitude
		@accident.longitude = accidents(:one).latitude
        @accident.uf = accidents(:one).uf
        @accident.km = accidents(:one).km
        @accident.br = accidents(:one).br
        assert_not @accident.save, "Cannot be null"
	end	

	test "test_presenceOf_latitude" do
        @accident.latitude = accidents(:one).longitude
		@accident.longitude = accidents(:two).latitude
        @accident.uf = accidents(:one).uf
        @accident.km = accidents(:one).km
        @accident.br = accidents(:one).br
        assert_not @accident.save, "Cannot be null"
	end

	test "test_presenceOf_uf" do
        @accident.latitude = accidents(:one).longitude
		@accident.longitude = accidents(:one).latitude
        @accident.uf = accidents(:two).uf
        @accident.km = accidents(:one).km
        @accident.br = accidents(:one).br
        assert_not @accident.save, "Cannot be null"
	end

	test "test_presenceOf_km" do
        @accident.latitude = accidents(:one).longitude
		@accident.longitude = accidents(:one).latitude
        @accident.uf = accidents(:one).uf
        @accident.km = accidents(:two).km
        @accident.br = accidents(:one).br
        assert_not @accident.save, "Cannot be null"
	end

	test "test_presenceOf_br" do
        @accident.latitude = accidents(:one).longitude
		@accident.longitude = accidents(:one).latitude
        @accident.uf = accidents(:one).uf
        @accident.km = accidents(:one).km
        @accident.br = accidents(:two).br
        assert_not @accident.save, "Cannot be null"
	end

end
