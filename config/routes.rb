Rails.application.routes.draw do
  root 'api/v1/ideas#index'

  namespace :api do
    namespace :v1 do
      resources :ideas
    end
  end
end
