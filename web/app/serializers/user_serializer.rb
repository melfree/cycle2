class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :token, :created_at,
  
  def token
    object.authentication_token
  end
  
end