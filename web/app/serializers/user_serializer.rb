class UserSerializer < ActiveModel::Serializer
  attributes :id, :email
  
  has_many :uploads
  has_many :favorites
  has_many :purchases  
end