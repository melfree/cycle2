Rails.application.routes.draw do
  devise_for :users, :controllers => {sessions: 'user/sessions', registrations: 'user/registrations', passwords: 'user/passwords' }

  # See how all your routes lay out with "rake routes".

  # Uploads routes
  resources :uploads
  resources :favorites, except: [:update, :edit, :new]
  resources :purchases, except: [:update, :edit, :new, :destroy]
  resources :four_square, only: [:index]
  
  get 'home' => 'home#index', as: :home
  
  # You can have the root of your site routed with "root"
  root 'uploads#index'
  
  

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase
end
