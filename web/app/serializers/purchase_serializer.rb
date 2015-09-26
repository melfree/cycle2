class UserSerializer < ActiveModel::Serializer
  attributes :created_at, :updated_at, :time
  
  belongs_to :user
  belongs_to :upload 
end