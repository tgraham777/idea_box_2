require 'rails_helper'

RSpec.describe Api::V1::IdeasController, type: :controller do
  describe "GET #index" do
    it "can show all ideas" do
      Idea.create(title: "First idea", body: "is awesome")
      Idea.create(title: "Second idea", body: "is lame")

      get :index, format: :json

      ideas = JSON.parse(response.body, symbolize_names: true)

      expect(response).to have_http_status(:success)
      expect(ideas.count).to eq(2)
      expect(ideas.first[:title]).to eq("First idea")
      expect(ideas.first[:body]).to eq("is awesome")
    end
  end

  describe "POST #create" do
    it "can create new idea" do
      expect { post :create, idea: {title: "Third idea", body: "is okay"} }.to change(Idea, :count).by(1)
    end
  end

  describe "PUT #update" do
    it "can update existing idea" do
      idea = Idea.create(title: "First idea", body: "is awesome")

      put :update, id: idea.id, idea: {title: "Revised idea", body: "is even better"}, format: :json
      idea.reload
      
      expect(idea['title']).to eq("Revised idea")
      expect(idea['body']).to eq("is even better")
    end
  end

  describe "DELETE #destroy" do
    it "can delete existing idea" do
      idea = Idea.create(title: "First idea", body: "is awesome")

      delete :destroy, id: idea.id, format: :json

      expect(Idea.all.count).to eq(0)
    end
  end
end
