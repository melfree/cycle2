class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at, :user_token
  
  def user_token
    object.authentication_token
  end
end