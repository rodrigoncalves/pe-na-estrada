class CommentsController < ApplicationController
	def index
    @comment = Comment.new
  end

  def create

    @comment = Comment.new(origin_params)
    @title = @comment.title
    @text = @comment.text
    @id_highway = @comment.idBr
    if(@comment.save)
      render :new
    end
  end

  def show
    @comments = Comment.all
  end

  def new
    @comment = Comment.new
    redirect_to comments_path(@id_highway)
  end

  def origin_params
    params.require(:comment).permit(:title, :text, :idBr)
  end

end
