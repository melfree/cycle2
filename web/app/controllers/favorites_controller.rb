class FavoritesController < ApplicationController
  skip_before_filter :verify_authenticity_token, if: lambda { |c| c.request.format.json? }
  acts_as_token_authentication_handler_for User, if: lambda { |c| c.request.format.json? }, fallback: :exception
  before_filter :authenticate_user!, unless: lambda { |c| c.request.format.json? }
  
  before_action :set_favorite, only: [:show, :destroy]
  
  ## JSON routes
  ##############
  
  # GET /favorites/1
  # GET /favorites/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: {favorite: @favorite} }
    end
  end

  # GET /favorites.json
  # GET /favorites
  def index
    @favorites = current_user.favorites.map{|o| o.upload}
    respond_to do |format|
      format.html
      format.json { render json: {favorites: @favorites} }
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
        format.json { render json: {notice: notice, favorite: @favorite.upload}, status: :created }
      else
        format.html { render :new }
        format.json { render json: {errors: @favorite.errors}, status: :unprocessable_entity }
      end
      
    end
  end
  
  # DELETE /favorites/1
  # DELETE /favorites/1.json
  def destroy
    @favorite.destroy
    respond_to do |format|
      notice = 'Photo successfully removed from favorites.'
      format.html { redirect_to uploads_url, notice: notice }
      format.json { render json: {notice: notice} }
    end
  end
  
  
 private
   def set_favorite
     @favorite = Favorite.find_by upload_id: params[:id]
     @favorite = @favorite.upload if @favorite
   end
end