class Favorite < ActiveRecord::Base
  belongs_to :user
  belongs_to :upload
  
  validates_presence_of :user, :upload
  validates_uniqueness_of :user_id, scope: :upload_id
end
