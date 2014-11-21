class CommentsController < ApplicationController
	def index
    @comment = Comment.new
  end


  def show
    @comments = Comment.all
  end

end
