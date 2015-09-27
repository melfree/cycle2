class User < ActiveRecord::Base
  has_many :uploads
  has_many :purchases
  has_many :favorites
  
  # Can upload many uploads (photos) at once
  accepts_nested_attributes_for :uploads
  
  # JSON auth_token
  acts_as_token_authenticatable
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
end
