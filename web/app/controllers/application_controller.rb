class ApplicationController < ActionController::Base
  respond_to :html, :json
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  
  
  # JSON authtoken handler
  # https://github.com/gonzalo-bulnes/simple_token_authentication

  protect_from_forgery with: :null_session#, :if => Proc.new { |c| c.request.format == 'application/json' }
end
