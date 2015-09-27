class UploadsController < ApplicationController
  skip_before_filter :verify_authenticity_token, if: lambda { |c| c.request.format.json? }
  acts_as_token_authentication_handler_for User, if: lambda { |c| c.request.format.json? }, fallback: :exception
  before_filter :authenticate_user!, unless: lambda { |c| c.request.format.json? }
  
  before_filter :ensure_upload, only: [:create, :update]
  before_action :set_upload, only: [:show, :edit, :update, :destroy]

  ## JSON routes
  ##############
  
  # GET /uploads/1
  # GET /uploads/1.json
  def show
    respond_to do |format|
      format.html
      format.json { render json: @upload }
    end
  end

  # GET /uploads.json
  # GET /uploads
  def index
    @uploads = current_user.uploads
    respond_to do |format|
      format.html
      format.json { render json: @uploads }
    end
  end
  
  # PATCH/PUT /uploads/1.json
  # PATCH/PUT /uploads/1
  # updates a single photo
  def update
    respond_to do |format|
      if @upload.update(upload_params)
        format.html { redirect_to @upload, notice: 'Upload was successfully saved.' }
        format.json { render json: @upload, status: :ok }
      else
        format.html { render :edit }
        format.json { render json: @upload.errors, status: :unprocessable_entity }
      end
    end
  end
  
  # POST /uploads
  # POST /uploads.json
  # creates a single photo, OR an array of photos
  def create
    success = true
    photos = params[:upload].delete(:photos)
    respond_to do |format|
      if photos ## Batch photo upload
        photos.each do |p|
          @upload = Upload.new(upload_params)
          @upload.user = current_user
          @upload.photo = p
          success = @upload.save
          break unless success
        end
      else # Simple single photo upload
        @upload = Upload.new(upload_params)
        @upload.user = current_user
        success = @upload.save
      end
      if success
        format.html { redirect_to uploads_url, notice: 'Upload was successfully saved.' }
        format.json { render json: current_user.uploads, status: :created }
      else
        format.html { render :new }
        format.json { render json: @upload.errors, status: :unprocessable_entity }
      end
      
    end
  end
  
  # DELETE /uploads/1
  # DELETE /uploads/1.json
  def destroy
    @upload.destroy
    respond_to do |format|
      format.html { redirect_to uploads_url, notice: 'Photo was successfully deleted.' }
      format.json { head :no_content }
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
      render :json=>{:success=>false, :message=>"missing 'upload' parameter"}, :status=>422
    end
   end
   
   def set_upload
     @upload = Upload.find(params[:id])
   end
 
   def upload_params
      params.require(:upload).permit(:location, :photo, :tags, :copyright, :photos => [])
   end
end