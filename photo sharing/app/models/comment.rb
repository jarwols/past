class Comment < ActiveRecord::Base
	belongs_to :user 
	belongs_to :photo

	validate :validate_comment 
	def self.filter(substring)
		substring = "" if substring.nil? 
		Comment.all.select { |comment| comment.comment.downcase.include?(substring.downcase) }
	end
	def validate_comment 
		if comment.empty? then 
			errors.add(:comment, "Error: Please enter a comment before posting, thanks!")
		end
	end
end
