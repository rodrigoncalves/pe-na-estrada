class Accident < ActiveRecord::Base

  validates_presence_of :longitude
  validates_presence_of :latitude
  validates_presence_of :uf
  validates_presence_of :km
  validates_presence_of :br

  belongs_to :Highway

  def self.count_accidents
    group(:br).count
  end

end