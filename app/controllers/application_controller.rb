class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper

  protected

  def force_trailing_slash
    redirect_to request.original_url + '/' unless request.original_url.match(/\/$/)
  end

  private

  def send_json(args)
    args ||= {}
    args.reverse_merge! :success => true, :statusTxt => 'OK'
    render :json => args, :layout => false, :status => 200
  end

end
