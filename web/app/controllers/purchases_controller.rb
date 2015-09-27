class FavoritesController < ApplicationController
  before_filter :ensure_purchase, only: [:create]
  before_action :set_purchase, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!
  
  ## JSON routes
  ##############
  
  # GET /purchases/1
  # GET /purchases/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @purchase }
    end
  end

  # GET /purchases.json
  # GET /purchases
  def index
    @purchases = current_user.purchases
    respond_to do |format|
      format.html
      format.json { render json: @purchases }
    end
  end
  
  # POST /purchases
  # POST /purchases.json
  # creates a single photo, OR an array of photos
  def create
    @purchase = Purchase.new(purchase_params)
    @purchase.user = current_user
    respond_to do |format|
      if @purchase.save
        format.html { redirect_to uploads_url, notice: 'Photo was successfully purchased.' }
        format.json { render json: @purchase, status: :created }
      else
        format.html { render :new }
        format.json { render json: @purchase.errors, status: :unprocessable_entity }
      end
      
    end
  end
  
 private
   def ensure_purchase
    return unless params[:purchase].blank?
    render :json=>{:success=>false, :message=>"missing 'purchase' parameter"}, :status=>422
   end
 
   def set_purchase
      @purchase = Purchase.find(params[:id])
   end
 
   def purchase_params
      params.require(:purchase).permit(:upload_id)
   end
end