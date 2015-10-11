class UploadsController < ApplicationController
  guest_array = [:locations,:events,:index,:show,:explore]
  
  skip_before_filter :verify_authenticity_token, except: guest_array, if: lambda { |c| c.request.format.json? }
  acts_as_token_authentication_handler_for User, except: guest_array, if: lambda { |c| c.request.format.json? }, fallback: :exception
  before_filter :authenticate_user!, except: guest_array, unless: lambda { |c| c.request.format.json? }
  
  before_filter :ensure_upload, only: [:create, :update]
  before_action :set_upload, only: [:show, :edit, :update, :destroy]

  ## JSON routes
  ##############
  
  def events
    events = Upload.pluck(:tags).uniq
    respond_to do |format|
      format.json { render json: events }
    end
  end
  def locations
    locations = Upload.pluck(:location).uniq
    respond_to do |format|
      format.json { render json: locations }
    end
  end
  
  # GET /uploads/1
  # GET /uploads/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @upload }
    end
  end
  
  def account
    respond_to do |format|
      format.json { render json: current_user }
    end
  end

  # GET /myphotos.json
  # GET /myphotos
  def myphotos
    @uploads = current_user.uploads
    filter_uploads
    respond_to do |format|
      format.html
      format.json { render json: @uploads }
    end
  end

  # GET /uploads.json
  # GET /uploads
  def index
    @uploads = Upload.where(nil)
    filter_uploads
    respond_to do |format|
      format.html {
        if current_user
          @favorites = current_user.favorite_uploads
          @purchases = current_user.purchase_uploads
        end
      }
      format.json { render json: @uploads }
    end
  end
  
  # PATCH/PUT /uploads/1.json
  # PATCH/PUT /uploads/1
  # updates a single photo
  def update
    respond_to do |format|
      if @upload.update(upload_params)
        notice ='Upload was successfully saved.'
        format.html { redirect_to @upload, notice: notice }
        format.json { render json: @upload, status: :ok }
      else
        format.html { render :edit }
        format.json { render json: {errors: @upload.errors}, status: :unprocessable_entity }
      end
    end
  end
  
  # POST /uploads
  # POST /uploads.json
  # creates a single photo, OR an array of photos
  def create
    success = true
    photos = params[:upload].delete(:photos)
    u = upload_params
    respond_to do |format|
      if photos ## Batch photo upload
        photos.each do |p|
          @upload = Upload.new(u)
          @upload.user = current_user
          @upload.photo = p
          success = @upload.save
          break unless success
        end
      else # Simple single photo upload
        @upload = Upload.new(u)
        @upload.user = current_user
        success = @upload.save
      end
      if success
        notice = 'Upload was successfully saved.'
        @uploads = current_user.uploads
        filter_uploads
        format.html { redirect_to uploads_url, notice: notice }
        format.json { render json: @uploads, status: :created }
      else
        format.html { render :new }
        format.json { render json: {errors: @upload.errors}, status: :unprocessable_entity }
      end
      
    end
  end
  
  # DELETE /uploads/1
  # DELETE /uploads/1.json
  def destroy
    @upload.destroy
    respond_to do |format|
      notice = 'Photo was successfully deleted.'
      format.html { redirect_to uploads_url, notice: notice }
      format.json { render json: {notice: notice} }
    end
  end

  
  ## NON-JSON routes
  ##################

  # GET /uploads/1/edit
  def edit
  end
  
  # GET /uploads/new
  def new
    @upload = Upload.new
  end
  
 private
   def ensure_upload
    unless params[:upload]
      render :json=>{:error=>"missing required 'upload' parameter"}, :status=>422
    end
   end
   
   def set_upload
     @upload = Upload.find(params[:id])
   end
 
   def upload_params
      params.require(:upload).permit(:location, :photo, :event, :copyright, :photos => [])
   end
end