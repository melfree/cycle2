class UploadSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :photo_url, :height, :width, :location, :tags, :lat, :long, :time, :thumb_width, :thumb_height, :thumb_photo_url
  
  BASE_URL = 'http://localhost:3000'
  MISSING = "MISSING PHOTO URL"
  MISSING_THUMB = "MISSING THUMB PHOTO URL"
  
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