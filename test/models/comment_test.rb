require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  	def setup
		@comment = Comment.new
	end

	test "test_comment" do
		@comment.idBr = comments(:one).idBr
		@comment.title = comments(:one).title
		@comment.text = comments(:one).text
		assert @comment.save, "Cannot be null"
	end

	test "test_presenceOf_comments" do
		@comment.idBr = comments(:two).idBr
		@comment.title = comments(:two).title
		@comment.text = comments(:two).text
		assert_not @comment.save, "Cannot be null"
	end

	test "test_presenceOf_idBr" do
		@comment.idBr = comments(:two).idBr
		@comment.title = comments(:one).title
		@comment.text = comments(:one).text
		assert_not @comment.save, "Cannot be null"
	end

	test "test_presenceOf_title" do
		@comment.idBr = comments(:one).idBr
		@comment.title = comments(:two).title
		@comment.text = comments(:one).text
		assert_not @comment.save, "Cannot be null"
	end

	test "test_presenceOf_text" do
		@comment.idBr = comments(:one).idBr
		@comment.title = comments(:one).title
		@comment.text = comments(:two).text
		assert_not @comment.save, "Cannot be null"
	end

	test "Checking if idBr is empty" do
		@comment.idBr = comments(:three).idBr
		@comment.title = comments(:one).title
		@comment.text = comments(:one).text
		assert_not @comment.save, "Cannot be invalid"
	end

	test "Checking if title is empty" do
		@comment.idBr = comments(:one).idBr
		@comment.title = comments(:three).title
		@comment.text = comments(:one).text
		assert_not @comment.save, "Cannot be invalid"
	end

	test "Checking if text is empty" do
		@comment.idBr = comments(:one).idBr
		@comment.title = comments(:one).title
		@comment.text = comments(:three).text
		assert_not @comment.save, "Cannot be invalid"
	end

end
