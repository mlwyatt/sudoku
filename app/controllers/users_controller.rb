class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update, :destroy]
  before_action :correct_user, only: [:edit, :update]
  before_action :admin_user, only: :destroy
  before_filter :force_trailing_slash, only: [:show, :index]

  def index
    @users = User.all
  end

  def new
    @user = User.new
    render(partial: 'users/partials/new', layout: false)
  end

  def show
    @user = User.find(params[:id])
  end

  def create
    @user = User.new(user_params)
    if @user.save
      @users = User.all
    else
    end
    @users = User.all if @users.nil?()
    render(partial: 'users/partials/index', layout: false)
  end

  def edit
    @user = User.find(params[:id])
    if current_user?(@user)
      render(json: {index: render_to_string(partial: 'users/partials/edit', layout: false)}, layout: false)
    else
      render(partial: 'users/partials/index', layout: false)
    end
  end

  def update
    @users = User.all
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      @users.reload
      render(partial: 'users/partials/index', layout: false)
    else
      render(partial: 'users/partials/edit', layout: false)
    end
  end

  def delete
    @user = User.find(params[:user_id])
  end

  def destroy
    @users = User.all
    @user = User.find(params[:id])
    @user.destroy
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end

  def correct_user
    @user = User.find(params[:id])
    redirect_to(root_url) unless current_user?(@user)
  end

end
