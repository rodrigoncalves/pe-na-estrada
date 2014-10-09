class Accident < ActiveRecord::Base

  validates_presence_of :uf
  validates_presence_of :km
  validates_presence_of :br

  belongs_to :Highway

  def self.count_accidents
    group(:br).count
  end

  def self.total_accidents
 	Accident.count
  end

end