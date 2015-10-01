class UploadSerializer < ActiveModel::Serializer
  attributes :message, :id, :user_id, :photo_url, :height, :width, :location, :tags, :lat, :long, :time, :current_user_purchased, :current_user_favorited, :thumb_width, :thumb_height, :thumb_photo_url
  has_one :user
  
  BASE_URL = 'http://localhost:3000'
  MISSING = "MISSING PHOTO URL"
  MISSING_THUMB = "MISSING THUMB PHOTO URL"
  
  def current_user_purchased
    if scope
      o = Purchase.where(user_id: scope.id, upload_id: object.id).take
      return o.created_at if o
    end
    nil
  end
  
  def current_user_favorited
    if scope
      o = Favorite.where(user_id: scope.id, upload_id: object.id).take
      return o.created_at if o
    end
    nil
  end
  
  # Regular photo url.
  def photo_url
    if object.photo_url
      BASE_URL +  object.photo_url
    else
      MISSING
    end
  end
  
  # Thumb version of photo is a pre-computed standardized version of the original photo, set at 200x200.
  def thumb_photo_url
    if object.photo_url(:thumb)
      BASE_URL  +  object.photo_url(:thumb)
    else
      MISSING_THUMB
    end
  end
  
  def thumb_width; thumb_height; end
  def thumb_height
    PhotoUploader::THUMB_SIZE
  end
end