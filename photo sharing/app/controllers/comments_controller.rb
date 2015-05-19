class CommentsController < ApplicationController
	def new
		if params[:id] != nil && Photo.all.exists?(params[:id])
 			@photo = Photo.find(params[:id])
 			@comment = Comment.new 
 		end 
	end 
	def create
		@photo = Photo.find(params[:id])
		if session[:user] != nil  
			@comment = Comment.new(:date_time => DateTime.now, :comment => params[:comment][:comment], :user_id => session[:user].id, :photo_id => @photo.id)
			if @comment.save
				redirect_to(:controller => "photos", :action => "index", :id => @photo.user.id)
			else 
				render(:controller => "comments", :action => "new", :id => @photo.id)
			end

		else
			redirect_to(:controller => "photos", :action => "index", :id => @photo.user.id)
		end 

	end 
end
