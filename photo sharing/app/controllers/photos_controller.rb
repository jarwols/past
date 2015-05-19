class PhotosController < ApplicationController
	def index 
		if (params[:id] == nil || !User.all.exists?(params[:id])) 
			@user = nil
		else 
			@user = User.find(params[:id])
		end
		if (@user != nil) 
			@photos = @user.photos 
		end
	end
	def new 
		if session[:user] != nil 
 			@photo = Photo.new
 		end 
	end
	def create 
		if params[:photo] 
			uploaded_io = params[:photo][:photo]
	  		File.open(Rails.root.join('app', 'assets', 'images', uploaded_io.original_filename), 'wb') do |file|
	    		file.write(uploaded_io.read)
	    	end
	    	@photo = Photo.new(:date_time => DateTime.now, :file_name => uploaded_io.original_filename, :user_id => session[:user])
			@photo.user = session[:user]
			@photo.save
			redirect_to(:controller => "photos", :action => "index", :id => session[:user])
		else 
			flash[:notice] = "Please upload a non-empty photo."
			redirect_to(:controller => "photos", :action => "new") 
		end
	end 
	def find_photos
		@comments = Comment.filter(params[:substring])  
		@tags = Tag.filter(params[:substring])
		@results = Array.new 
		@comments.each do |comment| 
			@results << comment.photo
		end
		@tags.each do |tag| 
			@results << tag.photo
		end
		@results = @results.uniq
		render partial: "html_filter" 
	end 
end
 