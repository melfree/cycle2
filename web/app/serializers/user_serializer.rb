class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :created_at, :user_token
  
  def user_token
    if scope and scope.id == object.id
      object.authentication_token
    else
      "FILTERED"
    end
  end
end