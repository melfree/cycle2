Rails.application.routes.draw do
  devise_for :users, :controllers => {sessions: 'user/sessions', registrations: 'user/registrations', passwords: 'user/passwords' }

  # See how all your routes lay out with "rake routes".

  # Uploads routes
  resources :uploads
  resources :favorites, except: [:update, :edit, :new, :create]
  resources :purchases, except: [:update, :edit, :new, :destroy, :create]
  get 'myphotos' => 'uploads#myphotos'
  post 'favorites/:id' => 'favorites#create'
  post 'purchases/:id' => 'purchases#create'
  
  get 'foursquare' => 'four_square#index'
  get 'foursquare/:id' => 'four_square#show'
  
  get 'home' => 'home#index', as: :home
  get 'account' => 'uploads#account'
  
  get 'explore' => 'uploads#explore'
  get 'locations' =>  'uploads#locations'
  get 'events' => 'uploads#events'
  
  # Get the favorite/purchase history of a particular upload
  get 'favoritelog/:id' => 'favorites#log'
  get 'purchaselog/:id' => 'purchases#log'
  
  # Get the logs of this user's purchases
  get 'favoritelog' => 'favorites#userlog'
  get 'purchaselog' => 'purchases#userlog'
  
  # The reverse; get the log of purchases others have made of this user
  get 'revfavoritelog' => 'favorites#revuserlog'
  get 'revpurchaselog' => 'purchases#revuserlog'
  
  
  # You can have the root of your site routed with "root"
  root 'uploads#index'
  
  

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase
end
