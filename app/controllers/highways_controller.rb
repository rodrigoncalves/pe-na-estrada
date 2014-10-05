class HighwaysController < ApplicationController

      MAX_HIGHWAY_NUMBER_LENGHT = 3
      
    	def index

	         @highway_informed_by_user = params[:highway_search]

	         if check_highway_number_length (@highway_informed_by_user)
	              @highway_number_exists = check_highway_exists (@highway_informed_by_user)
	         else
	               @highway_number_exists = false
	         end
	   
	       	 if @highway_informed_by_user
		      @highway = Highway.search_for_highway(check_highway_number(@highway_informed_by_user))
		 else
		      @highway = nil
		 end

	end

      	# Check the lenght of the highway number informed
      	def check_highway_number_length highway_number
            
	        if !highway_number.blank?
	          
	              highway_number_lenght = highway_number.size

	              if  highway_number_lenght > MAX_HIGHWAY_NUMBER_LENGHT
	                   return false
	              else
	                   return true
	              end

	        else
	              return false
           	end

      	end

      	# Check if a highway exists on DB
      	def check_highway_exists highway_to_check

		if Highway.exists?(['idBr LIKE ?', "%#{highway_to_check}%"])
			return true
		else
			return false
		end

	end

  	# Ignore '0's on left on highway number
  	def check_highway_number highway_number

	        if !highway_number.blank?
	              
	              i = 0

	              while highway_number.at(i) == "0"
	               
	        			highway_number = highway_number.from(i+1)

	              end

	              return highway_number

	        else
	   		return highway_number
	        end

	end

	def new
		
	end
	
	def show
		@accident = Accident.group(:br).count
		@highway = Highway.all.order(:accidentsRate).reverse_order
		@highways = Highway.all
			
		br_accident = nil
		count_accident = nil
		mileage_br = nil
		@accident.each do |br, count|
			br_accident = br
			count_accident = count.to_s
			@highways.each do |h|
				mileage_br = h.mileage.to_s
				if h.idBr == br_accident
					if mileage_br.blank?
						h.accidentsRate = 0.0
						h.save
					else
						h.accidentsRate = count_accident.to_f/mileage_br.to_f
						h.save
					end
				end
			end
		end
	end

=begin
	# Method used for parser
	def import
		Highway.import(params[:file])
		redirect_to highways_path, notice: "Dados rodovias importados com sucesso!"
	end
=end

end