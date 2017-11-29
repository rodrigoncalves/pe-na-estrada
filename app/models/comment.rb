class Comment < ActiveRecord::Base
	belongs_to :Highway #, :foreign_key => :idBr, class_name: 'Highway'
	validates_presence_of :title
	validates_presence_of :text
	validates_presence_of :idBr

	def self.getComments
		all.reverse_order
	end
end
