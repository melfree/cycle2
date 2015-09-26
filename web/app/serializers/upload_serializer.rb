class UserSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :photo_url, :height, :width, :location, :tags, :lat, :long, :time
end