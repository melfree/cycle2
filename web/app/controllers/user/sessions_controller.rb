class User::SessionsController < Devise::SessionsController
  respond_to :json
end