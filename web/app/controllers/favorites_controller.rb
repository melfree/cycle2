class FavoritesController < ApplicationController
  skip_before_filter :verify_authenticity_token, if: lambda { |c| c.request.format.json? }
  acts_as_token_authentication_handler_for User, if: lambda { |c| c.request.format.json? }, fallback: :exception
  before_filter :authenticate_user!, unless: lambda { |c| c.request.format.json? }
  
  before_filter :ensure_favorite, only: [:create]
  before_action :set_favorite, only: [:show, :edit, :update, :destroy]
  
  ## JSON routes
  ##############
  
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
    @favorites = current_user.favorites
    respond_to do |format|
      format.html
      format.json { render json: @favorites }
    end
  end
  
  # POST /favorites
  # POST /favorites.json
  # creates a single photo, OR an array of photos
  def create
    @favorite = Favorite.new(favorite_params)
    @favorite.user = current_user
    respond_to do |format|
      if @favorite.save
        format.html { redirect_to uploads_url, notice: 'Photo was successfully favoritd.' }
        format.json { render json: @favorite, status: :created }
      else
        format.html { render :new }
        format.json { render json: @favorite.errors, status: :unprocessable_entity }
      end
      
    end
  end
  
  # DELETE /favorites/1
  # DELETE /favorites/1.json
  def destroy
    @favorite.destroy
    respond_to do |format|
      format.html { redirect_to uploads_url, notice: 'Photo successfully removed from favorites.' }
      format.json { head :no_content }
    end
  end
  
  
 private
   def ensure_favorite
    return unless params[:favorite].blank?
    render :json=>{:success=>false, :message=>"missing 'purchase' parameter"}, :status=>422
   end
 
   def set_favorite
     @favorite = Favorite.find(params[:id])
   end
 
   def favorite_params
      params.require(:favorite).permit(:upload_id)
   end
end