class Api::V1::IdeasController < ApplicationController
  respond_to :json

  def index
    respond_with :api, :v1, Idea.all
  end

  def create
    idea =  Idea.create(idea_params)
    render json: idea, location: [:api, :v1, idea]
  end

  def update
    respond_with :api, :v1, Idea.update(params[:id], idea_params)
  end

  def destroy
    respond_with :api, :v1, Idea.destroy(params[:id])
  end

  private

  def idea_params
    params.require(:idea).permit(:title, :body, :quality)
  end
end
