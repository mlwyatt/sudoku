class SessionsController < ApplicationController

  def new
  end

  # Creates a session (happens when a user attempts to logs in)
  def create
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user && @user.authenticate(params[:session][:password])
      if @user.activated?
        log_in @user
        params[:session][:remember_me] == '1' ? remember(@user) : forget(@user)
        redirect_back_or @user
      else
        flash[:warning] =  'Account not activated. Check your email for the activation link.'
        redirect_to root_url
      end
    else
      session.delete(:forwarding_url)
      flash.now[:danger] = 'Invalid email/password combination. Please try again.'
      render 'new'
    end
  end

  def destroy
    log_out if logged_in?
    render 'new'
  end
end
