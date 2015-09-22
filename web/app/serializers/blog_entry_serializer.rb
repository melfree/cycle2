class BlogEntrySerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :photo
end