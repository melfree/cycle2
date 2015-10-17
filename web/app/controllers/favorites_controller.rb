class FavoritesController < ApplicationController
  skip_before_filter :verify_authenticity_token, if: lambda { |c| c.request.format.json? }
  acts_as_token_authentication_handler_for User, if: lambda { |c| c.request.format.json? }, fallback: :exception
  before_filter :authenticate_user!, unless: lambda { |c| c.request.format.json? }
  
  before_action :set_favorite, only: [:show,:log]
  
  ## JSON routes
  ##############
  def userlog
    respond_to do |format|
      format.json { render json: format_log(current_user.favorites) }
    end
  end
  def revuserlogs
    favs = Favorite.joins(:upload).where("uploads.user_id = ?", current_user.id)
    respond_to do |format|
      format.json { render json: format_log(favs) }
    end
  end
  def log
    respond_to do |format|
      format.json { render json: format_log(@favorite.favorites) }
    end
  end
  
  # GET /favorites/1
  # GET /favorites/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @favorite }
    end
  end

  # GET /favorites.json
  # GET /favorites
  def index
    @uploads = current_user.favorite_uploads
    filter_uploads
    respond_to do |format|
      format.html
      format.json { render json: @uploads }
    end
  end
  
  # POST /favorites
  # POST /favorites.json
  # creates a single photo, OR an array of photos
  def create
    @favorite = Favorite.new
    @favorite.upload = Upload.find_by_id params[:id]
    @favorite.user = current_user
    respond_to do |format|
      if @favorite.save
        notice = 'Photo was successfully favorited.'
        format.html { redirect_to uploads_url, notice: notice }
        format.json { render json: @favorite.upload, status: :created }
      else
        format.html { redirect_to uploads_url, notice: 'That photo is already favorited' }
        format.json { render json: {errors: @favorite.errors}, status: :unprocessable_entity }
      end
      
    end
  end
  
  # DELETE /favorites/1
  # DELETE /favorites/1.json
  def destroy
    @favorite = Favorite.where(upload_id: params[:id]).where(user_id: current_user.id).take
    @favorite.destroy
    respond_to do |format|
      notice = 'Photo successfully removed from favorites.'
      format.html { redirect_to uploads_url, notice: notice }
      format.json { render json: {notice: notice} }
    end
  end 
  
 private
   def set_favorite
     @favorite = Upload.find_by id: params[:id]
   end
end