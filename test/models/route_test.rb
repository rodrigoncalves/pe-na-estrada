require 'test_helper'

class RouteTest < ActiveSupport::TestCase

	def setup
		@route = Route.new
	end

	test "Should not save route without origin" do
		@route.origin = routes(:two).origin
		@route.destination = routes(:one).destination
		assert !@route.save, "Por favor, preencher esse campo"
	end

	test "Should not save route without destination" do
		@route.origin = routes(:one).origin
		@route.destination = routes(:two).destination
		assert !@route.save, "Por favor, preencher esse campo"
	end

	test "Should save route with data" do
		@route.origin = routes(:one).origin
		@route.destination = routes(:one).destination
		assert @route.save
	end

end