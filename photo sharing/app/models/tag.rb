class Tag < ActiveRecord::Base
	belongs_to :photo
	belongs_to :user 
	def self.filter(substring)
		substring = "" if substring.nil? 
		puts(substring) 
		Tag.all.select { |tag| (User.find_by_id(tag.user_id)).name.downcase.include?(substring.downcase) }
	end
end
