class CommentsController < ApplicationController

  def index
    @comment = Comment.new
  end

  def create
    #Get the highway that will receive the comment
    @highway = Highway.find(params[:highway_id]) 

    @comment = Comment.new(comment_params)
    if @comment.save
      @comment.save
      redirect_to highway_path(@highway)
    end
      
  end

  def comment_params
    params.fetch(:comment, {} ).permit(:title, :text, :idBr)
  end

end
