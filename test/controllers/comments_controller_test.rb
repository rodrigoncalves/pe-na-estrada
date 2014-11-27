require 'test_helper'

class CommentsControllerTest < ActionController::TestCase

  def index
    @comment = Comment.new
    @comments = Comment.all
    @highways = Highway.all
  end 

  test "route" do
    assert_recognizes({:controller => "highways", :action => "show", id:"40"}, {:path => "highways/40", :method => :get})
  end


  test "Not should comment nil" do 
    {:action=>"index", :comment=>{:idBr=>comments(:two).idBr, :title=>comments(:two).title, :text=>comments(:two).text}, :controller=>"highways/"}
    assert_nil assigns(:comment)
  end

  test "'@comment' should be null with a null argument" do

    {:action=>"index", :comment_search=>nil, :controller=>"highways/"}

    assert_nil @comment, "This should be null"
  end
  

=begin
  
  test "'@comment' should redirect to highways_path" do
    @highway = Highway.new;
    @highway.idBr = 10;
    @highway.save

    post :create, {'highway_id' => 1}
    assert_redirected_to highway_path
  end
=end
end