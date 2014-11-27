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

=begin
  
rescue Exception => e
  
end
  def count_comments_
    @comment = Comment.count_comments
  end
=end
  def comment_params
    params.fetch(:comment, {}).permit(:title, :text, :idBr)
  end



end
