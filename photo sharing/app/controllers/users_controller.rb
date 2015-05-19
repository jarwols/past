class UsersController < ApplicationController
	def index 
		@users = User.all 
	end
	def new 
		@user = User.new
	end 
	def create 
		if User.find_by_login(params[:user][:login]) == nil 
			@user = User.new(:first_name => params[:user][:first_name], :last_name => params[:user][:last_name], :login => params[:user][:login])
			@user.password= params[:user][:password].to_s
			if(params[:user][:password] != params[:user][:password_confirmation]) 
				flash[:notice] = "Passwords do not match."
				redirect_to(:controller => "users", :action => "new")
			elsif @user.save 
				render(:controller => "users", :action => "login")
			else
				render(:controller => "users", :action => "new")
			end 
		else 
			flash[:notice] = "#{@user.login} is already taken!"
			redirect_to(:controller => "users", :action => "new")
		end
	end 
	def login 
	end 
	def post_login 
		name = params[:name]
		@logged = User.find_by_login(name) 
		if @logged != nil then 
			@password = params[:password].to_s
			if @logged.password_valid?(@password) 
				session[:id] = 0
				session[:user] = @logged
				redirect_to(:controller => "photos", :action => "index", :id => @logged.id) 
			else 
				flash[:notice] = "Invalid Username/Password Combination"
				redirect_to(:controller => "users", :action => "login")
			end 
		else
			flash[:notice] = "#{name} is not a valid username."
			redirect_to(:controller => "users", :action => "login") 
		end 
	end 
	def logout 
		reset_session 
		render(:action => "login")  
	end 
	def password_valid?(password)
	end
end
