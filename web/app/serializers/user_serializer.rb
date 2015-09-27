class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at, :auth_token
  
  def auth_token
    resource.authentication_token
  end
end