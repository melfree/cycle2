class User::RegistrationsController < Devise::SessionsController
  respond_to :json, :html
end