class FavoritesController < ApplicationController
  skip_before_filter :verify_authenticity_token, if: lambda { |c| c.request.format.json? }
  acts_as_token_authentication_handler_for User, if: lambda { |c| c.request.format.json? }, fallback: :exception
  before_filter :authenticate_user!, unless: lambda { |c| c.request.format.json? }
  
  before_action :set_purchase, only: [:show]
  
  ## JSON routes
  ##############
  
  # GET /purchases/1
  # GET /purchases/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @purchase.upload }
    end
  end

  # GET /purchases.json
  # GET /purchases
  def index
    @uploads = current_user.purchase_uploads
    filter_uploads
    respond_to do |format|
      format.html
      format.json { render json: @uploads }
    end
  end
  
  # POST /purchases
  # POST /purchases.json
  # creates a single photo, OR an array of photos
  def create
    @purchase = Purchase.new
    @purchase.upload = Upload.find_by_id params[:id]
    @purchase.user = current_user
    respond_to do |format|
      if @purchase.save
        notice = 'Photo was successfully purchased.' 
        format.html { redirect_to uploads_url, notice: notice}
        format.json { render json: @purchase.upload, status: :created }
      else
        format.html { render :new }
        format.json { render json: {errors: @purchase.errors}, status: :unprocessable_entity }
      end
      
    end
  end
  
 private
   def set_purchase
      @purchase = Purchase.find_by upload_id: params[:id]
      @purchase = @purchase.upload if @purchase
   end
end