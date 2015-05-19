class TagsController < ApplicationController
	def tag
		@photo = Photo.find(params[:id])
		@users = User.all 
		@tag = Tag.new
		@allTags = Tag.all 
		if(params[:tag] && params[:tag][:x_coord] != "" && session[:user] != nil && (params[:tag][:div_width] != "1px" && params[:tag][:div_height] != "1px"))
			@tag.user_id = params[:user_id]
			@tag.photo_id = params[:id]
			@tag.div_width = params[:tag][:div_width]
			@tag.div_height = params[:tag][:div_height]
			@tag.x_coord = params[:tag][:x_coord] 
			@tag.y_coord = params[:tag][:y_coord] 
			@tag.save
			redirect_to(:controller => "tags", :action => "tag", :id => params[:id])
		elsif (params[:tag] && (params[:tag][:x_coord] == "1px" || params[:tag][:x_coord]))
			flash[:notice] = "Please tag a user in the photo." 
			render(:controller => "tags", :action => "tag", :id => params[:id]) 
		elsif (session[:user] == nil) 
			flash[:notice] = "Please login to RuBee to tag users." 
			render(:controller => "tags", :action => "tag", :id => params[:id]) 
		end
	end
end
