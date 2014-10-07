require 'test_helper'

class RouteTest < ActiveSupport::TestCase

	def setup
		@route = Route.new
	end

	test "Should not save route without any data" do
		@route.origin = routes(:two).origin
		@route.destination = routes(:two).destination
		assert_not @route.save, "Should not saved because both fields are null."
	end

	test "Should not save route without origin" do
		@route.origin = routes(:two).origin
		@route.destination = routes(:one).destination
		assert_not @route.save, "Should not saved because the origin field is null."
	end

	test "Should not save route without destination" do
		@route.origin = routes(:one).origin
		@route.destination = routes(:two).destination
		assert_not @route.save, "Should not saved because the destination field is null."
	end

	test "Should not save route with empty destination" do
		@route.origin = routes(:one).origin
		@route.destination = routes(:three).destination
		assert_not @route.save, "Should not saved because the destination field is empty."
	end

	test "Should not save route with null origin and empty destination" do
		@route.origin = routes(:two).origin
		@route.destination = routes(:three).destination
		assert_not @route.save, "Should not saved because the origin field is null and the destination field is empty."
	end

	test "Should not save route with null origin" do
		@route.origin = routes(:three).origin
		@route.destination = routes(:one).destination
		assert_not @route.save, "Should not saved because the origin field is empty."
	end

	test "Should not save route with null origin and null destination" do
		@route.origin = routes(:three).origin
		@route.destination = routes(:two).destination
		assert_not @route.save, "Should not saved because the origin field is empty and the destination field is null."
	end

	test "Should not save route with empty origin and empty destination" do
		@route.origin = routes(:three).origin
		@route.destination = routes(:three).destination
		assert_not @route.save, "Should not saved because both fields are empty."
	end

	test "Should save route with data" do
		@route.origin = routes(:one).origin
		@route.destination = routes(:one).destination
		assert @route.save
	end

end