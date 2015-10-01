class UserSerializer < ActiveModel::Serializer
  attributes :user_email, :user_token, :last_sign_in_at, :created_at
  
  def user_token
    if scope and scope.id == object.id
      object.authentication_token
    else
      "FILTERED"
    end
  end
  
end
