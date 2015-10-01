class FavoriteSerializer < ActiveModel::Serializer
  has_one :upload
end