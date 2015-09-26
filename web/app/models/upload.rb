class Upload < ActiveRecord::Base
  belongs_to :user
  has_many :purchases
  has_many :favorites
end
