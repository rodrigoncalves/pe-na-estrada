class Accident < ActiveRecord::Base

  validates_presence_of :uf
  validates_presence_of :km
  validates_presence_of :br

  belongs_to :highway

  def self.count_accidents
    group(:br).count
  end

  def self.total_accidents
 	  Accident.count
  end

  def self.get_accidents_latitude
    all.map &:latitude
  end

  def self.get_accidents_longitude
    all.map &:longitude
  end

  def self.get_accidents_br
    all.map &:br
  end
end
