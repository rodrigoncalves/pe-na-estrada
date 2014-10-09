class Highway < ActiveRecord::Base

  validates_presence_of :idBr, message: 'idBr cannot be null.'
  validates_length_of :idBr, within: 2..3, too_short: 'The idBr is too short. Must be in the range 2..3.', too_long:'The idBr is too long. Must be in the range 2..3.'
  validates_uniqueness_of :idBr, message: "This idBr already exists on data base."

  # Change this if the type of mileage change on schema
  validates_numericality_of :mileage, greater_than_or_equal_to: 1, allow_nil: true, message: 'Mileage cannot be shorter than 1.'


  def self.search_for_highway id_to_search
      if id_to_search.blank?
        id_to_search = ""
      else
        # Nothing to do
      end

      # Return all highways registered if id_to_search is empty
      where("idBr LIKE ?", "%#{id_to_search}%").order(:idBr)
  end

  def self.exists_highway highway_to_check
    if highway_to_check.present?
      exists?(['idBr LIKE ?', "%#{highway_to_check}%"])
    else
      return false
    end

  end

  def self.all_highways_by_accidentsRate
      all.order(:accidentsRate).reverse_order
  end

  def self.all_highways_by_accidentsRatePercent
      all.order(:accidentsRatePercent).reverse_order
  end

end
