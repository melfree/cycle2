class User < ActiveRecord::Base
  has_many :uploads
  has_many :purchases
  has_many :purchase_uploads, through: :purchases, source: :upload
  has_many :favorites
  has_many :favorite_uploads, through: :favorites, source: :upload
  
  # JSON auth_token
  acts_as_token_authenticatable
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
         
end
